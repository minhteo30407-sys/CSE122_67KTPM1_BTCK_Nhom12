// VolunteerLink: Shared local data, authentication, and remote synchronization services.
// Local data store, seed loading, and optional MockAPI synchronization.
const DATA_BASE_PATH = new URL("../assets/data/", document.currentScript.src)
  .href;

const DataStore = {
  getBasePath: function () {
    return DATA_BASE_PATH;
  },

  apiBaseUrl: "https://6ada264a7512f497b3ffad0b.mockapi.io/api/v1",
  remoteEntities: ["volunteers", "opportunities"],
  syncQueues: {},

  entities: [
    "volunteers",
    "organizations",
    "opportunities",
    "shifts",
    "registrations",
    "skills",
  ],
  initialization: null,

  init: function () {
    if (this.initialization) return this.initialization;

    this.initialization = (async () => {
      const downloadedSeeds = {};
      for (const entity of this.entities) {
        if (!localStorage.getItem("vl_" + entity)) {
          const response = await fetch(this.getBasePath() + entity + ".json");
          if (!response.ok) {
            throw new Error(
              "Không thể tải dữ liệu " +
                entity +
                ".json (HTTP " +
                response.status +
                ").",
            );
          }
          const data = await response.json();
          downloadedSeeds[entity] = data;
          localStorage.setItem("vl_" + entity, JSON.stringify(data));
          console.log("Đã tải dữ liệu:", entity);
        }
      }

      if (localStorage.getItem("vl_seed_version") !== "4") {
        for (const entity of this.entities) {
          let seedData = downloadedSeeds[entity];
          if (!seedData) {
            const response = await fetch(this.getBasePath() + entity + ".json");
            seedData = await response.json();
          }
          const existingData = this.getAll(entity);
          const existingIds = new Set(existingData.map((item) => item.id));
          seedData.forEach((item) => {
            if (!existingIds.has(item.id)) existingData.push(item);
          });
          this.save(entity, existingData);
        }
        localStorage.setItem("vl_seed_version", "4");
      }

      try {
        await this.loadRemoteEntities();
      } catch (error) {
        console.warn(
          "MockAPI không khả dụng, đã tiếp tục với dữ liệu cục bộ:",
          error,
        );
      }
      await Auth.ensureDemoAccount();
      console.log("DataStore đã khởi tạo xong!");
    })();

    return this.initialization;
  },

  requestRemote: async function (entity, method, id, body) {
    const url =
      this.apiBaseUrl + "/" + entity + (id ? "/" + encodeURIComponent(id) : "");
    const response = await fetch(url, {
      method: method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(
        "MockAPI " +
          method +
          " /" +
          entity +
          " thất bại (HTTP " +
          response.status +
          ").",
      );
    }
    if (response.status === 204) return null;
    return response.json();
  },

  remotePayload: function (entity, item) {
    const payload = Object.assign({}, item, { localId: item.id });
    delete payload.id;
    delete payload._mockApiId;
    if (entity === "volunteers") {
      delete payload.passwordHash;
      delete payload.passwordSalt;
      delete payload.credentialVersion;
    }
    return payload;
  },

  loadRemoteEntities: async function () {
    for (const entity of this.remoteEntities) {
      let remoteRecords = [];
      try {
        remoteRecords = await this.requestRemote(entity, "GET");
      } catch (error) {
        console.warn(
          "MockAPI /" + entity + " không khả dụng, đang dùng dữ liệu cục bộ.",
          error,
        );
        remoteRecords = this.getAll(entity);
      }

      if (!Array.isArray(remoteRecords)) {
        remoteRecords = this.getAll(entity);
      }

      if (remoteRecords.length === 0) {
        try {
          const seedResponse = await fetch(
            this.getBasePath() + entity + ".json",
          );
          if (!seedResponse.ok) {
            throw new Error(
              "Không thể tải dữ liệu mẫu " +
                entity +
                ".json (HTTP " +
                seedResponse.status +
                ").",
            );
          }
          const seeds = await seedResponse.json();
          for (const seed of seeds) {
            try {
              const created = await this.requestRemote(
                entity,
                "POST",
                null,
                this.remotePayload(entity, seed),
              );
              if (!created || created.id == null) {
                throw new Error(
                  "MockAPI không trả về ID khi tạo dữ liệu " + entity + ".",
                );
              }
              remoteRecords.push(created);
            } catch (error) {
              console.warn(
                "Không thể đồng bộ dữ liệu mẫu lên MockAPI /" + entity + ":",
                error,
              );
            }
          }
        } catch (error) {
          console.warn("Không thể nạp dữ liệu mẫu cho " + entity + ":", error);
          continue;
        }
      }

      if (
        !Array.isArray(remoteRecords) ||
        remoteRecords.some((record) => !record || record.id == null)
      ) {
        continue;
      }

      const existingRecords = this.getAll(entity);
      const normalizedRecords = remoteRecords.map((record) => {
        const existing = existingRecords.find(
          (item) =>
            (record.localId && item.id === record.localId) ||
            item.id === record.id ||
            (entity === "volunteers" && item.email === record.email) ||
            (entity === "opportunities" && item.title === record.title),
        );
        const localId =
          record.localId || (existing && existing.id) || record.id;
        return Object.assign({}, existing || {}, record, {
          id: String(localId),
          localId: String(localId),
          _mockApiId: String(record.id),
        });
      });
      const localOnlyAccounts =
        entity === "volunteers"
          ? existingRecords
              .filter(
                (item) =>
                  item.accountCreated === true &&
                  !normalizedRecords.some(
                    (record) =>
                      record.id === item.id || record.email === item.email,
                  ),
              )
              .map((item) => Object.assign({}, item, { _localOnly: true }))
          : [];
      this.save(entity, normalizedRecords.concat(localOnlyAccounts));
    }
  },

  syncRemote: function (entity, action, item) {
    if (!this.remoteEntities.includes(entity) || item._localOnly) return;

    const localId = String(item.id);
    const queueKey = entity + ":" + localId;
    const previous = this.syncQueues[queueKey] || Promise.resolve();
    const operation = previous.then(async () => {
      if (action === "delete") {
        if (item._mockApiId) {
          await this.requestRemote(entity, "DELETE", item._mockApiId);
        }
        return;
      }

      const payload = this.remotePayload(entity, item);
      let savedRecord;
      if (item._mockApiId) {
        savedRecord = await this.requestRemote(
          entity,
          "PUT",
          item._mockApiId,
          payload,
        );
      } else {
        savedRecord = await this.requestRemote(entity, "POST", null, payload);
      }
      if (!savedRecord || savedRecord.id == null) {
        throw new Error(
          "MockAPI không trả về ID khi lưu dữ liệu " + entity + ".",
        );
      }

      const current = this.getAll(entity);
      const savedItem = current.find((record) => String(record.id) === localId);
      if (savedItem && savedRecord && savedRecord.id) {
        savedItem._mockApiId = String(savedRecord.id);
        this.save(entity, current);
      }
    });
    this.syncQueues[queueKey] = operation.catch((error) => {
      console.error("Không thể đồng bộ " + entity + " với MockAPI:", error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vl:apisyncerror", {
            detail: { message: error.message },
          }),
        );
      }
    });
  },

  getAll: function (entity) {
    const data = localStorage.getItem("vl_" + entity);
    return data ? JSON.parse(data) : [];
  },

  getById: function (entity, id) {
    const data = this.getAll(entity);
    return data.find((item) => item.id === id) || null;
  },

  filter: function (entity, conditions) {
    const data = this.getAll(entity);
    return data.filter((item) => {
      for (const key in conditions) {
        if (item[key] !== conditions[key]) return false;
      }
      return true;
    });
  },

  search: function (entity, keyword, fields) {
    if (!keyword) return this.getAll(entity);
    const lower = keyword.toLowerCase();
    const data = this.getAll(entity);
    return data.filter((item) => {
      return fields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lower);
        }
        return false;
      });
    });
  },

  add: function (entity, item) {
    const data = this.getAll(entity);

    if (!item.id) {
      const prefix = entity.substring(0, 3).toUpperCase();
      const maxNum = data.reduce((max, d) => {
        const num = parseInt(d.id.replace(/\D/g, "")) || 0;
        return num > max ? num : max;
      }, 0);
      item.id = prefix + String(maxNum + 1).padStart(3, "0");
    }
    data.push(item);
    this.save(entity, data);
    this.syncRemote(entity, "save", item);
    return item;
  },

  update: function (entity, id, updates) {
    const data = this.getAll(entity);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;

    Object.assign(data[index], updates);
    this.save(entity, data);
    this.syncRemote(entity, "save", data[index]);
    return data[index];
  },

  remove: function (entity, id) {
    let data = this.getAll(entity);
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const [removed] = data.splice(index, 1);
    this.save(entity, data);
    this.syncRemote(entity, "delete", removed);
    return true;
  },

  save: function (entity, data) {
    localStorage.setItem("vl_" + entity, JSON.stringify(data));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("vl:datachange", {
          detail: { entity: entity },
        }),
      );
    }
  },

  registerVolunteer: function (volunteerId, shiftId, status) {
    const user = Auth.getCurrentUser();
    const volunteer = this.getById("volunteers", volunteerId);
    const shift = this.getById("shifts", shiftId);
    const opportunity = shift && this.getById("opportunities", shift.oppId);
    const registrationStatus = status || "pending";

    if (
      !user ||
      !volunteer ||
      !shift ||
      !opportunity ||
      !["volunteer", "coordinator"].includes(user.role) ||
      (user.role === "volunteer" && user.id !== volunteerId) ||
      volunteer.status !== "active" ||
      !["pending", "confirmed"].includes(registrationStatus)
    ) {
      throw new Error(
        "Không có quyền hoặc không đủ thông tin để đăng ký ca này.",
      );
    }
    if (shift.status !== "open" || opportunity.status !== "open") {
      throw new Error("Ca hoặc hoạt động hiện không nhận đăng ký.");
    }
    if (shift.currentVolunteers >= shift.requiredVolunteers) {
      throw new Error("Ca trực đã đủ tình nguyện viên.");
    }

    const existing = this.filter("registrations", {
      volunteerId: volunteerId,
      shiftId: shiftId,
    });
    if (
      existing.some((registration) =>
        ["pending", "confirmed", "completed"].includes(registration.status),
      )
    ) {
      throw new Error("Tình nguyện viên đã đăng ký ca này.");
    }

    const registration = this.add("registrations", {
      volunteerId: volunteerId,
      shiftId: shiftId,
      status: registrationStatus,
      registeredAt: new Date().toISOString(),
      hoursLogged: 0,
    });
    const currentVolunteers = (Number(shift.currentVolunteers) || 0) + 1;
    this.update("shifts", shiftId, {
      currentVolunteers: currentVolunteers,
      status: currentVolunteers >= shift.requiredVolunteers ? "filled" : "open",
    });
    return registration;
  },

  updateRegistrationStatus: function (registrationId, nextStatus) {
    const registration = this.getById("registrations", registrationId);
    const allowedStatuses = ["confirmed", "rejected", "cancelled", "completed"];
    if (!registration || !allowedStatuses.includes(nextStatus)) {
      throw new Error("Trạng thái đăng ký không hợp lệ.");
    }

    const user = Auth.getCurrentUser();
    const shift = this.getById("shifts", registration.shiftId);
    const opportunity = shift && this.getById("opportunities", shift.oppId);
    const isOwner =
      user &&
      user.role === "organization" &&
      opportunity &&
      opportunity.orgId === user.id;
    const isCoordinator = user && user.role === "coordinator";
    const isVolunteerCancel =
      user &&
      user.role === "volunteer" &&
      user.id === registration.volunteerId &&
      nextStatus === "cancelled";
    if (!isOwner && !isCoordinator && !isVolunteerCancel) {
      throw new Error("Bạn không có quyền cập nhật đăng ký này.");
    }

    const transitions = {
      pending: ["confirmed", "rejected", "cancelled"],
      confirmed: ["completed", "cancelled"],
    };
    if (
      !transitions[registration.status] ||
      !transitions[registration.status].includes(nextStatus)
    ) {
      throw new Error(
        "Không thể chuyển đăng ký từ " +
          registration.status +
          " sang " +
          nextStatus +
          ".",
      );
    }

    let hoursLogged = Number(registration.hoursLogged) || 0;
    if (nextStatus === "completed") {
      if (!shift || !shift.startTime || !shift.endTime) {
        throw new Error(
          "Không thể tính số giờ vì ca trực thiếu giờ bắt đầu hoặc kết thúc.",
        );
      }
      const [startHour, startMinute] = shift.startTime.split(":").map(Number);
      const [endHour, endMinute] = shift.endTime.split(":").map(Number);
      let duration = endHour * 60 + endMinute - (startHour * 60 + startMinute);
      if (duration <= 0) duration += 24 * 60;
      hoursLogged = Math.round((duration / 60) * 100) / 100;
    }

    const updated = this.update("registrations", registrationId, {
      status: nextStatus,
      hoursLogged:
        nextStatus === "completed" ? hoursLogged : registration.hoursLogged,
    });

    if (
      ["rejected", "cancelled"].includes(nextStatus) &&
      ["pending", "confirmed"].includes(registration.status) &&
      shift
    ) {
      const currentVolunteers = Math.max(
        0,
        (Number(shift.currentVolunteers) || 0) - 1,
      );
      this.update("shifts", shift.id, {
        currentVolunteers: currentVolunteers,
        status: shift.status === "filled" ? "open" : shift.status,
      });
    }

    if (nextStatus === "completed") {
      const volunteerRegistrations = this.filter("registrations", {
        volunteerId: registration.volunteerId,
        status: "completed",
      });
      const totalHours = volunteerRegistrations.reduce(
        (total, item) => total + (Number(item.hoursLogged) || 0),
        0,
      );
      this.update("volunteers", registration.volunteerId, {
        totalHours: totalHours,
      });
    }

    return updated;
  },

  removeRegistration: function (registrationId) {
    const registration = this.getById("registrations", registrationId);
    const user = Auth.getCurrentUser();
    const shift = registration && this.getById("shifts", registration.shiftId);
    const opportunity = shift && this.getById("opportunities", shift.oppId);
    const isOwner =
      user &&
      user.role === "organization" &&
      opportunity &&
      opportunity.orgId === user.id;
    if (!registration || (!isOwner && (!user || user.role !== "coordinator"))) {
      throw new Error("Bạn không có quyền xóa đăng ký này.");
    }

    if (shift && ["pending", "confirmed"].includes(registration.status)) {
      const currentVolunteers = Math.max(
        0,
        (Number(shift.currentVolunteers) || 0) - 1,
      );
      this.update("shifts", shift.id, {
        currentVolunteers: currentVolunteers,
        status: shift.status === "filled" ? "open" : shift.status,
      });
    }
    this.remove("registrations", registrationId);
    return true;
  },

  reset: async function () {
    this.entities.forEach((entity) => {
      localStorage.removeItem("vl_" + entity);
    });
    localStorage.removeItem("vl_seed_version");
    localStorage.removeItem("vl_currentUser");
    sessionStorage.removeItem("vl_currentUser");
    this.initialization = null;
    await this.init();
  },

  getSkillName: function (skillId) {
    const skill = this.getById("skills", skillId);
    return skill ? skill.name : skillId;
  },

  getOrgName: function (orgId) {
    const org = this.getById("organizations", orgId);
    return org ? org.name : orgId;
  },

  getOppTitle: function (oppId) {
    const opp = this.getById("opportunities", oppId);
    return opp ? opp.title : oppId;
  },

  getVolunteerName: function (volunteerId) {
    const vol = this.getById("volunteers", volunteerId);
    return vol ? vol.name : volunteerId;
  },

  count: function (entity, conditions) {
    if (!conditions) return this.getAll(entity).length;
    return this.filter(entity, conditions).length;
  },
};

