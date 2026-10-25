// VolunteerLink: Shared navigation, access control, and interface utilities.
function getPageUrl(pageName) {
  const pageDirectory = pageName.replace(/\.html$/, "");
  return `../${pageDirectory}/index.html`;
}

// Role-based navigation shared across protected pages.
const MENUS = {
  volunteer: {
    label: "Tình nguyện viên",
    items: [
      { text: "Hồ sơ của tôi", page: "volunteer-profile", icon: "👤" },
      { text: "Thành tựu", page: "volunteer-achievements", icon: "🏆" },
      {
        text: "Tìm hoạt động",
        page: "volunteer-opportunity-search",
        icon: "🔍",
      },
      { text: "Ca của tôi", page: "volunteer-my-shifts", icon: "📅" },
    ],
  },
  organization: {
    label: "Tổ chức xã hội",
    items: [
      {
        text: "Quản lý hoạt động",
        page: "organization-opportunity-management",
        icon: "📋",
      },
      { text: "Quản lý ca", page: "organization-shift-management", icon: "⏰" },
      {
        text: "Danh sách TNV",
        page: "organization-volunteer-roster",
        icon: "👥",
      },
    ],
  },
  coordinator: {
    label: "Điều phối viên",
    items: [
      {
        text: "Bảng điều khiển",
        page: "coordinator-resource-dashboard",
        icon: "📊",
      },
      {
        text: "Ghép tình nguyện",
        page: "coordinator-matching-board",
        icon: "🔗",
      },
      {
        text: "Tổng kết đóng góp",
        page: "coordinator-impact-summary",
        icon: "📈",
      },
    ],
  },
  admin: {
    label: "Quản trị viên",
    items: [
      { text: "Dashboard", page: "admin-dashboard", icon: "📊" },
      {
        text: "Quản lý danh mục",
        page: "admin-category-management",
        icon: "🏷️",
      },
      { text: "Quản lý người dùng", page: "admin-user-management", icon: "👤" },
      { text: "Kiểm duyệt", page: "admin-moderation", icon: "✅" },
    ],
  },
};

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function escapeJSString(value) {
  return escapeHTML(JSON.stringify(String(value)));
}

// Build the authenticated application shell.
function renderLayout(role) {
  const user = Auth.getCurrentUser();
  const userName = user ? user.name : "Người dùng";
  // Hide protected content until local data and the current user's role are verified.
  const currentPage = getCurrentPageName();

  const topbar = document.createElement("header");
  topbar.className = "topbar";
  topbar.innerHTML = `
    <div class="flex" style="align-items:center; gap:12px;">
      <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
      <a href="${getPageUrl("index")}" class="logo">Volunteer<span>Link</span></a>
    </div>
    <div class="topbar-right">
      <a href="${getPageUrl("notifications")}" title="Thông báo" style="font-size:20px">🔔</a>
      <span class="user-name">${escapeHTML(userName)}</span>
      <button class="btn btn-sm btn-secondary" onclick="Auth.logout()">Đăng xuất</button>
    </div>
  `;

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.id = "sidebar";

  let menuHTML = "";
  const menu = MENUS[role];
  if (menu) {
    menuHTML += `<div class="role-label">${menu.label}</div>`;
    menu.items.forEach((item) => {
      const isActive = currentPage === item.page ? "active" : "";
      menuHTML += `<a href="${getPageUrl(item.page)}" class="nav-item ${isActive}">
        ${item.icon} ${item.text}
      </a>`;
    });
  }

  menuHTML += `<div class="nav-divider"></div>`;
  menuHTML += `<div class="role-label">Chung</div>`;
  menuHTML += `<a href="${getPageUrl("notifications")}" class="nav-item ${currentPage === "notifications" ? "active" : ""}">🔔 Thông báo</a>`;
  menuHTML += `<a href="${getPageUrl("index")}" class="nav-item">🏠 Trang chủ</a>`;

  sidebar.innerHTML = menuHTML;

  document.body.prepend(sidebar);
  document.body.prepend(topbar);
}

function getCurrentPageName() {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  return pathSegments.length > 1
    ? pathSegments[pathSegments.length - 2]
    : (pathSegments[0] || "index").replace(/\.html$/, "");
}

const PAGE_ROLES = {
  "volunteer-profile": "volunteer",
  "volunteer-achievements": "volunteer",
  "volunteer-opportunity-search": "volunteer",
  "volunteer-my-shifts": "volunteer",
  "coordinator-resource-dashboard": "coordinator",
  "coordinator-matching-board": "coordinator",
  "coordinator-impact-summary": "coordinator",
  "organization-opportunity-management": "organization",
  "organization-shift-management": "organization",
  "organization-volunteer-roster": "organization",
  "admin-category-management": "admin",
  "admin-dashboard": "admin",
  "admin-user-management": "admin",
  "admin-moderation": "admin",
};

