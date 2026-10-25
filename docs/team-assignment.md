# Phân công nhiệm vụ nhóm (Team Assignment) - VolunteerLink

> Học phần: Phát triển ứng dụng web cơ bản (CSE122)
> Nhóm 2 thành viên: Trần Văn Minh & Nguyễn Bá Thành
> Mã nguồn trang được chia theo người phụ trách trong `src/pages/minh/` và `src/pages/thanh/`.

## 1. Trần Văn Minh
- **Vai trò phụ trách:** Điều phối viên (Coordinator) + Quản trị viên (Admin)
- **Các màn hình thực hiện (10 màn):**
  1. `coordinator-resource-dashboard`
  2. `coordinator-matching-board` (Dùng thuật toán matching AI-1)
  3. `coordinator-impact-summary` (Tích hợp AI-3)
  4. `admin-category-management`
  5. `admin-user-management`
  6. `admin-moderation`
  7. `admin-dashboard`
  8. `login`
  9. `register`
  10. `forgot-password`
- **Tính năng AI phụ trách:**
  - AI-1: Volunteer Matcher (Gợi ý hoạt động và ghép cặp TNV theo kỹ năng & lịch rảnh)
  - AI-3: Impact Summary (Tổng kết tác động & số giờ đóng góp sau hoạt động)
- **Trách nhiệm chéo:**
  - Thiết kế Design System (`global.css`), kiến trúc khung (Khung A & Khung B).
  - Tối ưu Responsive mobile/tablet (`responsive.css`).
  - Đánh giá chéo PR của Nguyễn Bá Thành.
- **Thư mục trang:** `src/pages/minh/`

---

## 2. Nguyễn Bá Thành
- **Vai trò phụ trách:** Tình nguyện viên (Volunteer) + Tổ chức xã hội (Organization)
- **Các màn hình thực hiện (11 màn):**
  1. `volunteer-profile`
  2. `volunteer-opportunity-search`
  3. `volunteer-my-shifts`
  4. `volunteer-achievements`
  5. `organization-opportunity-management`
  6. `organization-shift-management` (Tích hợp AI-2)
  7. `organization-volunteer-roster`
  8. `index`
  9. `notifications`
  10. `403`
  11. `404`
- **Tính năng AI & Dữ liệu phụ trách:**
  - AI-2: Shift Shortage Predictor (Cảnh báo sớm ca trực thiếu nhân sự)
  - Xây dựng component AI Panel dùng chung (`ai-panel.js`)
  - Thiết kế và quản lý Data Store (`services.js`), 6 thực thể JSON mẫu.
- **Trách nhiệm chéo:**
  - Quản lý logic LocalStorage và tích hợp dữ liệu.
  - Tích hợp kiểm thử đa trình duyệt, đóng gói bản phát hành (`dist/`).
  - Đánh giá chéo PR của Trần Văn Minh.
- **Thư mục trang:** `src/pages/thanh/`