// Account registration, password verification, and session management.
const Auth = {
  demoEmail: "an.nguyen@email.com",
  demoPassword: "VolunteerLink@2026",

  hashPassword: async function (password, salt) {
    const crypto = window.crypto;
    if (!crypto || !crypto.subtle || typeof TextEncoder === "undefined") {
      throw new Error(
        "Trình duyệt không hỗ trợ bảo mật mật khẩu. Hãy mở website qua HTTPS hoặc Live Server.",
      );
    }

    const passwordSalt =
      salt ||
      Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const digest = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode(passwordSalt),
        iterations: 120000,
        hash: "SHA-256",
      },
      key,
      256,
    );
    const passwordHash = Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return { passwordSalt, passwordHash };
  },

  ensureDemoAccount: async function () {
    const demo = DataStore.getById("volunteers", "V001");
    if (!demo) return;

    const completedRegistrations = DataStore.filter("registrations", {
      volunteerId: demo.id,
      status: "completed",
    }).filter((registration) => {
      const shift = DataStore.getById("shifts", registration.shiftId);
      return Boolean(shift);
    });
    const totalHours = completedRegistrations.reduce(
      (total, registration) => total + (Number(registration.hoursLogged) || 0),
      0,
    );
    const updates = {
      accountCreated: true,
      status: "active",
      totalHours: totalHours,
    };
    if (
      demo.credentialVersion !== "pbkdf2-v1" ||
      !demo.passwordHash ||
      !demo.passwordSalt
    ) {
      Object.assign(updates, await this.hashPassword(this.demoPassword), {
        credentialVersion: "pbkdf2-v1",
      });
    }
    DataStore.update("volunteers", demo.id, updates);
  },

  getRegisteredAccounts: function () {
    return DataStore.getAll("volunteers")
      .concat(DataStore.getAll("organizations"))
      .filter((account) => account.accountCreated === true);
  },

  startSession: function (account, remember) {
    const user = {
      id: account.id,
      email: account.email,
      role: account.role,
      name: account.name,
      loggedIn: true,
      sessionVersion: "pbkdf2-v1",
    };
    const storage = remember === false ? sessionStorage : localStorage;
    const otherStorage = remember === false ? localStorage : sessionStorage;
    otherStorage.removeItem("vl_currentUser");
    storage.setItem("vl_currentUser", JSON.stringify(user));
    return user;
  },

  syncCurrentUser: function (account) {
    if (!account) return;
    const persistentSession = localStorage.getItem("vl_currentUser");
    const temporarySession = sessionStorage.getItem("vl_currentUser");
    const session = temporarySession || persistentSession;
    if (!session) return;

    const user = JSON.parse(session);
    if (user.id !== account.id) return;
    user.email = account.email;
    user.name = account.name;
    const storage = temporarySession ? sessionStorage : localStorage;
    storage.setItem("vl_currentUser", JSON.stringify(user));
  },

  createAccount: async function (entity, account, password) {
    return FakeAPI.request("POST", "/auth/register", {
      entity,
      account,
      password,
    });
  },

  login: async function (email, password, remember) {
    return FakeAPI.request("POST", "/auth/login", {
      email,
      password,
      remember,
    });
  },

  getVolunteerProfile: function (id) {
    return FakeAPI.request(
      "GET",
      "/volunteers/" + encodeURIComponent(id) + "/profile",
    );
  },

  updateVolunteerProfile: function (id, updates) {
    return FakeAPI.request(
      "PATCH",
      "/volunteers/" + encodeURIComponent(id) + "/profile",
      updates,
    );
  },

  getVolunteerRegistrations: function (id) {
    return FakeAPI.request(
      "GET",
      "/volunteers/" + encodeURIComponent(id) + "/registrations",
    );
  },

  logout: function () {
    localStorage.removeItem("vl_currentUser");
    sessionStorage.removeItem("vl_currentUser");
    window.location.href = getPageUrl("login");
  },

  getCurrentUser: function () {
    const storedUser =
      sessionStorage.getItem("vl_currentUser") ||
      localStorage.getItem("vl_currentUser");
    if (!storedUser) return null;

    const user = JSON.parse(storedUser);
    if (user.sessionVersion !== "pbkdf2-v1") {
      localStorage.removeItem("vl_currentUser");
      sessionStorage.removeItem("vl_currentUser");
      return null;
    }
    const account = this.getRegisteredAccounts().find(
      (registeredAccount) =>
        registeredAccount.id === user.id &&
        registeredAccount.email === user.email &&
        registeredAccount.role === user.role &&
        registeredAccount.status === "active",
    );
    if (!account || !account.passwordHash || !account.passwordSalt) {
      localStorage.removeItem("vl_currentUser");
      sessionStorage.removeItem("vl_currentUser");
      return null;
    }
    return user;
  },

  isLoggedIn: function () {
    return this.getCurrentUser() !== null;
  },

  requireLogin: function () {
    if (!this.isLoggedIn()) {
      window.location.href = getPageUrl("login");
      return false;
    }
    return true;
  },

  hasRole: function (role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  requireRole: function (requiredRole) {
    if (!this.requireLogin()) return false;
    if (!this.hasRole(requiredRole)) {
      window.location.href = getPageUrl("403");
      return false;
    }
    return true;
  },
};

