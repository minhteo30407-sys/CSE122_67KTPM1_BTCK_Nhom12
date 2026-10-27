// Tính toán và trình bày số liệu tổng hợp về tác động của hoạt động tình nguyện.
const ImpactSummary = {
  generate: function (oppId) {
    const registrations = DataStore.getAll("registrations");
    const shifts = DataStore.getAll("shifts");
    const volunteers = DataStore.getAll("volunteers");

    if (registrations.length === 0) {
      return { error: "Không đủ dữ liệu đăng ký để đưa ra tóm tắt." };
    }

    let relevantRegs = registrations;
    let relevantShifts = shifts;

    if (oppId) {
      const oppShiftIds = shifts
        .filter((s) => s.oppId === oppId)
        .map((s) => s.id);
      relevantRegs = registrations.filter((r) =>
        oppShiftIds.includes(r.shiftId),
      );
      relevantShifts = shifts.filter((s) => s.oppId === oppId);

      if (relevantRegs.length === 0) {
        return { error: "Hoạt động này chưa có ai đăng ký." };
      }
    }

    const completedRegs = relevantRegs.filter((r) => r.status === "completed");
    const totalHours = completedRegs.reduce(
      (sum, r) => sum + (r.hoursLogged || 0),
      0,
    );
    const uniqueVolunteers = [
      ...new Set(completedRegs.map((r) => r.volunteerId)),
    ];
    const totalShifts = relevantShifts.length;
    const filledShifts = relevantShifts.filter(
      (s) => s.status === "filled" || s.status === "completed",
    ).length;

    const volHours = {};
    completedRegs.forEach((r) => {
      if (!volHours[r.volunteerId]) volHours[r.volunteerId] = 0;
      volHours[r.volunteerId] += r.hoursLogged || 0;
    });

    const topVolunteers = Object.entries(volHours)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([volId, hours]) => {
        const vol = DataStore.getById("volunteers", volId);
        return {
          name: vol ? vol.name : volId,
          hours: hours,
        };
      });

    const items = [
      {
        title: "👥 Tổng tình nguyện viên tham gia",
        subtitle: `${uniqueVolunteers.length} người`,
        badge: '<span class="badge badge-success">Hoàn thành</span>',
      },
      {
        title: "⏰ Tổng giờ đóng góp",
        subtitle: `${totalHours} giờ`,
        badge: '<span class="badge badge-info">Tích lũy</span>',
      },
      {
        title: "📅 Ca hoạt động",
        subtitle: `${filledShifts}/${totalShifts} ca đã đủ người`,
        badge:
          totalShifts === 0 || filledShifts === totalShifts
            ? '<span class="badge badge-success">100%</span>'
            : '<span class="badge badge-warning">' +
              Math.round((filledShifts / totalShifts) * 100) +
              "%</span>",
      },
    ];

    if (topVolunteers.length > 0) {
      items.push({
        title: "🏆 TNV đóng góp nhiều nhất",
        subtitle: topVolunteers
          .map((v) => v.name + " (" + v.hours + "h)")
          .join(", "),
        badge:
          '<span class="badge badge-ai">Top ' +
          topVolunteers.length +
          "</span>",
      });
    }

    const opp = oppId ? DataStore.getById("opportunities", oppId) : null;
    const summaryText = oppId
      ? `Hoạt động "${opp ? opp.title : oppId}" đã thu hút ${uniqueVolunteers.length} tình nguyện viên với tổng cộng ${totalHours} giờ đóng góp trong ${totalShifts} ca. ${filledShifts === totalShifts ? "Tất cả ca đều đủ người tham gia." : "Còn " + (totalShifts - filledShifts) + " ca chưa đủ người."}`
      : `Hệ thống ghi nhận ${uniqueVolunteers.length} tình nguyện viên đã tham gia với tổng cộng ${totalHours} giờ đóng góp trong ${totalShifts} ca hoạt động. Tỷ lệ lấp đầy ca đạt ${totalShifts ? Math.round((filledShifts / totalShifts) * 100) : 0}%.`;

    return {
      items: items,
      explain:
        summaryText +
        ` Dữ liệu được tổng hợp từ ${completedRegs.length} lượt đăng ký đã hoàn thành.`,
      summaryText: summaryText,
      stats: {
        totalVolunteers: uniqueVolunteers.length,
        totalHours: totalHours,
        totalShifts: totalShifts,
        filledShifts: filledShifts,
        topVolunteers: topVolunteers,
      },
    };
  },
};
