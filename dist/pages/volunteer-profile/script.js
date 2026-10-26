// VolunteerLink: Page-specific interactions for volunteer profile.
let currentVolunteer = null;

async function loadProfileData() {
  const user = Auth.getCurrentUser();
  const vol = user && user.id ? await Auth.getVolunteerProfile(user.id) : null;
  if (!vol) {
    showToast("Không tìm thấy hồ sơ của tài khoản đang đăng nhập.", "error");
    return;
  }

  currentVolunteer = vol;

  document.getElementById("profileVolId").value = vol.id;
  document.getElementById("profileName").value = vol.name;
  document.getElementById("profileEmail").value = vol.email;
  document.getElementById("profileEmail").readOnly = vol.id === "V001";
  document.getElementById("profileEmail").title =
    vol.id === "V001"
      ? "Email đăng nhập của tài khoản demo được giữ cố định."
      : "";
  document.getElementById("profilePhone").value = vol.phone || "";
  const registrations = await Auth.getVolunteerRegistrations(vol.id);
  const completed = registrations.filter(
    (registration) => registration.status === "completed",
  );
  const completedHours = completed.reduce(
    (total, registration) => total + (Number(registration.hoursLogged) || 0),
    0,
  );
  const resolved =
    completed.length +
    registrations.filter((registration) => registration.status === "cancelled")
      .length;
  document.getElementById("volTotalHours").textContent = completedHours;
  document.getElementById("volCompletedShifts").textContent = completed.length;
  document.getElementById("volImpactScore").textContent =
    (resolved ? Math.round((completed.length / resolved) * 100) : 0) + "%";
  const achievements = VolunteerAchievements.getAll(
    completed.length,
    completedHours,
  );
  document.getElementById("volBadgeCount").textContent = achievements.filter(
    (achievement) => achievement.current >= achievement.target,
  ).length;
  VolunteerAchievements.render(
    document.getElementById("profileBadges"),
    achievements,
  );

  renderSkillsCheckboxes(vol.skills || []);

  const avail = vol.availability || [];
  document
    .querySelectorAll("#availabilityGrid .schedule-slot")
    .forEach((slot) => {
      const day = slot.getAttribute("data-day");
      if (avail.includes(day)) {
        slot.classList.add("selected");
      } else {
        slot.classList.remove("selected");
      }
    });
}

function renderSkillsCheckboxes(userSkills) {
  const group = document.getElementById("profileSkillsGroup");
  const allSkills = DataStore.getAll("skills");

  let html = "";
  allSkills.forEach((skill) => {
    const checked = userSkills.includes(skill.id) ? "checked" : "";
    html += `
      <label class="checkbox-label">
        <input type="checkbox" name="skills" value="${escapeHTML(skill.id)}" ${checked}>
        <span>${escapeHTML(skill.name)}</span>
      </label>
    `;
  });
  group.innerHTML = html;
}

function toggleSlot(el) {
  el.classList.toggle("selected");
}

async function saveProfile() {
  if (!currentVolunteer) return;

  const name = document.getElementById("profileName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();

  const selectedSkills = [];
  document
    .querySelectorAll('#profileSkillsGroup input[name="skills"]:checked')
    .forEach((cb) => {
      selectedSkills.push(cb.value);
    });

  const selectedDays = [];
  document
    .querySelectorAll("#availabilityGrid .schedule-slot.selected")
    .forEach((slot) => {
      selectedDays.push(slot.getAttribute("data-day"));
    });

  const updates = {
    name: name,
    email: email,
    phone: phone,
    skills: selectedSkills,
    availability: selectedDays,
  };

  try {
    currentVolunteer = await Auth.updateVolunteerProfile(
      currentVolunteer.id,
      updates,
    );
    showToast("Đã lưu thông tin hồ sơ và lịch rảnh thành công!", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("volunteer");
  await DataStore.init();
  try {
    await loadProfileData();
  } catch (error) {
    console.error("Không thể tải hồ sơ tình nguyện viên:", error);
    showToast(error.message, "error");
  }
});
