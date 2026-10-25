// VolunteerLink: Page-specific interactions for organization volunteer roster.
let currentOrganizationId = "";

function getOrganizationRegistrations() {
  const organizationOpportunityIds = new Set(
    DataStore.filter("opportunities", { orgId: currentOrganizationId }).map(
      (opportunity) => opportunity.id,
    ),
  );
  const organizationShiftIds = new Set(
    DataStore.getAll("shifts")
      .filter((shift) => organizationOpportunityIds.has(shift.oppId))
      .map((shift) => shift.id),
  );
  return DataStore.getAll("registrations").filter((registration) =>
    organizationShiftIds.has(registration.shiftId),
  );
}

function populateShiftDropdown() {
  const opportunityIds = new Set(
    DataStore.filter("opportunities", { orgId: currentOrganizationId }).map(
      (opportunity) => opportunity.id,
    ),
  );
  const shifts = DataStore.getAll("shifts").filter((shift) =>
    opportunityIds.has(shift.oppId),
  );
  const select = document.getElementById("shiftFilter");

  let options = '<option value="">-- Tất cả các ca --</option>';
  shifts.forEach((shift) => {
    const oppTitle = DataStore.getOppTitle(shift.oppId);
    options += `<option value="${escapeHTML(shift.id)}">${escapeHTML(shift.id)} - ${escapeHTML(oppTitle)} (${escapeHTML(formatDate(shift.date))} ${escapeHTML(shift.startTime)})</option>`;
  });

  select.innerHTML = options;
}

function updateStats(registrations) {
  document.getElementById("totalRegsCount").textContent = registrations.length;
  document.getElementById("pendingRegsCount").textContent =
    registrations.filter((r) => r.status === "pending").length;
  document.getElementById("confirmedRegsCount").textContent =
    registrations.filter((r) => r.status === "confirmed").length;
  document.getElementById("completedRegsCount").textContent =
    registrations.filter((r) => r.status === "completed").length;
}

