// VolunteerLink: Page-specific interactions for admin dashboard.
function dashboardEscape(value) {
  return escapeHTML(value == null ? "" : value);
}

function dashboardStaff() {
  const stored = localStorage.getItem("vl_staff_users");
  if (stored) return JSON.parse(stored);
  return [
    {
      id: "COORD001",
      name: "Trần Văn Minh",
      email: "minh.tran@volunteerlink.vn",
      role: "coordinator",
      status: "active",
      totalHours: 0,
    },
    {
      id: "ADMIN001",
      name: "Nguyễn Bá Thành",
      email: "thanh.nguyen@volunteerlink.vn",
      role: "admin",
      status: "active",
      totalHours: 0,
    },
  ];
}

function renderWeeklyRegistrations(registrations) {
  const chart = document.getElementById("weeklyRegistrationChart");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    const count = registrations.filter(
      (item) =>
        typeof item.registeredAt === "string" &&
        item.registeredAt.slice(0, 10) === key,
    ).length;
    return { date, key, count };
  });
  const peak = Math.max(1, ...days.map((day) => day.count));
  const total = days.reduce((sum, day) => sum + day.count, 0);
  document.getElementById("weeklyRegistrationTotal").textContent =
    total + " lượt";
  chart.innerHTML = days
    .map(
      (day) => `
    <div class="admin-bar-day" title="${day.key}: ${day.count} lượt">
      <span class="admin-bar-value">${day.count || ""}</span>
      <div class="admin-bar-track"><i style="height:${Math.max(6, (day.count / peak) * 100)}%"></i></div>
      <span class="admin-bar-label">${day.date.toLocaleDateString("vi-VN", { weekday: "short" })}</span>
    </div>
  `,
    )
    .join("");
}

function renderOpportunityCategories(opportunities) {
  const counts = opportunities
    .filter((item) => item.status === "open")
    .reduce((result, item) => {
      const category = item.category || "Khác";
      result[category] = (result[category] || 0) + 1;
      return result;
    }, {});
  const palette = [
    "#f29a21",
    "#47a978",
    "#5b9ee8",
    "#9a63c7",
    "#ed6d68",
    "#50b4ad",
  ];
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, entry) => sum + entry[1], 0);
  let offset = 0;
  const gradient = entries.map((entry, index) => {
    const start = (offset / Math.max(1, total)) * 100;
    offset += entry[1];
    return `${palette[index % palette.length]} ${start}% ${(offset / Math.max(1, total)) * 100}%`;
  });
  document.getElementById("openOpportunityCount").textContent = total;
  document.getElementById("opportunityDonut").style.background = total
    ? `conic-gradient(${gradient.join(", ")})`
    : "#e8edf0";
  document.getElementById("opportunityLegend").innerHTML = entries.length
    ? entries
        .map(
          (entry, index) => `
      <li><i style="--legend-color:${palette[index % palette.length]}"></i><span>${dashboardEscape(entry[0])}</span><strong>${entry[1]}</strong></li>
    `,
        )
        .join("")
    : '<li class="admin-no-data">Chưa có hoạt động đang mở</li>';
}

function renderRecentOpportunities(opportunities) {
  const items = [...opportunities]
    .sort((a, b) =>
      String(b.startDate || "").localeCompare(String(a.startDate || "")),
    )
    .slice(0, 4);
  const icons = {
    "Y tế": "✚",
    "Giáo dục": "📚",
    "Môi trường": "🌿",
    "Hậu cần": "🤲",
    "Ngôn ngữ": "🌏",
  };
  document.getElementById("recentOpportunityList").innerHTML = items.length
    ? items
        .map(
          (item) => `
      <a class="admin-recent-item" href="admin-moderation.html">
        <span class="admin-recent-icon">${icons[item.category] || "🌱"}</span>
        <span class="admin-recent-copy"><strong>${dashboardEscape(item.title)}</strong><small>${dashboardEscape(item.category || "Cộng đồng")} · ${dashboardEscape(item.location || "Đang cập nhật")}</small></span>
        <span class="admin-recent-date">${dashboardEscape(item.startDate ? formatDate(item.startDate) : "—")}</span>
      </a>
    `,
        )
        .join("")
    : '<p class="admin-no-data">Chưa có hoạt động nào.</p>';
}

