# Bảng kiểm kê màn hình (Screen Inventory) - VolunteerLink

> Học phần: Phát triển ứng dụng web cơ bản (CSE122)
> Nhóm 2 thành viên: Trần Văn Minh & Nguyễn Bá Thành
> Bản nguồn chia theo người phụ trách trong `src/pages/tran_van_minh/` và `src/pages/nguyen_ba_thanh/`; bản build trong `dist/pages/` giữ URL theo tên chức năng.

| # | Mã trang | Tên màn hình | Vai trò | CRUD / trạng thái | AI Feature | Người phụ trách | Thư mục nguồn |
|---|----------|--------------|---------|-------------------|------------|-----------------|---------------|
| 1 | `login` | Đăng nhập hệ thống | Dùng chung | Trạng thái | - | Trần Văn Minh | `src/pages/tran_van_minh/login/` |
| 2 | `register` | Đăng ký tài khoản | Dùng chung | Trạng thái | - | Trần Văn Minh | `src/pages/tran_van_minh/register/` |
| 3 | `forgot-password` | Khôi phục mật khẩu | Dùng chung | Trạng thái | - | Trần Văn Minh | `src/pages/tran_van_minh/forgot-password/` |
| 4 | `coordinator-resource-dashboard` | Bảng điều khiển tài nguyên | Điều phối viên | R | - | Trần Văn Minh | `src/pages/tran_van_minh/coordinator-resource-dashboard/` |
| 5 | `coordinator-matching-board` | Bảng ghép ca thông minh | Điều phối viên | C / R / U | AI-1 Volunteer Matcher | Trần Văn Minh | `src/pages/tran_van_minh/coordinator-matching-board/` |
| 6 | `coordinator-impact-summary` | Tổng kết đóng góp & tác động | Điều phối viên | C / R / U / D | AI-3 Impact Summary | Trần Văn Minh | `src/pages/tran_van_minh/coordinator-impact-summary/` |
| 7 | `admin-category-management` | Quản lý danh mục kỹ năng | Quản trị viên | C / R / U / D | - | Trần Văn Minh | `src/pages/tran_van_minh/admin-category-management/` |
| 8 | `admin-user-management` | Quản lý người dùng hệ thống | Quản trị viên | C / R / U | - | Trần Văn Minh | `src/pages/tran_van_minh/admin-user-management/` |
| 9 | `admin-moderation` | Hàng đợi kiểm duyệt | Quản trị viên | C / R / U / D | - | Trần Văn Minh | `src/pages/tran_van_minh/admin-moderation/` |
| 10 | `admin-dashboard` | Dashboard tổng quan quản trị | Quản trị viên | R | - | Trần Văn Minh | `src/pages/tran_van_minh/admin-dashboard/` |
| 11 | `index` | Trang chủ giới thiệu | Dùng chung | R | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/index/` |
| 12 | `notifications` | Trung tâm thông báo | Dùng chung | R / U | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/notifications/` |
| 13 | `403` | Trang lỗi không có quyền | Dùng chung | Trạng thái | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/403/` |
| 14 | `404` | Trang lỗi không tìm thấy | Dùng chung | Trạng thái | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/404/` |
| 15 | `volunteer-profile` | Hồ sơ tình nguyện viên | Tình nguyện viên | R / U | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/volunteer-profile/` |
| 16 | `volunteer-opportunity-search` | Tìm kiếm hoạt động | Tình nguyện viên | C / R / U | AI-1 Volunteer Matcher | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/volunteer-opportunity-search/` |
| 17 | `volunteer-my-shifts` | Ca của tôi | Tình nguyện viên | C / R / U / D | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/volunteer-my-shifts/` |
| 18 | `volunteer-achievements` | Thành tựu tình nguyện viên | Tình nguyện viên | R | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/volunteer-achievements/` |
| 19 | `organization-opportunity-management` | Quản lý hoạt động tổ chức | Tổ chức xã hội | C / R / U / D | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/organization-opportunity-management/` |
| 20 | `organization-shift-management` | Quản lý ca trực tổ chức | Tổ chức xã hội | C / R / U | AI-2 Shift Predictor | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/organization-shift-management/` |
| 21 | `organization-volunteer-roster` | Danh sách TNV đăng ký ca | Tổ chức xã hội | C / R / U / D | - | Nguyễn Bá Thành | `src/pages/nguyen_ba_thanh/organization-volunteer-roster/` |

**Tổng cộng:** 21 màn hình (Trần Văn Minh: 10 màn hình trong `src/pages/tran_van_minh/`, Nguyễn Bá Thành: 11 màn hình trong `src/pages/nguyen_ba_thanh/`).

**Thành phần dùng chung bổ sung:** Chatbot AI-4 (`src/js/modules/site-chat.js`) là widget dùng chung, không phải trang độc lập nên không cộng vào tổng 21 màn hình.