// Local endpoint handlers used by the pages through the Auth interface.
const FakeAPI = {
  request: async function (method, path, body) {
    await DataStore.init();
    const normalizedMethod = method.toUpperCase();
    const payload = body || {};

    if (normalizedMethod === "POST" && path === "/auth/register") {
      const entity = payload.entity;
      const account = payload.account;
      if (
        !["volunteers", "organizations"].includes(entity) ||
        !account ||
        typeof account.email !== "string" ||
        !account.email.trim() ||
        typeof payload.password !== "string" ||
        payload.password.length < 6 ||
        account.role !==
          (entity === "volunteers" ? "volunteer" : "organization")
      ) {
        throw new Error("Thông tin đăng ký không hợp lệ.");
      }

      const email = account.email.trim().toLowerCase();
      const existingAccount = DataStore.getAll("volunteers")
        .concat(DataStore.getAll("organizations"))
        .find((existing) => existing.email.toLowerCase() === email);
      if (existingAccount) return null;

      const credentials = await Auth.hashPassword(payload.password);
      const savedAccount = DataStore.add(
        entity,
        Object.assign({}, account, credentials, {
          email: email,
          accountCreated: true,
          credentialVersion: "pbkdf2-v1",
        }),
      );
      return Auth.startSession(savedAccount);
    }

    if (normalizedMethod === "POST" && path === "/auth/login") {
      const email = String(payload.email || "")
        .trim()
        .toLowerCase();
      if (!email || typeof payload.password !== "string" || !payload.password)
        return null;
      const account = Auth.getRegisteredAccounts().find(
        (registeredAccount) => registeredAccount.email.toLowerCase() === email,
      );
      if (
        !account ||
        account.status !== "active" ||
        account.credentialVersion !== "pbkdf2-v1" ||
        !account.passwordSalt ||
        !account.passwordHash
      ) {
        return null;
      }

      const credentials = await Auth.hashPassword(
        payload.password,
        account.passwordSalt,
      );
      if (credentials.passwordHash !== account.passwordHash) return null;
      return Auth.startSession(account, payload.remember);
    }

    const profileMatch = path.match(/^\/volunteers\/([^/]+)\/profile$/);
    if (profileMatch && normalizedMethod === "GET") {
      const id = decodeURIComponent(profileMatch[1]);
      const currentUser = Auth.getCurrentUser();
      if (!currentUser || currentUser.id !== id) {
        throw new Error("Không có quyền xem hồ sơ của tài khoản này.");
      }
      return DataStore.getById("volunteers", id);
    }
    if (profileMatch && normalizedMethod === "PATCH") {
      const id = decodeURIComponent(profileMatch[1]);
      const currentUser = Auth.getCurrentUser();
      const account = DataStore.getById("volunteers", id);
      if (!currentUser || currentUser.id !== id || !account) {
        throw new Error("Không có quyền cập nhật hồ sơ này.");
      }

      const updates = {};
      ["name", "email", "phone", "skills", "availability"].forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(payload, field)) {
          updates[field] = payload[field];
        }
      });
      if (updates.email) {
        updates.email = updates.email.trim().toLowerCase();
        const duplicate = DataStore.getAll("volunteers")
          .concat(DataStore.getAll("organizations"))
          .some(
            (existing) =>
              existing.id !== id &&
              existing.email.toLowerCase() === updates.email,
          );
        if (duplicate)
          throw new Error("Email này đã được sử dụng bởi tài khoản khác.");
      }
      const updated = DataStore.update("volunteers", id, updates);
      Auth.syncCurrentUser(updated);
      return updated;
    }

    const registrationsMatch = path.match(
      /^\/volunteers\/([^/]+)\/registrations$/,
    );
    if (registrationsMatch && normalizedMethod === "GET") {
      const id = decodeURIComponent(registrationsMatch[1]);
      const currentUser = Auth.getCurrentUser();
      if (!currentUser || currentUser.id !== id) {
        throw new Error("Không có quyền xem các ca đăng ký của tài khoản này.");
      }
      return DataStore.filter("registrations", { volunteerId: id });
    }

    throw new Error(
      "Fake API không hỗ trợ endpoint: " + normalizedMethod + " " + path,
    );
  },
};
