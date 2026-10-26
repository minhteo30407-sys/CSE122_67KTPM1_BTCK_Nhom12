// VolunteerLink: Page-specific interactions for coordinator resource dashboard.
function updateDashboardStats() {
  const vols = DataStore.getAll("volunteers");
  const opps = DataStore.getAll("opportunities");
  const shifts = DataStore.getAll("shifts");

  const shortageShifts = shifts.filter(
    (s) => s.status === "open" && s.currentVolunteers < s.requiredVolunteers,
  );

  document.getElementById("dashVolCount").textContent = vols.length;
  document.getElementById("dashOppCount").textContent = opps.filter(
    (o) => o.status === "open",
  ).length;
  document.getElementById("dashShiftCount").textContent = shifts.length;
  document.getElementById("dashShortageCount").textContent =
    shortageShifts.length;

  const neededSkills = {};
  shortageShifts.forEach((shift) => {
    (shift.requiredSkills || []).forEach((skId) => {
      neededSkills[skId] =
        (neededSkills[skId] || 0) +
        (shift.requiredVolunteers - shift.currentVolunteers);
    });
  });

  const skillListEl = document.getElementById("skillsShortageList");
  let skillHtml = "";
  const skillEntries = Object.entries(neededSkills).sort((a, b) => b[1] - a[1]);

  if (skillEntries.length === 0) {
    skillHtml =
      '<div class="text-secondary" style="padding:10px;">Không có kỹ năng nào bị thiếu hụt nghiêm trọng.</div>';
  } else {
    skillEntries.forEach(([skId, count]) => {
      const skName = DataStore.getSkillName(skId);
      skillHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--bg); border-radius:var(--radius-sm);">
          <div>
            <strong>${escapeHTML(skName)}</strong>
            <span style="font-size:12px; color:var(--text-secondary); margin-left:6px;">(${escapeHTML(skId)})</span>
          </div>
          <span class="badge badge-error">Thiếu ${count} chỉ tiêu</span>
        </div>
      `;
    });
  }
  skillListEl.innerHTML = skillHtml;

  const days = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];
  const dayCounts = {};
  days.forEach((d) => (dayCounts[d] = 0));

  vols.forEach((v) => {
    (v.availability || []).forEach((d) => {
      if (dayCounts[d] !== undefined) dayCounts[d]++;
    });
  });

  const availEl = document.getElementById("availabilityDistribution");
  let availHtml = "";
  days.forEach((d) => {
    const count = dayCounts[d];
    const pct = vols.length > 0 ? Math.round((count / vols.length) * 100) : 0;
    availHtml += `
      <div>
        <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:2px;">
          <span>${d}</span>
          <span><strong>${count}</strong> TNV (${pct}%)</span>
        </div>
        <div style="background:var(--border); height:6px; border-radius:3px; overflow:hidden;">
          <div style="background:var(--primary); width:${pct}%; height:100%;"></div>
        </div>
      </div>
    `;
  });
  availEl.innerHTML = availHtml;
}

function renderShiftProgressTable() {
  const filter = document.getElementById("dashFilterShift").value;
  let shifts = DataStore.getAll("shifts");

  if (filter === "shortage") {
    shifts = shifts.filter(
      (s) => s.status === "open" && s.currentVolunteers < s.requiredVolunteers,
    );
  } else if (filter === "filled") {
    shifts = shifts.filter(
      (s) =>
        s.status === "filled" || s.currentVolunteers >= s.requiredVolunteers,
    );
  }

  const tbody = document.getElementById("dashShiftsTableBody");
  if (shifts.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center text-secondary" style="padding:24px;">Không có ca nào trong danh mục này.</td></tr>';
    return;
  }

  let html = "";
  shifts.forEach((shift) => {
    const oppTitle = DataStore.getOppTitle(shift.oppId);
    const percent = Math.min(
      100,
      Math.round((shift.currentVolunteers / shift.requiredVolunteers) * 100),
    );
    const skillsHtml = skillTags(shift.requiredSkills || []);

    html += `
      <tr>
        <td data-label="Mã ca"><strong>${escapeHTML(shift.id)}</strong></td>
        <td data-label="Hoạt động">
          <div style="font-weight:600; color:var(--primary-dark);">${escapeHTML(oppTitle)}</div>
        </td>
        <td data-label="Ngày & Giờ">${escapeHTML(formatDate(shift.date))}<br><small style="color:var(--text-secondary);">${escapeHTML(shift.startTime)} - ${escapeHTML(shift.endTime)}</small></td>
        <td data-label="Tiến độ lấp đầy">
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
            <span>${escapeHTML(shift.currentVolunteers)} / ${escapeHTML(shift.requiredVolunteers)} người</span>
            <span><strong>${percent}%</strong></span>
          </div>
          <div style="background:var(--border); height:8px; border-radius:4px; overflow:hidden;">
            <div style="background:${percent < 50 ? "var(--error)" : percent < 100 ? "var(--accent)" : "var(--success)"}; width:${percent}%; height:100%;"></div>
          </div>
        </td>
        <td data-label="Kỹ năng yêu cầu">${skillsHtml}</td>
        <td data-label="Trạng thái">${statusBadge(shift.status)}</td>
        <td data-label="Hành động">
          <button class="btn btn-sm btn-primary" onclick="window.location.href=getPageUrl('coordinator-matching-board')">
            🔗 Ghép TNV
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("coordinator");
  await DataStore.init();
  updateDashboardStats();
  renderShiftProgressTable();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["volunteers", "opportunities", "shifts", "registrations"].includes(
      event.detail.entity,
    )
  ) {
    updateDashboardStats();
    renderShiftProgressTable();
  }
});
