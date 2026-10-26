// VolunteerLink: Page-specific interactions for index.
function getHomeDashboard(user) {
  if (!user) return "login";
  const dashboardByRole = {
    volunteer: "volunteer-opportunity-search",
    organization: "organization-opportunity-management",
    coordinator: "coordinator-resource-dashboard",
    admin: "admin-dashboard",
  };
  return dashboardByRole[user.role] || "index";
}

function updateHomeForUser(user) {
  const navigation = document.getElementById("homeNavigation");
  const actions = document.getElementById("homeHeroActions");
  const heading = document.getElementById("homeHeading");
  const description = document.getElementById("homeDescription");
  const trustNote = document.getElementById("homeTrustNote");
  const allOpportunitiesLink = document.getElementById("allOpportunitiesLink");

  if (!user) return;

  const dashboardUrl = getPageUrl(getHomeDashboard(user));
  const safeName = escapeHTML(user.name);
  heading.textContent = "Chào mừng trở lại, " + user.name;
  description.textContent =
    "Tiếp tục hành trình đóng góp của bạn. Mọi hoạt động và thông tin tài khoản đều được lưu trong hồ sơ VolunteerLink.";
  trustNote.innerHTML =
    '<span aria-hidden="true">✓</span> Hồ sơ đóng góp của bạn được cập nhật sau mỗi ca hoàn thành';
  navigation.innerHTML = `
    <a class="home-nav-current" href="index.html" aria-current="page">Trang chủ</a>
    <a href="#featured-section">Hoạt động nổi bật</a>
    <span class="home-user-greeting">Xin chào, ${safeName}</span>
    <a href="${dashboardUrl}" class="btn btn-sm btn-primary home-nav-cta">Khu vực của bạn</a>
    <button type="button" class="home-logout-link" onclick="Auth.logout()">Đăng xuất</button>
  `;
  actions.innerHTML = `
    <a class="btn btn-primary" href="${dashboardUrl}">Tiếp tục hành trình <span aria-hidden="true">→</span></a>
    <a class="btn btn-secondary" href="#featured-section">Xem hoạt động nổi bật</a>
  `;
  allOpportunitiesLink.href = dashboardUrl;
  allOpportunitiesLink.textContent =
    user.role === "volunteer"
      ? "Tìm hoạt động phù hợp →"
      : "Mở khu vực của bạn →";
}

document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("featuredOpportunities");
  try {
    await DataStore.init();
    const user = Auth.getCurrentUser();
    updateHomeForUser(user);

    const featured = DataStore.getAll("opportunities").filter(
      (opportunity) => opportunity.status === "open",
    );

    if (featured.length === 0) {
      showEmptyState(
        container,
        "🌱",
        "Hiện chưa có hoạt động nào. Hãy quay lại để khám phá cơ hội mới.",
      );
      return;
    }

    const opportunityImages = [
      "photo-1576091160399-112ba8d25d1d",
      "photo-1509062522246-3755977927d7",
      "photo-1559027615-cd4628902d4a",
      "photo-1511632765486-a01980e01a18",
      "photo-1548199973-03cce0bbc87b",
      "photo-1473448912268-2022ce9509d8",
      "photo-1542810634-71277d95dcbb",
    ];

    function renderOpportunities(category) {
      const filtered =
        category === "all"
          ? featured
          : featured.filter((opportunity) => opportunity.category === category);
      if (filtered.length === 0) {
        showEmptyState(
          container,
          "🌱",
          "Chưa có hoạt động phù hợp lĩnh vực này.",
        );
        return;
      }
      container.innerHTML = filtered
        .map((opportunity, index) => {
          const title = escapeHTML(opportunity.title || "Hoạt động cộng đồng");
          const description = escapeHTML(
            opportunity.description ||
              "Cùng chung tay tạo nên những thay đổi tích cực cho cộng đồng.",
          );
          const category = escapeHTML(opportunity.category || "Cộng đồng");
          const orgName = escapeHTML(
            DataStore.getOrgName(opportunity.orgId) || "Tổ chức cộng đồng",
          );
          const location = escapeHTML(opportunity.location || "Đang cập nhật");
          const image = opportunityImages[index % opportunityImages.length];
          const destination = user
            ? getPageUrl(getHomeDashboard(user))
            : getPageUrl("login");

          return `
        <article class="home-opportunity-card">
          <div class="home-opportunity-image">
            <img src="https://images.unsplash.com/${image}?auto=format&fit=crop&w=720&q=80" alt="" loading="lazy">
            <span>${category}</span>
            <a href="${destination}" aria-label="Xem hoạt động ${title}">↗</a>
          </div>
          <div class="home-opportunity-body">
          <div class="home-opportunity-topline">
            <span class="home-opportunity-status"><span aria-hidden="true">●</span> Đang nhận đăng ký</span>
          </div>
          <h3>${title}</h3>
          <p class="home-opportunity-description">${description}</p>
          <div class="home-opportunity-meta">
            <span><span aria-hidden="true">🏢</span> ${orgName}</span>
            <span><span aria-hidden="true">📍</span> ${location}</span>
            <span><span aria-hidden="true">📅</span> ${escapeHTML(formatDate(opportunity.startDate))}${opportunity.endDate ? " – " + escapeHTML(formatDate(opportunity.endDate)) : ""}</span>
          </div>
          <a class="home-opportunity-link" href="${destination}">${user ? "Xem hoạt động" : "Đăng nhập để tham gia"} <span aria-hidden="true">→</span></a>
          </div>
        </article>
      `;
        })
        .join("");
    }

    renderOpportunities("all");
    document.querySelectorAll(".home-category-filter").forEach((button) => {
      button.addEventListener("click", function () {
        document.querySelectorAll(".home-category-filter").forEach((filter) => {
          filter.classList.toggle("is-active", filter === button);
        });
        renderOpportunities(button.dataset.category);
      });
    });
    document.querySelectorAll("[data-interest]").forEach((link) => {
      link.addEventListener("click", function () {
        const filter = document.querySelector(
          '.home-category-filter[data-category="' +
            link.dataset.interest +
            '"]',
        );
        if (filter) filter.click();
      });
    });
  } catch (error) {
    console.error("Không thể tải nội dung trang chủ:", error);
    showEmptyState(
      container,
      "⚠️",
      "Không thể tải hoạt động lúc này. Vui lòng tải lại trang để thử lại.",
    );
  }
});
