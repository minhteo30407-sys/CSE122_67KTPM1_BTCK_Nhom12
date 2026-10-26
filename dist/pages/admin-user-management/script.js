// VolunteerLink: Page-specific interactions for admin user management.
const DEFAULT_STAFF_USERS = [
  {
    id: "COORD001",
    name: "Trần Văn Minh",
    email: "minh.tran@volunteerlink.vn",
    role: "coordinator",
    status: "active",
    totalHours: "-",
  },
  {
    id: "ADMIN001",
    name: "Nguyễn Bá Thành",
    email: "thanh.nguyen@volunteerlink.vn",
    role: "admin",
    status: "active",
    totalHours: "-",
  },
];

function getStaffUsers() {
  const saved = localStorage.getItem("vl_staff_users");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("vl_staff_users", JSON.stringify(DEFAULT_STAFF_USERS));
  return DEFAULT_STAFF_USERS;
}

function saveStaffUsers(list) {
  localStorage.setItem("vl_staff_users", JSON.stringify(list));
}

function getAllCombinedUsers() {
  const volunteers = DataStore.getAll("volunteers").map((v) => ({
    id: v.id,
    name: v.name,
    email: v.email,
    role: v.role || "volunteer",
    status: v.status || "active",
    totalHours: v.totalHours !== undefined ? v.totalHours + " giờ" : "0 giờ",
    type: "volunteer",
  }));

  const organizations = DataStore.getAll("organizations").map((o) => ({
    id: o.id,
    name: o.name,
    email: o.email,
    role: o.role || "organization",
    status: o.status || "active",
    totalHours: "-",
    type: "organization",
  }));

  const staff = getStaffUsers().map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    role: s.role,
    status: s.status,
    totalHours: "-",
    type: "staff",
  }));

  return [...volunteers, ...organizations, ...staff];
}

function renderRoleBadge(role) {
  switch (role) {
    case "volunteer":
      return '<span class="badge badge-info">Tình nguyện viên</span>';
    case "organization":
      return '<span class="badge badge-warning">Tổ chức xã hội</span>';
    case "coordinator":
      return '<span class="badge badge-ai">Điều phối viên</span>';
    case "admin":
      return '<span class="badge badge-success">Quản trị viên</span>';
    default:
      return `<span class="badge badge-info">${role}</span>`;
  }
}

function updateStats(users) {
  document.getElementById("totalUsersCount").textContent = users.length;
  document.getElementById("volunteerCount").textContent = users.filter(
    (u) => u.role === "volunteer",
  ).length;
  document.getElementById("orgCount").textContent = users.filter(
    (u) => u.role === "organization",
  ).length;
  document.getElementById("lockedUsersCount").textContent = users.filter(
    (u) => u.status === "locked",
  ).length;
}

function renderUserTable(users) {
  const tbody = document.getElementById("userTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!users || users.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(emptyDiv, "👤", "Không tìm thấy người dùng nào phù hợp.");
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  users.forEach((user) => {
    const isLocked = user.status === "locked";

    html += `
      <tr>
        <td data-label="Mã"><strong>${user.id}</strong></td>
        <td data-label="Họ và tên / Đơn vị">
          <div style="font-weight:600; color:var(--primary-dark);">${user.name}</div>
        </td>
        <td data-label="Email">${user.email}</td>
        <td data-label="Vai trò">${renderRoleBadge(user.role)}</td>
        <td data-label="Tổng giờ cống hiến">${user.totalHours}</td>
        <td data-label="Trạng thái">${statusBadge(user.status)}</td>
        <td data-label="Hành động">
          <div class="flex" style="gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="openRoleModal('${user.id}')">
              ⚙️ Đổi vai trò
            </button>
            ${
              isLocked
                ? `
              <button class="btn btn-sm btn-primary" onclick="toggleUserLock('${user.id}', false)">
                🔓 Mở khóa
              </button>
            `
                : `
              <button class="btn btn-sm btn-danger" onclick="toggleUserLock('${user.id}', true)">
                🔒 Khóa
              </button>
            `
            }
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterUsers() {
  const keyword = document
    .getElementById("userSearchInput")
    .value.trim()
    .toLowerCase();
  const role = document.getElementById("roleFilter").value;
  const status = document.getElementById("statusFilter").value;

  let list = getAllCombinedUsers();
  updateStats(list);

  if (role) {
    list = list.filter((u) => u.role === role);
  }

  if (status) {
    list = list.filter((u) => u.status === status);
  }

  if (keyword) {
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.id.toLowerCase().includes(keyword),
    );
  }

  renderUserTable(list);
}

function toggleUserLock(userId, shouldLock) {
  const actionText = shouldLock ? "khóa tài khoản" : "mở khóa tài khoản";
  if (!confirm(`Bạn có chắc muốn ${actionText} của người dùng ${userId}?`)) {
    return;
  }

  const newStatus = shouldLock ? "locked" : "active";

  if (DataStore.getById("volunteers", userId)) {
    DataStore.update("volunteers", userId, { status: newStatus });
  } else if (DataStore.getById("organizations", userId)) {
    DataStore.update("organizations", userId, { status: newStatus });
  } else {
    const staff = getStaffUsers();
    const member = staff.find((s) => s.id === userId);
    if (member) {
      member.status = newStatus;
      saveStaffUsers(staff);
    }
  }

  showToast(`Đã ${actionText} thành công!`, "success");
  filterUsers();
}

function openRoleModal(userId) {
  const all = getAllCombinedUsers();
  const user = all.find((u) => u.id === userId);
  if (!user) return;

  document.getElementById("roleUserId").value = user.id;
  document.getElementById("roleUserName").textContent =
    user.name + ` (${user.id})`;
  document.getElementById("roleUserEmail").textContent = user.email;
  document.getElementById("selectedRole").value = user.role;

  openModal("roleModal");
}

function handleRoleSubmit(e) {
  e.preventDefault();

  const userId = document.getElementById("roleUserId").value;
  const newRole = document.getElementById("selectedRole").value;

  if (DataStore.getById("volunteers", userId)) {
    DataStore.update("volunteers", userId, { role: newRole });
  } else if (DataStore.getById("organizations", userId)) {
    DataStore.update("organizations", userId, { role: newRole });
  } else {
    const staff = getStaffUsers();
    const member = staff.find((s) => s.id === userId);
    if (member) {
      member.role = newRole;
      saveStaffUsers(staff);
    }
  }

  closeModal("roleModal");
  showToast("Đã cập nhật vai trò người dùng!", "success");
  filterUsers();
}

function exportUserList() {
  const rows = [
    ["Mã", "Họ và tên", "Email", "Vai trò", "Trạng thái", "Tổng giờ"],
  ];
  getAllCombinedUsers().forEach((user) => {
    rows.push([
      user.id,
      user.name,
      user.email,
      user.role,
      user.status,
      user.totalHours,
    ]);
  });
  downloadCSV("danh-sach-nguoi-dung.csv", rows);
  showToast("Đã tải danh sách người dùng dạng CSV.", "success");
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("admin");
  await DataStore.init();
  filterUsers();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["volunteers", "organizations", "staff_users"].includes(event.detail.entity)
  ) {
    filterUsers();
  }
});
