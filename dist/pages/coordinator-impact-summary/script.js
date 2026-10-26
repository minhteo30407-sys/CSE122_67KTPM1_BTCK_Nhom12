// VolunteerLink: Page-specific interactions for coordinator impact summary.
let currentSelectedOppId = "";

function populateOppDropdown() {
  const opps = DataStore.getAll("opportunities");
  const select = document.getElementById("selectOppImpact");

  let options =
    '<option value="">-- Toàn bộ hệ thống VolunteerLink --</option>';
  opps.forEach((opp) => {
    options += `<option value="${opp.id}">${opp.title} (${opp.id})</option>`;
  });

  select.innerHTML = options;
}

function updateMetrics() {
  const summary = ImpactSummary.generate(currentSelectedOppId);
  if (summary && summary.stats) {
    document.getElementById("impactHours").textContent =
      `${summary.stats.totalHours} giờ`;
    document.getElementById("impactVols").textContent =
      `${summary.stats.totalVolunteers} người`;

    const rate =
      summary.stats.totalShifts > 0
        ? Math.round(
            (summary.stats.filledShifts / summary.stats.totalShifts) * 100,
          )
        : 0;
    document.getElementById("impactFillRate").textContent = `${rate}%`;

    const topListEl = document.getElementById("topVolunteersList");
    if (summary.stats.topVolunteers && summary.stats.topVolunteers.length > 0) {
      let html = "";
      summary.stats.topVolunteers.forEach((v, index) => {
        const medals = ["🥇", "🥈", "🥉", "🎖️", "🎖️"];
        html += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:var(--bg); border-radius:var(--radius-sm);">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:20px;">${medals[index] || "🎖️"}</span>
              <div>
                <strong>${escapeHTML(v.name)}</strong>
                <div style="font-size:12px; color:var(--text-secondary);">Thành viên tích cực</div>
              </div>
            </div>
            <span class="badge badge-ai">${v.hours} giờ đóng góp</span>
          </div>
        `;
      });
      topListEl.innerHTML = html;
    } else {
      topListEl.innerHTML =
        '<div class="text-secondary text-center" style="padding:20px;">Chưa có dữ liệu đóng góp.</div>';
    }
  }
}

function handleOppChange() {
  currentSelectedOppId = document.getElementById("selectOppImpact").value;
  updateMetrics();
  initImpactAIPanel();
}

function initImpactAIPanel() {
  AIPanel.create({
    containerId: "aiImpactSummaryPanel",
    title: "AI Tóm tắt đóng góp xã hội (Impact Summary)",
    description:
      "Hệ thống AI tự động tổng hợp số liệu ca trực, số giờ tình nguyện và sinh bản báo cáo tác động bằng ngôn ngữ tự nhiên.",
    onRun: function () {
      return ImpactSummary.generate(currentSelectedOppId);
    },
    onAccept: function () {
      showToast(
        "Đã lưu bản báo cáo tác động xã hội vào kho lưu trữ!",
        "success",
      );
    },
  });
}

function exportImpactReport() {
  const summary = ImpactSummary.generate(currentSelectedOppId);
  if (!summary || !summary.stats) {
    showToast(
      summary && summary.error
        ? summary.error
        : "Chưa có dữ liệu để xuất báo cáo.",
      "warning",
    );
    return;
  }
  const rows = [
    ["Chỉ số", "Giá trị"],
    ["Tình nguyện viên hoàn thành", summary.stats.totalVolunteers],
    ["Tổng giờ đóng góp", summary.stats.totalHours],
    ["Tổng số ca", summary.stats.totalShifts],
    ["Ca đủ người/hoàn thành", summary.stats.filledShifts],
    [
      "Tỷ lệ lấp đầy (%)",
      summary.stats.totalShifts
        ? Math.round(
            (summary.stats.filledShifts / summary.stats.totalShifts) * 100,
          )
        : 0,
    ],
    [],
    ["Tình nguyện viên tiêu biểu", "Số giờ"],
  ];
  summary.stats.topVolunteers.forEach((volunteer) => {
    rows.push([volunteer.name, volunteer.hours]);
  });
  downloadCSV("bao-cao-tac-dong.csv", rows);
  showToast("Đã tải báo cáo tác động dạng CSV.", "success");
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("coordinator");
  await DataStore.init();

  populateOppDropdown();
  updateMetrics();
  initImpactAIPanel();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["volunteers", "opportunities", "shifts", "registrations"].includes(
      event.detail.entity,
    )
  ) {
    populateOppDropdown();
    updateMetrics();
  }
});
