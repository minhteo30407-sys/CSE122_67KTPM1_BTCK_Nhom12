// VolunteerLink: Page-specific interactions for volunteer my shifts.
let currentVolunteerId = "";
let calendarDate = new Date();
let calendarView = "month";

function calendarDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function escapeCalendarText(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function getCalendarEvents() {
  return DataStore.filter("registrations", { volunteerId: currentVolunteerId })
    .filter((registration) => registration.status !== "cancelled")
    .map((registration) => {
      const shift = DataStore.getById("shifts", registration.shiftId);
      const opportunity = shift
        ? DataStore.getById("opportunities", shift.oppId)
        : null;
      if (!shift || !opportunity || !shift.date) return null;
      return {
        date: shift.date,
        time: shift.startTime || "",
        title: opportunity.title,
        status: registration.status,
        shiftId: shift.id,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
    );
}

function setCalendarView(view) {
  calendarView = view;
  document
    .getElementById("monthViewButton")
    .classList.toggle("active", view === "month");
  document
    .getElementById("weekViewButton")
    .classList.toggle("active", view === "week");
  renderVolunteerCalendar();
}

function moveCalendar(direction) {
  if (calendarView === "month") {
    calendarDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + direction,
      1,
    );
  } else {
    calendarDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      calendarDate.getDate() + direction * 7,
    );
  }
  renderVolunteerCalendar();
}

function goToCalendarToday() {
  calendarDate = new Date();
  renderVolunteerCalendar();
}

function renderVolunteerCalendar() {
  const calendar = document.getElementById("volunteerCalendar");
  const period = document.getElementById("calendarPeriod");
  const events = getCalendarEvents();
  const dateFormat = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let dates = [];

  if (calendarView === "month") {
    const monthStart = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      1,
    );
    const mondayOffset = (monthStart.getDay() + 6) % 7;
    const gridStart = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      1 - mondayOffset,
    );
    dates = Array.from(
      { length: 42 },
      (_, index) =>
        new Date(
          gridStart.getFullYear(),
          gridStart.getMonth(),
          gridStart.getDate() + index,
        ),
    );
    period.textContent = new Intl.DateTimeFormat("vi-VN", {
      month: "long",
      year: "numeric",
    }).format(calendarDate);
  } else {
    const mondayOffset = (calendarDate.getDay() + 6) % 7;
    const weekStart = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth(),
      calendarDate.getDate() - mondayOffset,
    );
    dates = Array.from(
      { length: 7 },
      (_, index) =>
        new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate() + index,
        ),
    );
    const weekEnd = dates[6];
    period.textContent =
      dateFormat.format(weekStart) + " – " + dateFormat.format(weekEnd);
  }

  calendar.classList.toggle("is-week", calendarView === "week");
  const thisMonth = calendarDate.getMonth();
  const todayKey = calendarDateKey(new Date());
  calendar.innerHTML = dates
    .map((date) => {
      const dateKey = calendarDateKey(date);
      const dayEvents = events.filter((event) => event.date === dateKey);
      const classes = [
        "calendar-day",
        calendarView === "month" && date.getMonth() !== thisMonth
          ? "is-outside-month"
          : "",
        dateKey === todayKey ? "is-today" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const eventMarkup = dayEvents.length
        ? dayEvents
            .map(
              (event) => `
        <div class="calendar-event status-${escapeCalendarText(event.status)}"
          title="${escapeCalendarText(event.title)} · ${escapeCalendarText(event.time)} · ${escapeCalendarText(event.status)}">
          <span class="calendar-event-time">${escapeCalendarText(event.time)}</span>
          <span class="calendar-event-title">${escapeCalendarText(event.title)}</span>
        </div>
      `,
            )
            .join("")
        : '<span class="calendar-no-event">Không có ca</span>';
      return `
      <div class="${classes}">
        <span class="calendar-day-number">${date.getDate()}</span>
        <div class="calendar-day-events">${eventMarkup}</div>
      </div>
    `;
    })
    .join("");
}

function updateMyShiftStats(myRegs) {
  document.getElementById("myTotalShiftsCount").textContent = myRegs.length;
  document.getElementById("myPendingShiftsCount").textContent = myRegs.filter(
    (r) => r.status === "pending",
  ).length;
  document.getElementById("myUpcomingShiftsCount").textContent = myRegs.filter(
    (r) => r.status === "confirmed",
  ).length;
  document.getElementById("myCompletedShiftsCount").textContent = myRegs.filter(
    (r) => r.status === "completed",
  ).length;
}