const currentPage = getCurrentPageName();
const requiredRole = PAGE_ROLES[currentPage];
const requiresPageAccess =
  Boolean(requiredRole) || currentPage === "notifications";
if (requiresPageAccess) {
  document.documentElement.style.visibility = "hidden";
  document.addEventListener("DOMContentLoaded", async function () {
    try {
      await DataStore.init();
      const hasPageAccess = requiredRole
        ? Auth.requireRole(requiredRole)
        : Auth.requireLogin();
      if (hasPageAccess) document.documentElement.style.visibility = "";
    } catch (error) {
      console.error("Không thể xác minh quyền truy cập trang:", error);
      window.location.href = getPageUrl("login") + "?error=data-init";
    }
  });
}

// Shared browser events and small interface utilities.
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.querySelector(".menu-toggle");
  if (sidebar && sidebar.classList.contains("active")) {
    if (!sidebar.contains(e.target) && toggle && !toggle.contains(e.target)) {
      sidebar.classList.remove("active");
    }
  }
});

window.addEventListener("storage", function (event) {
  if (event.key && event.key.startsWith("vl_")) {
    window.dispatchEvent(
      new CustomEvent("vl:datachange", {
        detail: { entity: event.key.slice(3), external: true },
      }),
    );
  }
});

window.addEventListener("vl:apisyncerror", function (event) {
  showToast("Không thể đồng bộ với MockAPI. " + event.detail.message, "error");
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("show");
  }
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("show");
  }
});

function showToast(message, type) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast toast-" + (type || "success");
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function downloadCSV(fileName, rows) {
  const csv =
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map(
            (value) =>
              '"' +
              String(value == null ? "" : value).replace(/"/g, '""') +
              '"',
          )
          .join(","),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validateField(input, rules) {
  const value = input.value.trim();
  const errorEl = input.parentElement.querySelector(".form-error");

  if (rules.required && !value) {
    showFieldError(input, errorEl, "Trường này không được để trống");
    return false;
  }

  if (rules.email && value && !isValidEmail(value)) {
    showFieldError(input, errorEl, "Email không hợp lệ");
    return false;
  }

  if (rules.minLength && value.length < rules.minLength) {
    showFieldError(input, errorEl, `Tối thiểu ${rules.minLength} ký tự`);
    return false;
  }

  if (rules.phone && value && !/^0\d{9}$/.test(value)) {
    showFieldError(
      input,
      errorEl,
      "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)",
    );
    return false;
  }

  clearFieldError(input, errorEl);
  return true;
}

function showFieldError(input, errorEl, message) {
  input.classList.add("error");
  input.setAttribute("aria-invalid", "true");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
  }
}

function clearFieldError(input, errorEl) {
  input.classList.remove("error");
  input.removeAttribute("aria-invalid");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("show");
  }
}

document.addEventListener("input", function (event) {
  const input = event.target;
  if (input.matches(".form-input.error, .form-select.error")) {
    clearFieldError(input, input.parentElement.querySelector(".form-error"));
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function statusBadge(status) {
  const map = {
    active: { class: "badge-success", text: "Hoạt động" },
    inactive: { class: "badge-error", text: "Ngưng hoạt động" },
    open: { class: "badge-info", text: "Đang mở" },
    filled: { class: "badge-success", text: "Đã đủ" },
    completed: { class: "badge-success", text: "Hoàn thành" },
    cancelled: { class: "badge-error", text: "Đã hủy" },
    pending: { class: "badge-warning", text: "Chờ duyệt" },
    confirmed: { class: "badge-success", text: "Đã xác nhận" },
    rejected: { class: "badge-error", text: "Từ chối" },
    archived: { class: "badge-warning", text: "Lưu trữ" },
    locked: { class: "badge-error", text: "Đã khóa" },
  };
  const info = map[status] || {
    class: "badge-info",
    text: escapeHTML(status),
  };
  return `<span class="badge ${info.class}">${info.text}</span>`;
}

function skillTags(skillIds) {
  return skillIds
    .map((id) => {
      const name = DataStore.getSkillName(id);
      return `<span class="tag">${escapeHTML(name)}</span>`;
    })
    .join("");
}

function showEmptyState(container, icon, message) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <p>${escapeHTML(message)}</p>
    </div>
  `;
}

function showLoading(container) {
  container.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p style="margin-top:10px; color:var(--text-secondary)">Đang tải dữ liệu...</p>
    </div>
  `;
}

function generateId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase();
}

document.addEventListener("DOMContentLoaded", async function () {
  const siteChatScript = document.createElement("script");
  siteChatScript.src = "../../js/modules/site-chat.js";
  document.body.appendChild(siteChatScript);

  try {
    await DataStore.init();
  } catch (error) {
    console.error("Không thể khởi tạo dữ liệu VolunteerLink:", error);
    showToast(
      "Không thể tải dữ liệu. Hãy chạy website bằng npm start rồi thử lại.",
      "error",
    );
    return;
  }
  console.log("VolunteerLink đã sẵn sàng!");
});
