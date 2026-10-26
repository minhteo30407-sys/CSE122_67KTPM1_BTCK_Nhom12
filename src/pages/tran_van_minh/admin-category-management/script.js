// Mã xử lý giao diện và thao tác trên trang quản lý danh mục.
function renderSkillTable(skills) {
  const tbody = document.getElementById("skillTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!skills || skills.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(emptyDiv, "🏷️", "Không tìm thấy kỹ năng nào phù hợp.");
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  skills.forEach((skill) => {
    html += `
      <tr>
        <td data-label="Mã kỹ năng"><strong>${escapeHTML(skill.id)}</strong></td>
        <td data-label="Tên kỹ năng">
          <span style="font-weight:600; font-size:15px; color:var(--primary-dark);">${escapeHTML(skill.name)}</span>
        </td>
        <td data-label="Nhóm danh mục">
          <span class="tag" style="font-size:13px;">${escapeHTML(skill.category)}</span>
        </td>
        <td data-label="Trạng thái">${statusBadge(skill.status)}</td>
        <td data-label="Hành động">
          <div class="flex" style="gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-secondary" onclick="openEditSkillModal(${escapeJSString(skill.id)})">✏️ Sửa</button>
            ${
              skill.status !== "archived"
                ? `<button class="btn btn-sm btn-warning" onclick="archiveSkill(${escapeJSString(skill.id)})">📦 Lưu trữ</button>`
                : `<button class="btn btn-sm btn-primary" onclick="activateSkill(${escapeJSString(skill.id)})">🔄 Khôi phục</button>`
            }
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterSkills() {
  const keyword = document
    .getElementById("skillSearchInput")
    .value.trim()
    .toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;

  let list = DataStore.getAll("skills");

  if (category) {
    list = list.filter((s) => s.category === category);
  }

  if (status) {
    list = list.filter((s) => s.status === status);
  }

  if (keyword) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.id.toLowerCase().includes(keyword),
    );
  }

  renderSkillTable(list);
}

function openAddSkillModal() {
  document.getElementById("skillModalTitle").textContent = "Thêm kỹ năng mới";
  document.getElementById("skillId").value = "";
  document.getElementById("skillForm").reset();
  document.getElementById("skillStatus").value = "active";
  openModal("skillModal");
}

function openEditSkillModal(id) {
  const skill = DataStore.getById("skills", id);
  if (!skill) {
    showToast("Không tìm thấy kỹ năng!", "error");
    return;
  }

  document.getElementById("skillModalTitle").textContent =
    "Cập nhật kỹ năng: " + skill.name;
  document.getElementById("skillId").value = skill.id;
  document.getElementById("skillName").value = skill.name;
  document.getElementById("skillCategory").value = skill.category;
  document.getElementById("skillStatus").value = skill.status;

  openModal("skillModal");
}

function handleSkillSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("skillName");
  if (!validateField(nameInput, { required: true })) return;

  const skillId = document.getElementById("skillId").value;
  const data = {
    name: nameInput.value.trim(),
    category: document.getElementById("skillCategory").value,
    status: document.getElementById("skillStatus").value,
  };

  if (skillId) {
    DataStore.update("skills", skillId, data);
    showToast("Đã cập nhật kỹ năng thành công!", "success");
  } else {
    DataStore.add("skills", data);
    showToast("Đã thêm kỹ năng mới vào hệ thống!", "success");
  }

  closeModal("skillModal");
  filterSkills();
}

function archiveSkill(id) {
  if (
    confirm(`Bạn có chắc muốn chuyển kỹ năng ${id} vào trạng thái lưu trữ?`)
  ) {
    DataStore.update("skills", id, { status: "archived" });
    showToast("Đã chuyển kỹ năng vào lưu trữ!", "success");
    filterSkills();
  }
}

function activateSkill(id) {
  DataStore.update("skills", id, { status: "active" });
  showToast("Đã khôi phục kỹ năng hoạt động bình thường!", "success");
  filterSkills();
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("admin");
  await DataStore.init();
  filterSkills();
});