function renderRosterTable(registrations) {
  const tbody = document.getElementById("rosterTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!registrations || registrations.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(emptyDiv, "👥", "Không tìm thấy lượt đăng ký nào.");
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  registrations.forEach((reg) => {
    const volunteer = DataStore.getById("volunteers", reg.volunteerId);
    const volName = volunteer ? volunteer.name : reg.volunteerId;
    const volEmail = volunteer ? volunteer.email : "Chưa cập nhật";
    const volPhone = volunteer ? volunteer.phone : "";

    const shift = DataStore.getById("shifts", reg.shiftId);
    const oppTitle = shift
      ? DataStore.getOppTitle(shift.oppId)
      : "Không xác định";
    const shiftDate = shift ? formatDate(shift.date) : "-";
    const shiftTime = shift ? `${shift.startTime} - ${shift.endTime}` : "-";

    let regTimeFormatted = reg.registeredAt || "-";
    if (reg.registeredAt && reg.registeredAt.includes("T")) {
      const parts = reg.registeredAt.split("T");
      regTimeFormatted = `${escapeHTML(formatDate(parts[0]))} ${escapeHTML(parts[1].substring(0, 5))}`;
    }

    html += `
      <tr>
        <td data-label="Mã ĐK"><strong>${escapeHTML(reg.id)}</strong></td>
        <td data-label="Tình nguyện viên">
          <div style="font-weight:600; color:var(--primary-dark);">${escapeHTML(volName)}</div>
          <div style="font-size:12px; color:var(--text-secondary);">Mã TNV: ${escapeHTML(reg.volunteerId)}</div>
        </td>
        <td data-label="Email / SĐT">
          <div>${escapeHTML(volEmail)}</div>
          ${volPhone ? `<div style="font-size:12px; color:var(--text-secondary);">${escapeHTML(volPhone)}</div>` : ""}
        </td>
        <td data-label="Ca làm việc">
          <div><strong>${escapeHTML(reg.shiftId)}</strong> - ${escapeHTML(oppTitle)}</div>
          <div style="font-size:12px; color:var(--text-secondary);">⏰ ${escapeHTML(shiftTime)}</div>
        </td>
        <td data-label="Ngày diễn ra">${escapeHTML(shiftDate)}</td>
        <td data-label="Thời gian ĐK">${escapeHTML(regTimeFormatted)}</td>
        <td data-label="Trạng thái">${statusBadge(reg.status)}</td>
        <td data-label="Hành động">
          <div class="flex" style="gap:6px; flex-wrap:wrap;">
            ${
              reg.status === "pending"
                ? `
              <button class="btn btn-sm btn-primary" onclick="approveRegistration(${escapeJSString(reg.id)})">✓ Duyệt</button>
              <button class="btn btn-sm btn-danger" onclick="rejectRegistration(${escapeJSString(reg.id)})">✕ Từ chối</button>
            `
                : ""
            }
            ${
              reg.status === "confirmed"
                ? `
              <button class="btn btn-sm btn-secondary" onclick="completeRegistration(${escapeJSString(reg.id)})">Hoàn thành</button>
            `
                : ""
            }
            <button class="btn btn-sm btn-danger" onclick="deleteRegistration(${escapeJSString(reg.id)})" title="Xóa bản ghi">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterRoster() {
  const keyword = document
    .getElementById("rosterSearchInput")
    .value.trim()
    .toLowerCase();
  const shiftId = document.getElementById("shiftFilter").value;
  const status = document.getElementById("statusFilter").value;

  let list = getOrganizationRegistrations();
  updateStats(list);

  if (shiftId) {
    list = list.filter((r) => r.shiftId === shiftId);
  }

  if (status) {
    list = list.filter((r) => r.status === status);
  }

  if (keyword) {
    list = list.filter((r) => {
      const vol = DataStore.getById("volunteers", r.volunteerId);
      const name = vol ? vol.name.toLowerCase() : "";
      const email = vol ? vol.email.toLowerCase() : "";
      return (
        name.includes(keyword) ||
        email.includes(keyword) ||
        r.id.toLowerCase().includes(keyword)
      );
    });
  }

  renderRosterTable(list);
}

function approveRegistration(id) {
  const reg = DataStore.getById("registrations", id);
  if (!reg) return;

  if (confirm("Xác nhận phê duyệt đơn đăng ký của tình nguyện viên này?")) {
    try {
      DataStore.updateRegistrationStatus(id, "confirmed");
      showToast("Đã phê duyệt tình nguyện viên vào ca!", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
    filterRoster();
  }
}

function rejectRegistration(id) {
  if (confirm("Bạn có chắc chắn muốn từ chối đăng ký này?")) {
    try {
      DataStore.updateRegistrationStatus(id, "rejected");
      showToast("Đã từ chối đơn đăng ký!", "info");
    } catch (error) {
      showToast(error.message, "error");
    }
    filterRoster();
  }
}

function completeRegistration(id) {
  if (confirm("Xác nhận tình nguyện viên đã hoàn thành ca làm việc này?")) {
    try {
      DataStore.updateRegistrationStatus(id, "completed");
      showToast(
        "Đã ghi nhận hoàn thành ca và cập nhật giờ tình nguyện!",
        "success",
      );
    } catch (error) {
      showToast(error.message, "error");
    }
    filterRoster();
  }
}

function deleteRegistration(id) {
  if (confirm(`Bạn có chắc chắn muốn xóa bản ghi đăng ký ${id}?`)) {
    try {
      DataStore.removeRegistration(id);
      showToast("Đã xóa bản ghi đăng ký!", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
    filterRoster();
  }
}

function exportCSV() {
  const rows = [
    [
      "Mã đăng ký",
      "Tình nguyện viên",
      "Email",
      "Số điện thoại",
      "Mã ca",
      "Hoạt động",
      "Trạng thái",
    ],
  ];
  getOrganizationRegistrations().forEach((registration) => {
    const volunteer = DataStore.getById("volunteers", registration.volunteerId);
    const shift = DataStore.getById("shifts", registration.shiftId);
    rows.push([
      registration.id,
      volunteer ? volunteer.name : registration.volunteerId,
      volunteer ? volunteer.email : "",
      volunteer ? volunteer.phone || "" : "",
      registration.shiftId,
      shift ? DataStore.getOppTitle(shift.oppId) : "",
      registration.status,
    ]);
  });
  downloadCSV("danh-sach-dang-ky.csv", rows);
  showToast("Đã tải danh sách đăng ký dạng CSV.", "success");
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("organization");
  await DataStore.init();

  const user = Auth.getCurrentUser();
  currentOrganizationId = user ? user.id : "";
  populateShiftDropdown();
  filterRoster();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["registrations", "shifts", "opportunities", "volunteers"].includes(
      event.detail.entity,
    )
  ) {
    populateShiftDropdown();
    filterRoster();
  }
});