function renderMyShiftsTable(regs) {
  const tbody = document.getElementById("myShiftsTableBody");
  const emptyDiv = document.getElementById("emptyContainer");

  if (!regs || regs.length === 0) {
    tbody.innerHTML = "";
    emptyDiv.classList.remove("hidden");
    showEmptyState(
      emptyDiv,
      "📅",
      "Bạn chưa có ca tình nguyện nào trong mục này.",
    );
    return;
  }

  emptyDiv.classList.add("hidden");
  let html = "";

  regs.forEach((reg) => {
    const shift = DataStore.getById("shifts", reg.shiftId);
    const opp = shift ? DataStore.getById("opportunities", shift.oppId) : null;

    const oppTitle = opp ? opp.title : "Hoạt động đã kết thúc";
    const location = opp ? opp.location : "Đang cập nhật";
    const shiftDate = shift ? formatDate(shift.date) : "-";
    const shiftTime = shift ? `${shift.startTime} - ${shift.endTime}` : "-";

    html += `
      <tr>
        <td data-label="Mã ĐK"><strong>${reg.id}</strong></td>
        <td data-label="Hoạt động">
          <strong style="color:var(--primary-dark);">${oppTitle}</strong>
          <div style="font-size:12px; color:var(--text-secondary);">Mã ca: ${reg.shiftId}</div>
        </td>
        <td data-label="Địa điểm">${location}</td>
        <td data-label="Ngày diễn ra">${shiftDate}</td>
        <td data-label="Khung giờ">${shiftTime}</td>
        <td data-label="Số giờ ghi nhận">
          <strong>${reg.hoursLogged || 0} giờ</strong>
        </td>
        <td data-label="Trạng thái">${statusBadge(reg.status)}</td>
        <td data-label="Hành động">
          ${
            reg.status === "pending" || reg.status === "confirmed"
              ? `
            <button class="btn btn-sm btn-danger" onclick="cancelRegistration('${reg.id}', '${reg.shiftId}')">
              Hủy đăng ký
            </button>
          `
              : `
            <span class="text-secondary" style="font-size:13px;">—</span>
          `
          }
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterMyShifts() {
  const keyword = document
    .getElementById("myShiftsSearch")
    .value.trim()
    .toLowerCase();
  const status = document.getElementById("myShiftStatusFilter").value;

  let myRegs = DataStore.filter("registrations", {
    volunteerId: currentVolunteerId,
  });
  updateMyShiftStats(myRegs);

  if (status) {
    myRegs = myRegs.filter((r) => r.status === status);
  }

  if (keyword) {
    myRegs = myRegs.filter((r) => {
      const shift = DataStore.getById("shifts", r.shiftId);
      const opp = shift
        ? DataStore.getById("opportunities", shift.oppId)
        : null;
      const title = opp ? opp.title.toLowerCase() : "";
      const loc = opp ? opp.location.toLowerCase() : "";
      return (
        title.includes(keyword) ||
        loc.includes(keyword) ||
        r.id.toLowerCase().includes(keyword)
      );
    });
  }

  renderMyShiftsTable(myRegs);
}

function cancelRegistration(regId, shiftId) {
  if (confirm("Bạn có chắc chắn muốn hủy đăng ký ca làm việc này?")) {
    try {
      DataStore.updateRegistrationStatus(regId, "cancelled");
      showToast("Đã hủy đăng ký ca làm việc thành công!", "info");
    } catch (error) {
      showToast(error.message, "error");
    }
    filterMyShifts();
    renderVolunteerCalendar();
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  renderLayout("volunteer");
  await DataStore.init();

  const user = Auth.getCurrentUser();
  if (user && user.id) {
    const vol = DataStore.getAll("volunteers").find(
      (volunteer) => volunteer.id === user.id && volunteer.accountCreated,
    );
    if (vol) currentVolunteerId = vol.id;
  }

  renderVolunteerCalendar();
  filterMyShifts();
});

window.addEventListener("vl:datachange", function (event) {
  if (
    ["registrations", "shifts", "opportunities"].includes(event.detail.entity)
  ) {
    renderVolunteerCalendar();
    filterMyShifts();
  }
});
