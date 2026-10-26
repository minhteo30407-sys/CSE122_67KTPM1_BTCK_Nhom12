// VolunteerLink: Page-specific interactions for volunteer opportunity search.
let currentVolunteerId = "";
let latestRecommendationIds = [];

function getFavoriteIds() {
  const stored = localStorage.getItem(
    "vl_favorite_opportunities_" + currentVolunteerId,
  );
  if (!stored) return [];

  const favoriteIds = JSON.parse(stored);
  if (
    !Array.isArray(favoriteIds) ||
    favoriteIds.some((id) => typeof id !== "string")
  ) {
    throw new Error("Danh sách hoạt động yêu thích không hợp lệ.");
  }
  return favoriteIds;
}

function toggleFavorite(oppId) {
  try {
    const favoriteIds = getFavoriteIds();
    const index = favoriteIds.indexOf(oppId);
    if (index === -1) {
      favoriteIds.push(oppId);
    } else {
      favoriteIds.splice(index, 1);
    }
    localStorage.setItem(
      "vl_favorite_opportunities_" + currentVolunteerId,
      JSON.stringify(favoriteIds),
    );
    filterOpportunities();
  } catch (error) {
    showToast(
      error.message || "Không thể cập nhật danh sách yêu thích.",
      "error",
    );
  }
}

