// VolunteerLink: Page-specific interactions for organization shift management.
let currentOrganizationId = "";

function getOrganizationOpportunities() {
  return DataStore.filter("opportunities", { orgId: currentOrganizationId });
}

function getOrganizationShifts() {
  const opportunityIds = new Set(
    getOrganizationOpportunities().map((opportunity) => opportunity.id),
  );
  return DataStore.getAll("shifts").filter((shift) =>
    opportunityIds.has(shift.oppId),
  );
}

function populateOpportunityDropdowns() {
  const opps = getOrganizationOpportunities();
  const oppFilter = document.getElementById("oppFilter");
  const shiftOppSelect = document.getElementById("shiftOppId");

  let filterOptions = '<option value="">-- Tất cả hoạt động --</option>';
  let modalOptions = '<option value="">-- Chọn hoạt động --</option>';

  opps.forEach((opp) => {
    filterOptions += `<option value="${escapeHTML(opp.id)}">${escapeHTML(opp.title)}</option>`;
    modalOptions += `<option value="${escapeHTML(opp.id)}">${escapeHTML(opp.title)} (${escapeHTML(opp.id)})</option>`;
  });

  oppFilter.innerHTML = filterOptions;
  shiftOppSelect.innerHTML = modalOptions;
}

function renderSkillsCheckboxGroup() {
  const group = document.getElementById("shiftSkillsCheckboxGroup");
  const skills = DataStore.getAll("skills");

  let html = "";
  skills.forEach((skill) => {
    html += `
      <label class="checkbox-label">
        <input type="checkbox" name="shiftSkills" value="${escapeHTML(skill.id)}">
        <span>${escapeHTML(skill.name)}</span>
      </label>
    `;
  });
  group.innerHTML = html;
}

function getAIShiftWarningBadge(shift) {
  if (shift.status !== "open") {
    return '<span class="text-secondary" style="font-size:12px;">Bình thường</span>';
  }

  const shortage = shift.requiredVolunteers - shift.currentVolunteers;
  if (shortage <= 0) {
    return '<span class="badge badge-success">Đã đủ</span>';
  }

  const ratio = shift.currentVolunteers / shift.requiredVolunteers;
  if (ratio <= 0.3) {
    return `<span class="badge badge-error">🔴 Khẩn cấp (thiếu ${shortage})</span>`;
  } else if (ratio <= 0.6) {
    return `<span class="badge badge-warning">🟡 Chú ý (thiếu ${shortage})</span>`;
  }
  return `<span class="badge badge-info">🟢 Thiếu ${shortage}</span>`;
}

