// Mã xử lý giao diện và thao tác trên trang ghép tình nguyện viên với ca.
let currentSelectedShiftId = "";

function populateShifts() {
  const shifts = DataStore.getAll("shifts");
  const shortageShifts = shifts.filter(
    (s) => s.status === "open" && s.currentVolunteers < s.requiredVolunteers,
  );

  const select = document.getElementById("selectMatchingShift");
  let optionsHtml = "";

  shortageShifts.forEach((s, idx) => {
    const oppTitle = DataStore.getOppTitle(s.oppId);
    optionsHtml += `<option value="${escapeHTML(s.id)}">${escapeHTML(s.id)} - ${escapeHTML(oppTitle)} (${escapeHTML(formatDate(s.date))} ${escapeHTML(s.startTime)}) [Thiếu ${s.requiredVolunteers - s.currentVolunteers}]</option>`;
  });

  select.innerHTML =
    optionsHtml || '<option value="">Tất cả ca đều đã đủ người</option>';
  if (shortageShifts.length > 0) {
    currentSelectedShiftId = shortageShifts[0].id;
  }

  document.getElementById("shortageShiftsBadge").textContent =
    `${shortageShifts.length} ca`;
  const col1 = document.getElementById("shiftsNeedPeopleList");
  if (shortageShifts.length === 0) {
    col1.innerHTML =
      '<div class="text-secondary text-center" style="padding:20px;">Không có ca nào thiếu người!</div>';
  } else {
    let col1Html = "";
    shortageShifts.forEach((s) => {
      const oppTitle = DataStore.getOppTitle(s.oppId);
      const shortage = s.requiredVolunteers - s.currentVolunteers;
      const skillsHtml = skillTags(s.requiredSkills || []);

      col1Html += `
        <div class="board-item ${s.id === currentSelectedShiftId ? "active" : ""}" onclick="selectShift(${escapeJSString(s.id)})" style="cursor:pointer;">
          <div class="flex-between">
            <strong>${escapeHTML(s.id)} · ${escapeHTML(oppTitle)}</strong>
            <span class="badge badge-error">Thiếu ${shortage}</span>
          </div>
          <div style="font-size:13px; color:var(--text-secondary); margin-top:2px;">
            📅 ${escapeHTML(formatDate(s.date))} · ⏰ ${escapeHTML(s.startTime)} - ${escapeHTML(s.endTime)}
          </div>
          <div style="margin-top:6px;">
            ${skillsHtml}
          </div>
        </div>
      `;
    });
    col1.innerHTML = col1Html;
  }
}

function populateVolunteers() {
  const vols = DataStore.getAll("volunteers").filter(
    (v) => v.status === "active",
  );
  document.getElementById("activeVolBadge").textContent =
    `${vols.length} người`;

  const col2 = document.getElementById("availableVolunteersList");
  let html = "";

  vols.forEach((v) => {
    const skillsHtml = skillTags(v.skills || []);
    const availText = (v.availability || []).join(", ");

    html += `
      <div class="board-item">
        <div class="flex-between">
          <strong>${escapeHTML(v.name)}</strong>
          <span class="badge badge-info">${escapeHTML(v.totalHours || 0)} giờ</span>
        </div>
        <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
          Lịch rảnh: <strong>${escapeHTML(availText || "Linh hoạt")}</strong>
        </div>
        <div style="margin-top:4px;">
          ${skillsHtml}
        </div>
        <div style="margin-top:8px; text-align:right;">
          <button class="btn btn-sm btn-secondary" onclick="assignVolunteerToShift(${escapeJSString(v.id)})">
            ➕ Ghép vào ca đang chọn
          </button>
        </div>
      </div>
    `;
  });

  col2.innerHTML = html;
}

function selectShift(shiftId) {
  currentSelectedShiftId = shiftId;
  document.getElementById("selectMatchingShift").value = shiftId;
  populateShifts();
  initMatchingAIPanel();
}

function handleSelectShiftChange() {
  currentSelectedShiftId = document.getElementById("selectMatchingShift").value;
  populateShifts();
  initMatchingAIPanel();
}

function assignVolunteerToShift(volId) {
  if (!currentSelectedShiftId) {
    showToast("Vui lòng chọn ca cần ghép trước!", "error");
    return;
  }

  try {
    DataStore.registerVolunteer(volId, currentSelectedShiftId, "confirmed");
  } catch (error) {
    showToast(error.message, "warning");
    return;
  }

  const vol = DataStore.getById("volunteers", volId);
  showToast(
    `Đã ghép thành công ${vol ? vol.name : volId} vào ca ${currentSelectedShiftId}!`,
    "success",
  );

  populateShifts();
  initMatchingAIPanel();
}

function initMatchingAIPanel() {
  if (!currentSelectedShiftId) return;

  AIPanel.create({
    containerId: "aiMatchingBoardPanel",
    title: `AI Ghép tình nguyện viên cho ca ${currentSelectedShiftId}`,
    description:
      "Hệ thống tự động chấm điểm độ tương thích dựa trên kỹ năng trùng khớp, lịch rảnh trong tuần và kinh nghiệm cống hiến.",
    onRun: function () {
      return VolunteerMatcher.match(currentSelectedShiftId);
    },
    onAccept: function () {
      const matchResult = VolunteerMatcher.match(currentSelectedShiftId);
      if (matchResult && matchResult.items && matchResult.items.length > 0) {
        const topCandidate = matchResult.items[0].data;
        assignVolunteerToShift(topCandidate.id);
      }
    },
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("coordinator");
  await DataStore.init();

  populateShifts();
  populateVolunteers();
  initMatchingAIPanel();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["volunteers", "opportunities", "shifts", "registrations"].includes(
      event.detail.entity,
    )
  ) {
    populateShifts();
    populateVolunteers();
    initMatchingAIPanel();
  }
});
