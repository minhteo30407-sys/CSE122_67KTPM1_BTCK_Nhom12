// Mã xử lý giao diện và thao tác trên trang thông báo.
const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    icon: "✅",
    title: "Đăng ký ca thành công",
    text: "Bạn đã đăng ký tham gia ca khám bệnh sáng 01/11 thành công. Vui lòng có mặt đúng giờ.",
    time: "10 phút trước",
    unread: true,
  },
  {
    id: 2,
    icon: "⏰",
    title: "Nhắc nhở ca sắp tới",
    text: 'Ca hoạt động "Dạy học cho trẻ em" của bạn sẽ bắt đầu lúc 08:00 ngày mai tại Nhà Bè.',
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: 3,
    icon: "🤖",
    title: "Cảnh báo AI: Ca làm việc thiếu người",
    text: "Ca làm việc ngày 02/11 hiện chỉ đạt 20% nhân sự yêu cầu. Hãy kiểm tra và điều phối bổ sung.",
    time: "3 giờ trước",
    unread: true,
  },
  {
    id: 4,
    icon: "🎉",
    title: "Ghi nhận số giờ tình nguyện",
    text: "Hội Chữ thập đỏ Quận 1 đã xác nhận bạn hoàn thành 4 giờ tình nguyện và tặng 1 huy hiệu tích cực.",
    time: "1 ngày trước",
    unread: false,
  },
  {
    id: 5,
    icon: "📢",
    title: "Hoạt động mới vừa đăng tải",
    text: "Chiến dịch Mùa hè xanh 2026 vừa mở thêm 3 ca trực mới phù hợp với kỹ năng sơ cứu của bạn.",
    time: "2 ngày trước",
    unread: false,
  },
  {
    id: 6,
    icon: "📋",
    title: "Hồ sơ đã được duyệt",
    text: "Đơn đăng ký tham gia hoạt động Gây quỹ Trung thu của bạn đã được quản trị viên phê duyệt.",
    time: "3 ngày trước",
    unread: false,
  },
];

let currentFilter = "all";

function getNotifications() {
  const saved = localStorage.getItem("vl_notifications_list");
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem(
    "vl_notifications_list",
    JSON.stringify(DEFAULT_NOTIFICATIONS),
  );
  return DEFAULT_NOTIFICATIONS;
}

function saveNotifications(list) {
  localStorage.setItem("vl_notifications_list", JSON.stringify(list));
}

function renderNotifications() {
  const container = document.getElementById("notificationsContainer");
  const list = getNotifications();

  const unreadTotal = list.filter((n) => n.unread).length;
  document.getElementById("unreadCount").textContent = unreadTotal;

  let displayList = list;
  if (currentFilter === "unread") {
    displayList = list.filter((n) => n.unread);
  }

  if (displayList.length === 0) {
    showEmptyState(
      container,
      "🔔",
      currentFilter === "unread"
        ? "Không có thông báo chưa đọc nào."
        : "Bạn không có thông báo nào.",
    );
    return;
  }

  let html = "";
  displayList.forEach((item) => {
    html += `
      <div class="notification-item ${item.unread ? "unread" : ""}" onclick="toggleNotification(${escapeJSString(item.id)})">
        <div class="notification-icon">${escapeHTML(item.icon)}</div>
        <div class="notification-body">
          <div class="notif-title">
            ${escapeHTML(item.title)}
            ${item.unread ? '<span class="badge badge-ai" style="margin-left:6px; font-size:10px;">Mới</span>' : ""}
          </div>
          <div class="notif-text">${escapeHTML(item.text)}</div>
          <div class="notif-time">${escapeHTML(item.time)} · <em>Nhấn để đánh dấu ${item.unread ? "đã đọc" : "chưa đọc"}</em></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function toggleNotification(id) {
  const list = getNotifications();
  const item = list.find((n) => n.id === id);
  if (item) {
    item.unread = !item.unread;
    saveNotifications(list);
    renderNotifications();
    showToast(
      item.unread ? "Đã đánh dấu là chưa đọc" : "Đã đánh dấu là đã đọc",
      "info",
    );
  }
}

function markAllAsRead() {
  const list = getNotifications();
  list.forEach((n) => (n.unread = false));
  saveNotifications(list);
  renderNotifications();
  showToast("Đã đánh dấu tất cả là đã đọc!", "success");
}

function clearAllNotifications() {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ thông báo?")) {
    saveNotifications([]);
    renderNotifications();
    showToast("Đã xóa tất cả thông báo.", "info");
  }
}

function setFilter(type) {
  currentFilter = type;
  const allBtn = document.getElementById("filterAllBtn");
  const unreadBtn = document.getElementById("filterUnreadBtn");

  if (type === "all") {
    allBtn.className = "btn btn-sm btn-primary";
    unreadBtn.className = "btn btn-sm btn-secondary";
  } else {
    allBtn.className = "btn btn-sm btn-secondary";
    unreadBtn.className = "btn btn-sm btn-primary";
  }
  renderNotifications();
}

document.addEventListener("DOMContentLoaded", async function () {
  const user = Auth.getCurrentUser();
  const role = user && user.role ? user.role : "volunteer";
  renderLayout(role);

  await DataStore.init();
  renderNotifications();
});
