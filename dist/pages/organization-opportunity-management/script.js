// VolunteerLink: Page-specific interactions for organization opportunity management.
let currentOrganizationId = "";

function getOrganizationOpportunities() {
  return DataStore.filter("opportunities", { orgId: currentOrganizationId });
}

function renderSkillCheckboxes() {
  const group = document.getElementById("skillsCheckboxGroup");
  const skills = DataStore.getAll("skills");

  if (!skills || skills.length === 0) {
    group.innerHTML =
      '<span style="font-size:13px; color:var(--text-secondary);">Chưa có danh mục kỹ năng</span>';
    return;
  }

  let html = "";
  skills.forEach((skill) => {
    html += `
      <label class="checkbox-label">
        <input type="checkbox" name="skills" value="${escapeHTML(skill.id)}">
        <span>${escapeHTML(skill.name)}</span>
      </label>
    `;
  });
  group.innerHTML = html;
}

function renderTable(opportunities) {
  const tbody = document.getElementById("opportunityTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!opportunities || opportunities.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(emptyDiv, "📋", "Không tìm thấy hoạt động nào phù hợp.");
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  opportunities.forEach((item, index) => {
    html += `
      <tr>
        <td data-label="STT">${index + 1}</td>
        <td data-label="Tên hoạt động">
          <strong>${escapeHTML(item.title)}</strong>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Mã: ${escapeHTML(item.id)}</div>
        </td>
        <td data-label="Danh mục"><span class="badge badge-info">${escapeHTML(item.category || "Chung")}</span></td>
        <td data-label="Địa điểm">${escapeHTML(item.location)}</td>
        <td data-label="Thời gian">${escapeHTML(formatDate(item.startDate))} - ${escapeHTML(formatDate(item.endDate))}</td>
        <td data-label="TNV tối đa">${escapeHTML(item.maxVolunteers || 0)} người</td>
        <td data-label="Trạng thái">${statusBadge(item.status)}</td>
        <td data-label="Hành động">
          <div class="flex" style="gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="openEditModal(${escapeJSString(item.id)})">✏️ Sửa</button>
            ${
              item.status === "open"
                ? `<button class="btn btn-sm btn-danger" onclick="changeStatus(${escapeJSString(item.id)}, 'cancelled')">Đóng</button>`
                : `<button class="btn btn-sm btn-primary" onclick="changeStatus(${escapeJSString(item.id)}, 'open')">Mở lại</button>`
            }
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterOpportunities() {
  const keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  const status = document.getElementById("statusFilter").value;

  let list = getOrganizationOpportunities();

  if (keyword) {
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword),
    );
  }

  if (status) {
    list = list.filter((item) => item.status === status);
  }

  renderTable(list);
}

function openCreateModal() {
  document.getElementById("modalTitle").textContent = "Tạo hoạt động mới";
  document.getElementById("oppId").value = "";
  document.getElementById("opportunityForm").reset();

  document
    .querySelectorAll('#skillsCheckboxGroup input[name="skills"]')
    .forEach((cb) => (cb.checked = false));

  openModal("opportunityModal");
}

function openEditModal(id) {
  const opp = DataStore.getById("opportunities", id);
  if (!opp || opp.orgId !== currentOrganizationId) {
    showToast("Không tìm thấy hoạt động thuộc tổ chức của bạn.", "error");
    return;
  }

  document.getElementById("modalTitle").textContent =
    "Cập nhật hoạt động: " + opp.title;
  document.getElementById("oppId").value = opp.id;
  document.getElementById("oppTitle").value = opp.title;
  document.getElementById("oppCategory").value = opp.category || "Y tế";
  document.getElementById("oppStatus").value = opp.status || "open";
  document.getElementById("oppDescription").value = opp.description || "";
  document.getElementById("oppLocation").value = opp.location || "";
  document.getElementById("oppStartDate").value = opp.startDate || "";
  document.getElementById("oppEndDate").value = opp.endDate || "";
  document.getElementById("oppMaxVolunteers").value = opp.maxVolunteers || 10;

  const reqSkills = opp.requiredSkills || [];
  document
    .querySelectorAll('#skillsCheckboxGroup input[name="skills"]')
    .forEach((cb) => {
      cb.checked = reqSkills.includes(cb.value);
    });

  openModal("opportunityModal");
}

function handleFormSubmit(e) {
  e.preventDefault();

  const titleInput = document.getElementById("oppTitle");
  const locationInput = document.getElementById("oppLocation");
  const startDateInput = document.getElementById("oppStartDate");
  const endDateInput = document.getElementById("oppEndDate");

  if (!validateField(titleInput, { required: true })) return;
  if (!validateField(locationInput, { required: true })) return;

  if (startDateInput.value > endDateInput.value) {
    showToast("Ngày bắt đầu không được lớn hơn ngày kết thúc!", "error");
    return;
  }

  const selectedSkills = [];
  document
    .querySelectorAll('#skillsCheckboxGroup input[name="skills"]:checked')
    .forEach((cb) => {
      selectedSkills.push(cb.value);
    });

  const oppId = document.getElementById("oppId").value;
  const user = Auth.getCurrentUser();
  if (!user || user.id !== currentOrganizationId) {
    showToast("Không thể xác minh tổ chức đang đăng nhập.", "error");
    return;
  }
  const data = {
    title: titleInput.value.trim(),
    category: document.getElementById("oppCategory").value,
    status: document.getElementById("oppStatus").value,
    description: document.getElementById("oppDescription").value.trim(),
    location: locationInput.value.trim(),
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    maxVolunteers:
      parseInt(document.getElementById("oppMaxVolunteers").value) || 1,
    requiredSkills: selectedSkills,
  };

  if (oppId) {
    const existing = DataStore.getById("opportunities", oppId);
    if (!existing || existing.orgId !== currentOrganizationId) {
      showToast(
        "Bạn chỉ có thể sửa hoạt động do tổ chức của mình tạo.",
        "error",
      );
      return;
    }
    DataStore.update("opportunities", oppId, data);
    showToast("Cập nhật hoạt động thành công!", "success");
  } else {
    data.orgId = currentOrganizationId;
    DataStore.add("opportunities", data);
    showToast("Tạo hoạt động mới thành công!", "success");
  }

  closeModal("opportunityModal");
  filterOpportunities();
}

function changeStatus(id, newStatus) {
  const opportunity = DataStore.getById("opportunities", id);
  if (!opportunity || opportunity.orgId !== currentOrganizationId) {
    showToast(
      "Bạn chỉ có thể cập nhật hoạt động do tổ chức của mình tạo.",
      "error",
    );
    return;
  }
  const confirmMsg =
    newStatus === "cancelled"
      ? "Bạn có chắc chắn muốn đóng/hủy hoạt động này?"
      : "Bạn có muốn mở lại hoạt động này?";

  if (confirm(confirmMsg)) {
    DataStore.update("opportunities", id, { status: newStatus });
    showToast("Đã cập nhật trạng thái hoạt động!", "success");
    filterOpportunities();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("organization");
  await DataStore.init();
  const user = Auth.getCurrentUser();
  currentOrganizationId = user ? user.id : "";
  renderSkillCheckboxes();
  filterOpportunities();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["opportunities", "shifts", "registrations"].includes(event.detail.entity)
  ) {
    filterOpportunities();
  }
});
