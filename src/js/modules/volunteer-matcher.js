// VolunteerLink: Shared volunteer matcher feature module.
const VolunteerMatcher = {
  match: function (shiftId) {
    const shift = DataStore.getById("shifts", shiftId);
    if (!shift) {
      return { error: "Không tìm thấy thông tin ca." };
    }

    const volunteers = DataStore.getAll("volunteers").filter(
      (v) => v.status === "active",
    );
    if (volunteers.length === 0) {
      return { error: "Không đủ dữ liệu tình nguyện viên để đưa ra đề xuất." };
    }

    const opp = DataStore.getById("opportunities", shift.oppId);

    const scored = volunteers.map((vol) => {
      let score = 0;
      let reasons = [];

      const requiredSkills = shift.requiredSkills || [];
      const matchedSkills = requiredSkills.filter((s) =>
        vol.skills.includes(s),
      );
      if (matchedSkills.length > 0) {
        score += matchedSkills.length * 30;
        reasons.push(
          "Có " +
            matchedSkills.length +
            "/" +
            requiredSkills.length +
            " kỹ năng phù hợp",
        );
      }

      const shiftDate = new Date(shift.date);
      const dayNames = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      const shiftDay = dayNames[shiftDate.getDay()];
      if (vol.availability && vol.availability.includes(shiftDay)) {
        score += 25;
        reasons.push("Rảnh vào " + shiftDay);
      }

      if (vol.totalHours > 40) {
        score += 15;
        reasons.push("Kinh nghiệm cao (" + vol.totalHours + " giờ)");
      } else if (vol.totalHours > 20) {
        score += 10;
        reasons.push("Có kinh nghiệm (" + vol.totalHours + " giờ)");
      }

      const regs = DataStore.getAll("registrations");
      const alreadyReg = regs.find(
        (r) => r.volunteerId === vol.id && r.shiftId === shiftId,
      );
      if (alreadyReg) {
        score = -1;
        reasons = ["Đã đăng ký ca này"];
      }

      return {
        volunteer: vol,
        score: score,
        reasons: reasons,
      };
    });

    const results = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (results.length === 0) {
      return { error: "Không tìm thấy tình nguyện viên phù hợp cho ca này." };
    }

    return {
      items: results.map((r, i) => ({
        title: r.volunteer.name,
        subtitle: r.reasons.join(" · "),
        badge: `<span class="badge badge-ai">${r.score} điểm</span>`,
        data: r.volunteer,
      })),
      explain: `AI đã phân tích ${volunteers.length} tình nguyện viên dựa trên: kỹ năng phù hợp với ca (${shift.requiredSkills.map((s) => DataStore.getSkillName(s)).join(", ")}), lịch rảnh vào ${formatDate(shift.date)}, và kinh nghiệm tình nguyện. Kết quả xếp hạng từ cao đến thấp.`,
    };
  },

  recommend: function (volunteerId) {
    const vol = DataStore.getById("volunteers", volunteerId);
    if (!vol) return { error: "Không tìm thấy thông tin tình nguyện viên." };

    const opps = DataStore.filter("opportunities", { status: "open" });
    if (opps.length === 0)
      return { error: "Hiện không có hoạt động nào đang mở." };

    const results = opps
      .map((opp) => {
        let score = 0;
        const matchedSkills = (opp.requiredSkills || []).filter((s) =>
          vol.skills.includes(s),
        );
        if (matchedSkills.length > 0) {
          score += matchedSkills.length * 30;
        }
        return {
          opportunity: opp,
          score: score,
          matchedSkills: matchedSkills,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (results.length === 0) {
      return {
        error:
          "AI chưa chắc chắn về kết quả này. Hãy thử cập nhật kỹ năng của bạn.",
      };
    }

    return {
      items: results.map((r) => ({
        title: r.opportunity.title,
        subtitle: `Phù hợp: ${r.matchedSkills.map((s) => DataStore.getSkillName(s)).join(", ")} · ${r.opportunity.location}`,
        badge: `<span class="badge badge-ai">${r.score} điểm</span>`,
        data: r.opportunity,
      })),
      explain: `AI đã so sánh kỹ năng của bạn (${vol.skills.map((s) => DataStore.getSkillName(s)).join(", ")}) với ${opps.length} hoạt động đang mở. Kết quả hiển thị hoạt động có kỹ năng yêu cầu trùng khớp nhiều nhất.`,
    };
  },
};
