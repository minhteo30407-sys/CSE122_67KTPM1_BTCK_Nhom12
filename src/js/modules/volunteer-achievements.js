// VolunteerLink: Shared volunteer achievements feature module.
const VolunteerAchievements = {
  getAll: function (completedShifts, completedHours) {
    return [
      {
        icon: "🌟",
        name: "Tân binh nhiệt huyết",
        description: "Hoàn thành ca tình nguyện đầu tiên.",
        current: completedShifts,
        target: 1,
        unit: "ca",
      },
      {
        icon: "🤝",
        name: "Chung tay vì cộng đồng",
        description: "Tích lũy ít nhất 10 giờ tình nguyện.",
        current: completedHours,
        target: 10,
        unit: "giờ",
      },
      {
        icon: "🏅",
        name: "Người bạn đồng hành",
        description: "Hoàn thành ít nhất 5 ca tình nguyện.",
        current: completedShifts,
        target: 5,
        unit: "ca",
      },
      {
        icon: "🏆",
        name: "Chiến binh cộng đồng",
        description: "Tích lũy ít nhất 40 giờ tình nguyện.",
        current: completedHours,
        target: 40,
        unit: "giờ",
      },
      {
        icon: "🎖️",
        name: "Người đồng hành bền bỉ",
        description: "Hoàn thành ít nhất 10 ca tình nguyện.",
        current: completedShifts,
        target: 10,
        unit: "ca",
      },
      {
        icon: "🌳",
        name: "Ươm mầm yêu thương",
        description: "Tích lũy ít nhất 100 giờ tình nguyện.",
        current: completedHours,
        target: 100,
        unit: "giờ",
      },
      {
        icon: "💚",
        name: "Trái tim tình nguyện",
        description: "Hoàn thành ít nhất 20 ca tình nguyện.",
        current: completedShifts,
        target: 20,
        unit: "ca",
      },
      {
        icon: "🌍",
        name: "Sứ giả cộng đồng",
        description: "Tích lũy ít nhất 200 giờ tình nguyện.",
        current: completedHours,
        target: 200,
        unit: "giờ",
      },
    ];
  },

  render: function (container, achievements) {
    container.innerHTML = achievements
      .map((achievement) => {
        const achieved = achievement.current >= achievement.target;
        const progress = Math.min(
          100,
          Math.round((achievement.current / achievement.target) * 100),
        );
        const current = Math.min(achievement.current, achievement.target);
        const remaining = Math.max(0, achievement.target - achievement.current);
        const progressLabel = achieved
          ? "Đã hoàn thành"
          : `Còn ${remaining} ${achievement.unit} để đạt`;

        return `
        <article class="achievement-card ${achieved ? "is-achieved" : "is-pending"}">
          <div class="achievement-icon" aria-hidden="true">${escapeHTML(achievement.icon)}</div>
          <div class="achievement-content">
            <div class="achievement-title-row">
              <h3>${escapeHTML(achievement.name)}</h3>
              <span class="achievement-status ${achieved ? "status-achieved" : "status-pending"}">
                ${achieved ? "Đã đạt" : "Chưa đạt"}
              </span>
            </div>
            <p>${escapeHTML(achievement.description)}</p>
            <div class="achievement-progress-label">
              <span>${progressLabel}</span>
              <span>              ${escapeHTML(current)}/${escapeHTML(achievement.target)} ${escapeHTML(achievement.unit)}</span>
            </div>
            <div class="achievement-progress-track" role="progressbar"
                 aria-label="Tiến độ ${escapeHTML(achievement.name)}"
                 aria-valuemin="0" aria-valuemax="${escapeHTML(achievement.target)}"
                 aria-valuenow="${escapeHTML(current)}">
              <span style="width:${escapeHTML(progress)}%"></span>
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  },
};