function renderDashboardAlerts(opportunities, registrations, volunteers) {
  const moderation = JSON.parse(
    localStorage.getItem("vl_moderation_items") || "[]",
  );
  const pendingModeration = moderation.filter(
    (item) => item.status === "pending",
  ).length;
  const pendingRegistrations = registrations.filter(
    (item) => item.status === "pending",
  ).length;
  const lockedAccounts = [
    ...volunteers,
    ...DataStore.getAll("organizations"),
  ].filter((item) => item.status === "locked").length;
  const alerts = [
    {
      icon: "📋",
      tone: "warning",
      count: pendingModeration,
      label: "Nội dung đang chờ kiểm duyệt",
      href: "admin-moderation.html",
    },
    {
      icon: "🙋",
      tone: "info",
      count: pendingRegistrations,
      label: "Đăng ký ca đang chờ xác nhận",
      href: "admin-moderation.html",
    },
    {
      icon: "🔒",
      tone: "danger",
      count: lockedAccounts,
      label: "Tài khoản đang bị khóa",
      href: "admin-user-management.html",
    },
  ];
  const pending = pendingModeration + pendingRegistrations;
  document.getElementById("dashboardPendingCount").textContent = pending;
  document.getElementById("pendingActionCount").textContent = pending;
  document.getElementById("dashboardAlerts").innerHTML = alerts
    .map(
      (alert) => `
    <a class="admin-alert-item alert-${alert.tone}" href="${alert.href}">
      <span class="admin-alert-icon">${alert.icon}</span>
      <span>${alert.label}</span>
      <strong>${alert.count}</strong>
    </a>
  `,
    )
    .join("");
}

function renderRecentUsers(volunteers, organizations, staff) {
  const users = [
    ...volunteers.map((user) =>
      Object.assign({ role: "volunteer", totalHours: 0 }, user),
    ),
    ...organizations.map((user) =>
      Object.assign({ role: "organization", totalHours: 0 }, user),
    ),
    ...staff,
  ]
    .sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
    )
    .slice(0, 6);
  const roleLabels = {
    volunteer: "Tình nguyện viên",
    organization: "Tổ chức",
    coordinator: "Điều phối viên",
    admin: "Quản trị viên",
  };
  document.getElementById("recentUserTable").innerHTML = users.length
    ? users
        .map((user) => {
          const name = dashboardEscape(user.name || "Người dùng");
          const initials = name
            .trim()
            .split(/\s+/)
            .slice(-2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
          const status = user.status || "active";
          return `
        <tr>
          <td><span class="admin-user-cell"><i>${initials}</i><span><strong>${name}</strong><small>${dashboardEscape(user.email || "")}</small></span></span></td>
          <td>${dashboardEscape(roleLabels[user.role] || user.role || "Thành viên")}</td>
          <td>${Number(user.totalHours) || 0} giờ</td>
          <td><span class="admin-status status-${status}"><i></i>${status === "active" ? "Hoạt động" : status === "locked" ? "Đã khóa" : dashboardEscape(status)}</span></td>
          <td><a class="admin-row-action" href="admin-user-management.html">Quản lý</a></td>
        </tr>
      `;
        })
        .join("")
    : '<tr><td colspan="5" class="admin-no-data">Chưa có tài khoản.</td></tr>';
}

async function renderAdminDashboard() {
  await DataStore.init();
  renderLayout("admin");
  const volunteers = DataStore.getAll("volunteers");
  const organizations = DataStore.getAll("organizations");
  const opportunities = DataStore.getAll("opportunities");
  const shifts = DataStore.getAll("shifts");
  const registrations = DataStore.getAll("registrations");
  const staff = dashboardStaff();
  const admin = Auth.getCurrentUser();
  const completedHours = registrations
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + (Number(item.hoursLogged) || 0), 0);
  document.getElementById("dashboardWelcome").textContent = admin
    ? "Xin chào " + admin.name + " — đây là tình hình VolunteerLink hôm nay."
    : "Đây là tình hình VolunteerLink hôm nay.";
  document.getElementById("dashboardDate").textContent =
    new Date().toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  document.getElementById("dashboardVolunteerCount").textContent =
    volunteers.length;
  document.getElementById("dashboardOpportunityCount").textContent =
    opportunities.length;
  document.getElementById("dashboardHoursCount").textContent =
    completedHours.toLocaleString("vi-VN");
  renderWeeklyRegistrations(registrations);
  renderOpportunityCategories(opportunities);
  renderRecentOpportunities(opportunities);
  renderDashboardAlerts(opportunities, registrations, volunteers);
  renderRecentUsers(volunteers, organizations, staff);
  document.querySelector(
    ".admin-stat-card.stat-orange .admin-stat-note",
  ).textContent = shifts.length + " ca tình nguyện được lên lịch";
  document.querySelectorAll(".admin-dashboard-tabs a").forEach((tab) => {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".admin-dashboard-tabs a").forEach((item) => {
        item.classList.toggle("is-active", item === tab);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderAdminDashboard().catch((error) => {
    console.error("Không thể tải dashboard quản trị:", error);
    showToast(
      "Không thể tải dữ liệu dashboard. Vui lòng tải lại trang.",
      "error",
    );
  });
});
