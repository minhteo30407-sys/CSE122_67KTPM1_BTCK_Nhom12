// VolunteerLink: Page-specific interactions for admin moderation.
// Dữ liệu mẫu ban đầu, chỉ được lưu khi trình duyệt chưa có dữ liệu kiểm duyệt.
const DEFAULT_MODERATION_ITEMS = [
  {
    id: "MOD001",
    type: "opportunity",
    title: "Dạy học cho trẻ em vùng khó khăn",
    content:
      "Chương trình dạy kèm miễn phí các môn Toán, Tiếng Việt, Tiếng Anh cho trẻ em ở xã Nhơn Đức, Nhà Bè.",
    sender: "Trung tâm Tình nguyện Thành phố",
    date: "2026-10-17",
    status: "pending",
    reason: "",
  },
  {
    id: "MOD002",
    type: "report",
    title: "Báo cáo: Tình nguyện viên vắng mặt không lý do",
    content:
      "TNV Nguyễn Văn An đăng ký ca nhưng vắng mặt 2 buổi liên tiếp không xin phép, làm ảnh hưởng ca khám bệnh.",
    sender: "Hội Chữ thập đỏ Quận 1",
    date: "2026-10-17",
    status: "pending",
    reason: "",
  },
  {
    id: "MOD003",
    type: "opportunity",
    title: "Gây quỹ Trung thu cho trẻ em",
    content:
      "Tổ chức chương trình Trung thu cho trẻ em có hoàn cảnh khó khăn: phát quà, biểu diễn văn nghệ tại Công viên 23/9.",
    sender: "Quỹ Bảo trợ Trẻ em Miền Nam",
    date: "2026-10-16",
    status: "pending",
    reason: "",
  },
  {
    id: "MOD004",
    type: "report",
    title: "Báo cáo: Hoạt động không cung cấp đủ bảo hộ",
    content:
      "Hoạt động dọn rác yêu cầu TNV lội bùn nhưng không chuẩn bị ủng cao su và găng tay dày như cam kết.",
    sender: "Trần Thị Bích (TNV)",
    date: "2026-10-15",
    status: "approved",
    reason: "",
  },
  {
    id: "MOD005",
    type: "opportunity",
    title: "Khám bệnh miễn phí cho người cao tuổi",
    content:
      "Chương trình khám sức khỏe tổng quát và phát thuốc miễn phí cho người cao tuổi tại phường Bến Nghé.",
    sender: "Hội Chữ thập đỏ Quận 1",
    date: "2026-10-14",
    status: "approved",
    reason: "",
  },
  {
    id: "MOD006",
    type: "report",
    title: "Báo cáo: Tài khoản tổ chức spam tin nhắn",
    content:
      "Tài khoản liên tục gửi tin nhắn quảng cáo các khóa học tính phí không thuộc phạm vi thiện nguyện.",
    sender: "Lê Hoàng Cường (TNV)",
    date: "2026-10-13",
    status: "rejected",
    reason:
      "Đã nhắc nhở cảnh cáo tài khoản lần 1, chưa đủ căn cứ khóa vĩnh viễn.",
  },
];
// Đọc danh sách từ localStorage; nếu chưa có thì khởi tạo bằng dữ liệu mẫu.
function getModerationItems() {
  const saved = localStorage.getItem("vl_moderation_items");
  if (saved) return JSON.parse(saved);
  localStorage.setItem(
    "vl_moderation_items",
    JSON.stringify(DEFAULT_MODERATION_ITEMS),
  );
  return DEFAULT_MODERATION_ITEMS;
}
// Lưu toàn bộ danh sách kiểm duyệt vào localStorage.
function saveModerationItems(list) {
  localStorage.setItem("vl_moderation_items", JSON.stringify(list));
}
// Tạo nhãn trạng thái tương ứng với trạng thái kiểm duyệt.
function renderModStatusBadge(status) {
  switch (status) {
    case "pending":
      return '<span class="badge badge-warning">⏳ Chờ duyệt</span>';
    case "approved":
      return '<span class="badge badge-success">✓ Đã duyệt</span>';
    case "rejected":
      return '<span class="badge badge-error">✕ Đã từ chối</span>';
    default:
      return statusBadge(status);
  }
}
// Tạo nhãn để phân biệt hoạt động tình nguyện và báo cáo vi phạm.
function renderTypeBadge(type) {
  if (type === "opportunity") {
    return '<span class="badge badge-info">📋 Hoạt động</span>';
  }
  return '<span class="badge badge-ai">⚠️ Báo cáo</span>';
}
// Hiển thị danh sách trong bảng hoặc thông báo khi danh sách trống.
function renderModTable(items) {
  const tbody = document.getElementById("modTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!items || items.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(emptyDiv, "✅", "Hàng đợi kiểm duyệt hiện đang trống.");
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  items.forEach((item) => {
    html += `
      <tr>
        <td data-label="Mã mục"><strong>${escapeHTML(item.id)}</strong></td>
        <td data-label="Loại">${renderTypeBadge(item.type)}</td>
        <td data-label="Tiêu đề / Nội dung">
          <div style="font-weight:600; color:var(--primary-dark);">${escapeHTML(item.title)}</div>
          <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">${escapeHTML(item.content)}</div>
          ${item.reason ? `<div style="font-size:12px; color:var(--error); margin-top:4px;"><strong>Lý do từ chối:</strong> ${escapeHTML(item.reason)}</div>` : ""}
        </td>
        <td data-label="Người / Đơn vị gửi">${escapeHTML(item.sender)}</td>
        <td data-label="Ngày gửi">${escapeHTML(formatDate(item.date))}</td>
        <td data-label="Trạng thái">${renderModStatusBadge(item.status)}</td>
        <td data-label="Hành động">
          <div class="flex" style="gap:6px; flex-wrap:wrap;">
            ${
              item.status === "pending"
                ? `
              <button class="btn btn-sm btn-primary" onclick="approveItem(${escapeJSString(item.id)})">✓ Duyệt</button>
              <button class="btn btn-sm btn-danger" onclick="openRejectModal(${escapeJSString(item.id)})">✕ Từ chối</button>
            `
                : `
              <button class="btn btn-sm btn-secondary" onclick="resetToPending(${escapeJSString(item.id)})">🔄 Xem lại</button>
            `
            }
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Lọc danh sách theo từ khóa, loại nội dung và trạng thái.
function filterModeration() {
  const keyword = document
    .getElementById("modSearchInput")
    .value.trim()
    .toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const status = document.getElementById("statusFilter").value;

  const list = getModerationItems();

  // Cập nhật số mục đang chờ duyệt, không phụ thuộc bộ lọc hiện tại.
  const pendingCount = list.filter((i) => i.status === "pending").length;
  document.getElementById("pendingBadge").textContent =
    `Chờ duyệt: ${pendingCount}`;

  let filtered = list;

  if (type) {
    filtered = filtered.filter((i) => i.type === type);
  }

  if (status) {
    filtered = filtered.filter((i) => i.status === status);
  }

  if (keyword) {
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(keyword) ||
        i.content.toLowerCase().includes(keyword) ||
        i.sender.toLowerCase().includes(keyword) ||
        i.id.toLowerCase().includes(keyword),
    );
  }
  renderModTable(filtered);
}

// Xác nhận và chuyển một mục sang trạng thái đã duyệt.
function approveItem(id) {
  if (confirm(`Xác nhận phê duyệt mục ${id}?`)) {
    const list = getModerationItems();
    const item = list.find((i) => i.id === id);
    if (item) {
      item.status = "approved";
      item.reason = "";
      saveModerationItems(list);
      showToast("Đã phê duyệt thành công!", "success");
      filterModeration();
    }
  }
}

// Tìm mục cần từ chối và mở hộp thoại nhập lý do.
function openRejectModal(id) {
  const list = getModerationItems();
  const item = list.find((i) => i.id === id);
  if (!item) return;

  document.getElementById("rejectItemId").value = item.id;
  document.getElementById("rejectItemTitle").textContent =
    `${item.title} (${item.id})`;
  document.getElementById("rejectReason").value = "";

  openModal("rejectModal");
}

// Kiểm tra lý do, lưu quyết định từ chối và cập nhật bảng.
function handleRejectSubmit(e) {
  e.preventDefault();

  const reasonInput = document.getElementById("rejectReason");
  if (!validateField(reasonInput, { required: true })) return;

  const id = document.getElementById("rejectItemId").value;
  const list = getModerationItems();
  const item = list.find((i) => i.id === id);

  if (item) {
    item.status = "rejected";
    item.reason = reasonInput.value.trim();
    saveModerationItems(list);
    closeModal("rejectModal");
    showToast("Đã từ chối mục kiểm duyệt!", "warning");
    filterModeration();
  }
}

// Đưa mục đã xử lý trở lại hàng đợi chờ duyệt.
function resetToPending(id) {
  const list = getModerationItems();
  const item = list.find((i) => i.id === id);
  if (item) {
    item.status = "pending";
    saveModerationItems(list);
    showToast("Đã chuyển mục về trạng thái chờ duyệt!", "info");
    filterModeration();
  }
}

// Khởi tạo giao diện và nạp dữ liệu sau khi tài liệu sẵn sàng.
document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("admin");
  await DataStore.init();
  filterModeration();
});