function renderOpportunitiesGrid(opps) {
  const grid = document.getElementById("opportunitiesGrid");
  const emptyDiv = document.getElementById("emptyContainer");
  const favoriteIds = getFavoriteIds();
  document.getElementById("favoriteCount").textContent = favoriteIds.length;

  if (!opps || opps.length === 0) {
    grid.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(
      emptyDiv,
      "🔍",
      document.getElementById("favoritesOnly").checked
        ? "Bạn chưa lưu hoạt động yêu thích nào phù hợp với bộ lọc."
        : "Không tìm thấy hoạt động nào phù hợp.",
    );
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  opps.forEach((opp) => {
    const orgName = DataStore.getOrgName(opp.orgId);
    const skillsHtml = skillTags(opp.requiredSkills || []);

    html += `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
        <div class="card-body">
          <div class="flex-between mb-1">
            <span class="badge badge-info">${opp.category || "Cộng đồng"}</span>
            <div class="opportunity-card-actions">
              ${statusBadge(opp.status)}
              <button type="button"
                class="btn btn-secondary btn-sm favorite-button ${favoriteIds.includes(opp.id) ? "is-favorite" : ""}"
                aria-pressed="${favoriteIds.includes(opp.id)}"
                aria-label="${favoriteIds.includes(opp.id) ? "Bỏ yêu thích" : "Lưu yêu thích"}: ${opp.title}"
                onclick="toggleFavorite('${opp.id}')">
                ${favoriteIds.includes(opp.id) ? "♥ Đã lưu" : "♡ Yêu thích"}
              </button>
            </div>
          </div>
          <h3 style="margin-bottom:8px; color:var(--primary-dark); font-size:17px;">${opp.title}</h3>
          <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
            ${opp.description}
          </p>
          <div style="font-size:13px; margin-bottom:6px;">
            <strong>🏢 Đơn vị tổ chức:</strong> ${orgName}
          </div>
          <div style="font-size:13px; margin-bottom:6px;">
            <strong>📍 Địa điểm:</strong> ${opp.location}
          </div>
          <div style="font-size:13px; margin-bottom:10px;">
            <strong>📅 Thời gian:</strong> ${formatDate(opp.startDate)} - ${formatDate(opp.endDate)}
          </div>
          <div style="margin-top:8px;">
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">Kỹ năng ưu tiên:</div>
            <div class="flex" style="flex-wrap:wrap; gap:4px;">
              ${skillsHtml || '<span style="font-size:12px; color:var(--text-secondary);">Không yêu cầu</span>'}
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-sm" style="width:100%;" onclick="openShiftsModal('${opp.id}')">
            📅 Xem các ca & Đăng ký
          </button>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function filterOpportunities() {
  const keyword = document
    .getElementById("oppSearchInput")
    .value.trim()
    .toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;
  const favoritesOnly = document.getElementById("favoritesOnly").checked;

  let list = DataStore.getAll("opportunities");
  if (favoritesOnly) {
    const favoriteIds = getFavoriteIds();
    list = list.filter((opportunity) => favoriteIds.includes(opportunity.id));
  }

  if (category) {
    list = list.filter((o) => o.category === category);
  }

  if (status) {
    list = list.filter((o) => o.status === status);
  }

  if (keyword) {
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(keyword) ||
        o.location.toLowerCase().includes(keyword) ||
        o.description.toLowerCase().includes(keyword),
    );
  }

  renderOpportunitiesGrid(list);
}

function openShiftsModal(oppId) {
  const opp = DataStore.getById("opportunities", oppId);
  if (!opp) return;

  document.getElementById("modalOppTitle").textContent = opp.title;
  document.getElementById("modalOppLocation").textContent =
    "📍 " + opp.location + " · " + DataStore.getOrgName(opp.orgId);

  const shifts = DataStore.filter("shifts", { oppId: oppId });
  const container = document.getElementById("modalShiftsList");

  if (shifts.length === 0) {
    container.innerHTML =
      '<p class="text-secondary text-center" style="padding:20px;">Hoạt động này hiện chưa mở ca trực nào.</p>';
    openModal("shiftsModal");
    return;
  }

  const myRegs = DataStore.filter("registrations", {
    volunteerId: currentVolunteerId,
  }).filter((registration) =>
    ["pending", "confirmed", "completed"].includes(registration.status),
  );
  const myShiftIds = myRegs.map((r) => r.shiftId);

  let html = "";
  shifts.forEach((shift) => {
    const isRegistered = myShiftIds.includes(shift.id);
    const isFull = shift.currentVolunteers >= shift.requiredVolunteers;
    const isCompleted =
      opp.status === "completed" || shift.status === "completed";
    const skillsHtml = skillTags(shift.requiredSkills || []);

    html += `
      <div style="border:1px solid var(--border); border-radius:var(--radius); padding:14px; background:var(--surface); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-weight:600; font-size:15px; color:var(--primary-dark);">
            Mã ca: ${shift.id} · ${formatDate(shift.date)}
          </div>
          <div style="font-size:13px; color:var(--text); margin-top:2px;">
            ⏰ Khung giờ: <strong>${shift.startTime} - ${shift.endTime}</strong>
          </div>
          <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">
            👥 Nhân sự: ${shift.currentVolunteers} / ${shift.requiredVolunteers} người
          </div>
          <div style="margin-top:6px;">
            ${skillsHtml}
          </div>
        </div>
        <div>
          ${
            isCompleted
              ? `
            <span class="badge badge-info" style="padding:6px 12px;">Ca đã hoàn thành</span>
          `
              : isRegistered
                ? `
            <span class="badge badge-success" style="padding:6px 12px;">✓ Đã đăng ký</span>
          `
                : isFull
                  ? `
            <span class="badge badge-error" style="padding:6px 12px;">Đã đủ người</span>
          `
                  : `
            <button class="btn btn-primary btn-sm" onclick="registerForShift('${shift.id}', '${oppId}')">
              Đăng ký tham gia
            </button>
          `
          }
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  openModal("shiftsModal");
}

function registerForShift(shiftId, oppId) {
  if (!currentVolunteerId) {
    showToast("Không tìm thấy tài khoản hoặc ca trực hợp lệ.", "error");
    return;
  }
  try {
    DataStore.registerVolunteer(currentVolunteerId, shiftId);
    showToast(
      "Đăng ký ca trực thành công! Vui lòng chờ tổ chức xác nhận.",
      "success",
    );
    openShiftsModal(oppId);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function initAIMatcher() {
  AIPanel.create({
    containerId: "aiVolunteerMatcherPanel",
    title: "AI Gợi ý hoạt động phù hợp (Volunteer Matcher)",
    description:
      "AI sẽ so khớp hồ sơ kỹ năng của bạn với các hoạt động đang tuyển quân để đưa ra lựa chọn lý tưởng nhất.",
    onRun: function () {
      const result = VolunteerMatcher.recommend(currentVolunteerId);
      latestRecommendationIds = result.items
        ? result.items.map((item) => item.data.id)
        : [];
      return result;
    },
    onAccept: function () {
      const favoriteIds = new Set(getFavoriteIds());
      latestRecommendationIds.forEach((id) => favoriteIds.add(id));
      localStorage.setItem(
        "vl_favorite_opportunities_" + currentVolunteerId,
        JSON.stringify(Array.from(favoriteIds)),
      );
      filterOpportunities();
    },
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("volunteer");
  await DataStore.init();

  const user = Auth.getCurrentUser();
  if (user && user.id) {
    const vol = DataStore.getAll("volunteers").find(
      (volunteer) => volunteer.id === user.id && volunteer.accountCreated,
    );
    if (vol) currentVolunteerId = vol.id;
  }

  initAIMatcher();
  filterOpportunities();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["opportunities", "shifts", "registrations"].includes(event.detail.entity)
  ) {
    filterOpportunities();
  }
});
