// VolunteerLink: Page-specific interactions for volunteer achievements.
async function loadAchievements() {
  const user = Auth.getCurrentUser();
  const registrations = user
    ? await Auth.getVolunteerRegistrations(user.id)
    : [];
  const completed = registrations.filter(
    (registration) => registration.status === "completed",
  );
  const completedHours = completed.reduce(
    (total, registration) => total + (Number(registration.hoursLogged) || 0),
    0,
  );
  const achievements = VolunteerAchievements.getAll(
    completed.length,
    completedHours,
  );
  const achieved = achievements.filter(
    (achievement) => achievement.current >= achievement.target,
  );
  const pending = achievements.filter(
    (achievement) => achievement.current < achievement.target,
  );

  document.getElementById("achievementCount").textContent = achieved.length;
  document.getElementById("achievementTotal").textContent = achievements.length;
  document.getElementById("achievementHours").textContent = completedHours;
  document.getElementById("achievementShifts").textContent = completed.length;
  document.getElementById("achievementOverviewText").textContent =
    achieved.length === achievements.length
      ? "Bạn đã chinh phục tất cả cột mốc hiện có. Cảm ơn bạn đã lan tỏa điều tốt!"
      : `Bạn đã chinh phục ${achieved.length} trên ${achievements.length} cột mốc. Tiếp tục nhé!`;
  document.getElementById("achievedCount").textContent = achieved.length;
  document.getElementById("pendingCount").textContent = pending.length;
  if (achieved.length) {
    VolunteerAchievements.render(
      document.getElementById("achievedAchievements"),
      achieved,
    );
  } else {
    document.getElementById("achievedAchievements").innerHTML =
      '<div class="achievement-collection-empty">Chưa có thành tựu nào được mở khóa. Ca tình nguyện đầu tiên sẽ là cột mốc đáng nhớ của bạn!</div>';
  }
  if (pending.length) {
    VolunteerAchievements.render(
      document.getElementById("pendingAchievements"),
      pending,
    );
  } else {
    document.getElementById("pendingAchievements").innerHTML =
      '<div class="achievement-collection-empty">Không còn mục tiêu nào đang chờ. Bạn đã hoàn thành toàn bộ bộ sưu tập!</div>';
  }

  const next = pending
    .slice()
    .sort(
      (first, second) =>
        first.target - first.current - (second.target - second.current),
    )[0];
  const nextPanel = document.getElementById("nextAchievementPanel");
  if (!next) {
    nextPanel.classList.add("all-achievements-complete");
    document.getElementById("nextAchievementTitle").textContent =
      "Bạn đã mở khóa mọi thành tựu!";
    document.getElementById("nextAchievementDescription").textContent =
      "Hãy tiếp tục tham gia hoạt động để lan tỏa thêm nhiều giá trị tích cực.";
    document.getElementById("nextAchievementProgress").style.width = "100%";
    document.getElementById("nextAchievementProgressLabel").textContent =
      `Hoàn thành ${achievements.length}/${achievements.length} thành tựu`;
    return;
  }

  const progress = Math.min(
    100,
    Math.round((next.current / next.target) * 100),
  );
  document.getElementById("nextAchievementTitle").textContent = next.name;
  document.getElementById("nextAchievementDescription").textContent =
    `${next.description} Còn ${next.target - next.current} ${next.unit} nữa để chinh phục.`;
  document.getElementById("nextAchievementProgress").style.width =
    progress + "%";
  document.getElementById("nextAchievementProgressLabel").textContent =
    `${Math.min(next.current, next.target)}/${next.target} ${next.unit} · ${progress}%`;
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("volunteer");
  try {
    await DataStore.init();
    await loadAchievements();
  } catch (error) {
    console.error("Không thể tải thành tựu tình nguyện viên:", error);
    showToast(error.message, "error");
  }
});

window.addEventListener("vl:datachange", function (event) {
  if (["registrations", "shifts"].includes(event.detail.entity)) {
    loadAchievements().catch((error) => {
      console.error("Không thể cập nhật thành tựu tình nguyện viên:", error);
      showToast(error.message, "error");
    });
  }
});