function renderShiftTable(shifts) {
  const tbody = document.getElementById("shiftTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!shifts || shifts.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(emptyDiv, "⏰", "Không tìm thấy ca làm việc nào.");
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  shifts.forEach((shift) => {
    const oppTitle = DataStore.getOppTitle(shift.oppId);
    const skillsHtml = skillTags(shift.requiredSkills || []);
    const warningBadge = getAIShiftWarningBadge(shift);

    html += `
      <tr>
        <td data-label="Mã ca"><strong>${escapeHTML(shift.id)}</strong></td>
        <td data-label="Hoạt động">
          <div style="font-weight:600; color:var(--primary-dark);">${escapeHTML(oppTitle)}</div>
          <div style="font-size:12px; color:var(--text-secondary);">${escapeHTML(shift.oppId)}</div>
        </td>
        <td data-label="Ngày">${escapeHTML(formatDate(shift.date))}</td>
        <td data-label="Khung giờ">${escapeHTML(shift.startTime)} - ${escapeHTML(shift.endTime)}</td>
        <td data-label="Đã có / Yêu cầu">
          <strong>${escapeHTML(shift.currentVolunteers)}</strong> / ${escapeHTML(shift.requiredVolunteers)} người
        </td>
        <td data-label="Kỹ năng yêu cầu">
          <div class="flex" style="flex-wrap:wrap; gap:4px;">
            ${skillsHtml || '<span style="font-size:12px; color:var(--text-secondary);">Cơ bản</span>'}
          </div>
        </td>
        <td data-label="Trạng thái">${statusBadge(shift.status)}</td>
        <td data-label="Cảnh báo AI">${warningBadge}</td>
        <td data-label="Hành động">
          <div class="flex" style="gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="openEditShiftModal(${escapeJSString(shift.id)})">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" onclick="deleteShift(${escapeJSString(shift.id)})">🗑️ Xóa</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterShifts() {
  const keyword = document
    .getElementById("shiftSearchInput")
    .value.trim()
    .toLowerCase();
  const oppId = document.getElementById("oppFilter").value;
  const status = document.getElementById("statusFilter").value;

  let list = getOrganizationShifts();

  if (oppId) {
    list = list.filter((s) => s.oppId === oppId);
  }

  if (status) {
    list = list.filter((s) => s.status === status);
  }

  if (keyword) {
    list = list.filter((s) => {
      const title = DataStore.getOppTitle(s.oppId).toLowerCase();
      return (
        s.id.toLowerCase().includes(keyword) ||
        s.date.includes(keyword) ||
        title.includes(keyword)
      );
    });
  }

  renderShiftTable(list);
}

function openCreateShiftModal() {
  document.getElementById("shiftModalTitle").textContent =
    "Tạo ca làm việc mới";
  document.getElementById("shiftId").value = "";
  document.getElementById("shiftForm").reset();
  document.getElementById("shiftStatus").value = "open";
  document.getElementById("shiftCurrent").value = 0;
  document.getElementById("shiftRequired").value = 5;

  document
    .querySelectorAll('#shiftSkillsCheckboxGroup input[name="shiftSkills"]')
    .forEach((cb) => (cb.checked = false));

  openModal("shiftModal");
}

function openEditShiftModal(id) {
  const shift = DataStore.getById("shifts", id);
  if (
    !shift ||
    !getOrganizationOpportunities().some(
      (opportunity) => opportunity.id === shift.oppId,
    )
  ) {
    showToast("Không tìm thấy ca thuộc hoạt động của tổ chức bạn.", "error");
    return;
  }

  document.getElementById("shiftModalTitle").textContent =
    "Cập nhật ca làm việc: " + shift.id;
  document.getElementById("shiftId").value = shift.id;
  document.getElementById("shiftOppId").value = shift.oppId;
  document.getElementById("shiftDate").value = shift.date;
  document.getElementById("shiftStartTime").value = shift.startTime;
  document.getElementById("shiftEndTime").value = shift.endTime;
  document.getElementById("shiftRequired").value = shift.requiredVolunteers;
  document.getElementById("shiftCurrent").value = shift.currentVolunteers || 0;
  document.getElementById("shiftStatus").value = shift.status;

  const reqSkills = shift.requiredSkills || [];
  document
    .querySelectorAll('#shiftSkillsCheckboxGroup input[name="shiftSkills"]')
    .forEach((cb) => {
      cb.checked = reqSkills.includes(cb.value);
    });

  openModal("shiftModal");
}

function handleShiftSubmit(e) {
  e.preventDefault();

  const shiftId = document.getElementById("shiftId").value;
  const oppId = document.getElementById("shiftOppId").value;
  const date = document.getElementById("shiftDate").value;
  const startTime = document.getElementById("shiftStartTime").value;
  const endTime = document.getElementById("shiftEndTime").value;
  const requiredVolunteers =
    parseInt(document.getElementById("shiftRequired").value) || 1;
  const currentVolunteers =
    parseInt(document.getElementById("shiftCurrent").value) || 0;
  const status = document.getElementById("shiftStatus").value;

  if (!oppId) {
    showToast("Vui lòng chọn hoạt động!", "error");
    return;
  }
  if (
    !getOrganizationOpportunities().some(
      (opportunity) => opportunity.id === oppId,
    )
  ) {
    showToast("Bạn chỉ có thể tạo ca cho hoạt động của tổ chức mình.", "error");
    return;
  }

  const selectedSkills = [];
  document
    .querySelectorAll(
      '#shiftSkillsCheckboxGroup input[name="shiftSkills"]:checked',
    )
    .forEach((cb) => {
      selectedSkills.push(cb.value);
    });

  const shiftData = {
    oppId: oppId,
    date: date,
    startTime: startTime,
    endTime: endTime,
    requiredVolunteers: requiredVolunteers,
    currentVolunteers: currentVolunteers,
    requiredSkills: selectedSkills,
    status: status,
  };

  if (shiftId) {
    const existing = DataStore.getById("shifts", shiftId);
    if (
      !existing ||
      !getOrganizationOpportunities().some(
        (opportunity) => opportunity.id === existing.oppId,
      )
    ) {
      showToast(
        "Bạn chỉ có thể sửa ca thuộc hoạt động của tổ chức mình.",
        "error",
      );
      return;
    }
    DataStore.update("shifts", shiftId, shiftData);
    showToast("Đã cập nhật ca làm việc!", "success");
  } else {
    DataStore.add("shifts", shiftData);
    showToast("Đã tạo ca làm việc mới!", "success");
  }

  closeModal("shiftModal");
  filterShifts();
}

function deleteShift(id) {
  const shift = DataStore.getById("shifts", id);
  if (
    !shift ||
    !getOrganizationOpportunities().some(
      (opportunity) => opportunity.id === shift.oppId,
    )
  ) {
    showToast(
      "Bạn chỉ có thể xóa ca thuộc hoạt động của tổ chức mình.",
      "error",
    );
    return;
  }
  if (DataStore.filter("registrations", { shiftId: id }).length) {
    showToast(
      "Không thể xóa ca đã có đăng ký. Hãy hủy ca hoặc xử lý các đơn trước.",
      "warning",
    );
    return;
  }
  if (confirm(`Bạn có chắc chắn muốn xóa ca làm việc ${id}?`)) {
    DataStore.remove("shifts", id);
    showToast("Đã xóa ca làm việc!", "success");
    filterShifts();
  }
}

function initAIPredictor() {
  AIPanel.create({
    containerId: "aiShiftPredictorPanel",
    title: "AI Cảnh báo ca thiếu nhân sự (Shift Shortage Predictor)",
    description:
      "Thuật toán AI phân tích mức độ lấp đầy, thời gian diễn ra và yêu cầu chuyên môn để kịp thời cảnh báo các ca thiếu người.",
    onRun: function () {
      return ShiftPredictor.predict();
    },
    onAccept: function (result) {
      if (!result || !Array.isArray(result.items)) {
        showToast("Không có kết quả cảnh báo hợp lệ để lưu.", "error");
        return;
      }
      try {
        const reviewed = JSON.parse(
          localStorage.getItem("vl_reviewed_shift_alerts") || "[]",
        );
        if (!Array.isArray(reviewed)) {
          throw new Error("Danh sách cảnh báo đã xác nhận không hợp lệ.");
        }
        const reviewedAt = new Date().toISOString();
        const byShiftId = new Map(
          reviewed.map((item) => [item.shiftId, item]),
        );
        result.items.forEach((item) => {
          const shift = item.data && item.data.shift;
          if (shift && shift.id) {
            byShiftId.set(shift.id, {
              shiftId: shift.id,
              reviewedAt,
              urgency: item.data.urgency,
            });
          }
        });
        localStorage.setItem(
          "vl_reviewed_shift_alerts",
          JSON.stringify(Array.from(byShiftId.values())),
        );
        showToast(
          "Đã lưu danh sách ca thiếu người cần được theo dõi.",
          "success",
        );
      } catch (error) {
        showToast(error.message || "Không thể lưu cảnh báo ca.", "error");
      }
    },
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("organization");
  await DataStore.init();

  const user = Auth.getCurrentUser();
  currentOrganizationId = user ? user.id : "";
  populateOpportunityDropdowns();
  renderSkillsCheckboxGroup();
  initAIPredictor();
  filterShifts();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["opportunities", "shifts", "registrations"].includes(event.detail.entity)
  ) {
    populateOpportunityDropdowns();
    filterShifts();
  }
});
