# Phân công nhiệm vụ nhóm (Team Assignment) - VolunteerLink

> Học phần: Phát triển ứng dụng web cơ bản (CSE122)  
> Nhóm 2 thành viên: Trần Văn Minh & Nguyễn Bá Thành

## 1. Trần Văn Minh
- **Vai trò phụ trách:** Tình nguyện viên (Volunteer) + Điều phối viên (Coordinator)
- **Các màn hình thực hiện (10 màn):**
  1. `volunteer-profile.html`
  2. `volunteer-opportunity-search.html` (Tích hợp AI-1)
  3. `volunteer-my-shifts.html`
  4. `coordinator-resource-dashboard.html`
  5. `coordinator-matching-board.html` (Dùng thuật toán matching AI-1)
  6. `coordinator-impact-summary.html` (Tích hợp AI-3)
  7. `login.html`
  8. `register.html`
  9. `forgot-password.html`
  10. `volunteer-achievements.html`
- **Tính năng AI phụ trách:**
  - AI-1: Volunteer Matcher (Gợi ý hoạt động và ghép cặp TNV theo kỹ năng & lịch rảnh)
  - AI-3: Impact Summary (Tổng kết tác động & số giờ đóng góp sau hoạt động)
- **Trách nhiệm chéo:**
  - Thiết kế Design System (`style.css`), kiến trúc khung (Khung A & Khung B).
  - Tối ưu Responsive mobile/tablet (`responsive.css`).
  - Đánh giá chéo PR của Nguyễn Bá Thành.

---

## 2. Nguyễn Bá Thành
- **Vai trò phụ trách:** Tổ chức xã hội (Organization) + Quản trị viên (Admin)
- **Các màn hình thực hiện (11 màn):**
  1. `index.html`
  2. `notifications.html`
  3. `403.html`
  4. `404.html`
  5. `organization-opportunity-management.html`
  6. `organization-shift-management.html` (Tích hợp AI-2)
  7. `organization-volunteer-roster.html`
  8. `admin-category-management.html`
  9. `admin-user-management.html`
  10. `admin-moderation.html`
  11. `admin-dashboard.html`
- **Tính năng AI & Dữ liệu phụ trách:**
  - AI-2: Shift Shortage Predictor (Cảnh báo sớm ca trực thiếu nhân sự)
  - Xây dựng component AI Panel dùng chung (`ai-panel.js`)
  - Thiết kế và quản lý Data Store (`api.js`), 6 thực thể JSON mẫu.
- **Trách nhiệm chéo:**
  - Quản lý logic LocalStorage và tích hợp dữ liệu.
  - Tích hợp kiểm thử đa trình duyệt, đóng gói bản phát hành (`dist/`).
  - Đánh giá chéo PR của Trần Văn Minh.
