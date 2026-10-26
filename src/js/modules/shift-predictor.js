// Ước tính tình trạng thiếu người cho các ca dựa trên dữ liệu hiện có.
const ShiftPredictor = {
  predict: function () {
    const shifts = DataStore.getAll("shifts");
    if (shifts.length === 0) {
      return { error: "Không có dữ liệu ca để phân tích." };
    }

    const openShifts = shifts.filter((s) => s.status === "open");
    if (openShifts.length === 0) {
      return { error: "Tất cả các ca đều đã đủ người. Không cần cảnh báo." };
    }

    const analyzed = openShifts.map((shift) => {
      const shortage = shift.requiredVolunteers - shift.currentVolunteers;
      const ratio = shift.currentVolunteers / shift.requiredVolunteers;
      const opp = DataStore.getById("opportunities", shift.oppId);

      let urgency = "low";
      let urgencyText = "Thấp";
      let reasons = [];

      if (ratio <= 0.3) {
        urgency = "high";
        urgencyText = "Cao";
        reasons.push("Chỉ có " + Math.round(ratio * 100) + "% nhân sự");
      } else if (ratio <= 0.6) {
        urgency = "medium";
        urgencyText = "Trung bình";
        reasons.push("Có " + Math.round(ratio * 100) + "% nhân sự");
      } else {
        reasons.push("Có " + Math.round(ratio * 100) + "% nhân sự");
      }

      const daysUntil = Math.ceil(
        (new Date(shift.date) - new Date()) / (1000 * 60 * 60 * 24),
      );
      if (daysUntil <= 3) {
        urgency = "high";
        urgencyText = "Cao";
        reasons.push("Còn " + daysUntil + " ngày nữa");
      } else if (daysUntil <= 7) {
        if (urgency !== "high") urgency = "medium";
        reasons.push("Còn " + daysUntil + " ngày");
      } else {
        reasons.push("Còn " + daysUntil + " ngày");
      }

      if (shift.requiredSkills && shift.requiredSkills.length >= 2) {
        reasons.push(
          "Yêu cầu " + shift.requiredSkills.length + " kỹ năng chuyên môn",
        );
      }

      return {
        shift: shift,
        opportunity: opp,
        shortage: shortage,
        ratio: ratio,
        urgency: urgency,
        urgencyText: urgencyText,
        reasons: reasons,
      };
    });

    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    analyzed.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

    const urgencyBadge = {
      high: '<span class="badge badge-error">🔴 Khẩn cấp</span>',
      medium: '<span class="badge badge-warning">🟡 Cần chú ý</span>',
      low: '<span class="badge badge-info">🟢 Bình thường</span>',
    };

    return {
      items: analyzed.map((a) => ({
        title:
          (a.opportunity ? a.opportunity.title : "Ca " + a.shift.id) +
          " - " +
          formatDate(a.shift.date),
        subtitle: `Thiếu ${a.shortage} người · ${a.reasons.join(" · ")}`,
        badge: urgencyBadge[a.urgency],
        data: a,
      })),
      explain: `AI đã phân tích ${openShifts.length}/${shifts.length} ca đang mở. Mức độ khẩn cấp được tính dựa trên: tỷ lệ nhân sự hiện tại, thời gian còn lại trước ngày hoạt động, và độ phức tạp của kỹ năng yêu cầu. Ca có tỷ lệ dưới 30% hoặc còn dưới 3 ngày được đánh dấu "Khẩn cấp".`,
    };
  },

  predictForOpportunity: function (oppId) {
    const shifts = DataStore.filter("shifts", { oppId: oppId });
    if (shifts.length === 0) {
      return { error: "Hoạt động này chưa có ca nào." };
    }

    const shortageShifts = shifts.filter(
      (s) => s.status === "open" && s.currentVolunteers < s.requiredVolunteers,
    );
    if (shortageShifts.length === 0) {
      return { error: "Tất cả các ca của hoạt động này đều đã đủ người." };
    }

    const result = this.predict();
    if (result.error) return result;

    result.items = result.items.filter(
      (item) => item.data.shift.oppId === oppId,
    );
    if (result.items.length === 0) {
      return { error: "Không có ca nào cần cảnh báo trong hoạt động này." };
    }

    return result;
  },
};
