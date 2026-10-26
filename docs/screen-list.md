# Bảng kiểm kê màn hình (Screen Inventory) - VolunteerLink

> Học phần: Phát triển ứng dụng web cơ bản (CSE122)
> Nhóm: Trần Văn Minh và Nguyễn Bá Thành
> Bản nguồn được chia theo thư mục trong `src/pages/tran_van_minh/` và `src/pages/nguyen_ba_thanh/`. Bản build trong `dist/pages/` giữ URL theo tên chức năng.

## Trần Văn Minh

- Thư mục nguồn: `src/pages/tran_van_minh/`
- Tổng số: 10 màn hình.

### Tài khoản

- `login`
  - Tên màn hình: Đăng nhập hệ thống.
  - Vai trò: Dùng chung.
  - Trạng thái: Đăng nhập.
  - Thư mục: `src/pages/tran_van_minh/login/`
- `register`
  - Tên màn hình: Đăng ký tài khoản.
  - Vai trò: Dùng chung.
  - Trạng thái: Đăng ký.
  - Thư mục: `src/pages/tran_van_minh/register/`
- `forgot-password`
  - Tên màn hình: Khôi phục mật khẩu.
  - Vai trò: Dùng chung.
  - Trạng thái: Khôi phục mật khẩu.
  - Thư mục: `src/pages/tran_van_minh/forgot-password/`

### Điều phối viên

- `coordinator-resource-dashboard`
  - Tên màn hình: Bảng điều khiển tài nguyên.
  - CRUD/trạng thái: Đọc (R).
  - Thư mục: `src/pages/tran_van_minh/coordinator-resource-dashboard/`
- `coordinator-matching-board`
  - Tên màn hình: Bảng ghép ca thông minh.
  - CRUD/trạng thái: Tạo, đọc, cập nhật (C/R/U).
  - AI: AI-1 Volunteer Matcher.
  - Thư mục: `src/pages/tran_van_minh/coordinator-matching-board/`
- `coordinator-impact-summary`
  - Tên màn hình: Tổng kết đóng góp và tác động.
  - CRUD/trạng thái: Tạo, đọc, cập nhật, xóa (C/R/U/D).
  - AI: AI-3 Impact Summary.
  - Thư mục: `src/pages/tran_van_minh/coordinator-impact-summary/`

### Quản trị viên

- `admin-category-management`
  - Tên màn hình: Quản lý danh mục kỹ năng.
  - CRUD/trạng thái: Tạo, đọc, cập nhật, xóa (C/R/U/D).
  - Thư mục: `src/pages/tran_van_minh/admin-category-management/`
- `admin-user-management`
  - Tên màn hình: Quản lý người dùng hệ thống.
  - CRUD/trạng thái: Tạo, đọc, cập nhật (C/R/U).
  - Thư mục: `src/pages/tran_van_minh/admin-user-management/`
- `admin-moderation`
  - Tên màn hình: Hàng đợi kiểm duyệt.
  - CRUD/trạng thái: Tạo, đọc, cập nhật, xóa (C/R/U/D).
  - Thư mục: `src/pages/tran_van_minh/admin-moderation/`
- `admin-dashboard`
  - Tên màn hình: Bảng tổng quan quản trị.
  - CRUD/trạng thái: Đọc (R).
  - Thư mục: `src/pages/tran_van_minh/admin-dashboard/`

## Nguyễn Bá Thành

- Thư mục nguồn: `src/pages/nguyen_ba_thanh/`
- Tổng số: 11 màn hình.

### Trang dùng chung

- `index`
  - Tên màn hình: Trang chủ giới thiệu.
  - CRUD/trạng thái: Đọc (R).
  - Thư mục: `src/pages/nguyen_ba_thanh/index/`
- `notifications`
  - Tên màn hình: Trung tâm thông báo.
  - CRUD/trạng thái: Đọc, cập nhật (R/U).
  - Thư mục: `src/pages/nguyen_ba_thanh/notifications/`
- `403`
  - Tên màn hình: Trang lỗi không có quyền.
  - Trạng thái: Lỗi quyền truy cập.
  - Thư mục: `src/pages/nguyen_ba_thanh/403/`
- `404`
  - Tên màn hình: Trang lỗi không tìm thấy.
  - Trạng thái: Không tìm thấy trang.
  - Thư mục: `src/pages/nguyen_ba_thanh/404/`

### Tình nguyện viên

- `volunteer-profile`
  - Tên màn hình: Hồ sơ tình nguyện viên.
  - CRUD/trạng thái: Đọc, cập nhật (R/U).
  - Thư mục: `src/pages/nguyen_ba_thanh/volunteer-profile/`
- `volunteer-opportunity-search`
  - Tên màn hình: Tìm kiếm hoạt động.
  - CRUD/trạng thái: Tạo, đọc, cập nhật (C/R/U).
  - AI: AI-1 Volunteer Matcher.
  - Thư mục: `src/pages/nguyen_ba_thanh/volunteer-opportunity-search/`
- `volunteer-my-shifts`
  - Tên màn hình: Ca của tôi.
  - CRUD/trạng thái: Tạo, đọc, cập nhật, xóa (C/R/U/D).
  - Thư mục: `src/pages/nguyen_ba_thanh/volunteer-my-shifts/`
- `volunteer-achievements`
  - Tên màn hình: Thành tựu tình nguyện viên.
  - CRUD/trạng thái: Đọc (R).
  - Thư mục: `src/pages/nguyen_ba_thanh/volunteer-achievements/`

### Tổ chức xã hội

- `organization-opportunity-management`
  - Tên màn hình: Quản lý hoạt động tổ chức.
  - CRUD/trạng thái: Tạo, đọc, cập nhật, xóa (C/R/U/D).
  - Thư mục: `src/pages/nguyen_ba_thanh/organization-opportunity-management/`
- `organization-shift-management`
  - Tên màn hình: Quản lý ca trực tổ chức.
  - CRUD/trạng thái: Tạo, đọc, cập nhật (C/R/U).
  - AI: AI-2 Shift Predictor.
  - Thư mục: `src/pages/nguyen_ba_thanh/organization-shift-management/`
- `organization-volunteer-roster`
  - Tên màn hình: Danh sách tình nguyện viên đăng ký ca.
  - CRUD/trạng thái: Tạo, đọc, cập nhật, xóa (C/R/U/D).
  - Thư mục: `src/pages/nguyen_ba_thanh/organization-volunteer-roster/`

## Thành phần dùng chung

- Chatbot AI-4 trong `src/js/modules/site-chat.js` là widget dùng chung, không phải màn hình riêng nên không tính vào tổng 21 màn hình.

### Ký hiệu CRUD

- C: Tạo (Create).
- R: Đọc (Read).
- U: Cập nhật (Update).
- D: Xóa (Delete).
