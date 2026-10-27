# Bảng kiểm kê màn hình (Screen Inventory) - VolunteerLink

> **Học phần:** Phát triển ứng dụng Web cơ bản (CSE122) - BTL-24  
> **Nhóm thực hiện:** Trần Văn Minh & Nguyễn Bá Thành  
> **Bản thiết kế Figma:** [Figma BTL_Volunteerlink](https://www.figma.com/design/HuP4KEqctSwA49iLHnBQV6/BTL_Volunteerlink?node-id=5-2030&t=JJLerCAi8yzLaugf-1)  
> **Bảng công việc Trello:** [VolunteerLink Trello Board](https://trello.com/b/6aa76d8cbf36c881dce53f29/)  
> **Kho mã nguồn:** [CSE122_67KTPM1_BTCK_Nhom12](https://github.com/minhteo30407-sys/CSE122_67KTPM1_BTCK_Nhom12)

---

## Bảng đối chiếu 12 cột chuẩn Barem CSE122

| Role | User Goal | User Task | Screen | File | CRUD | States | AI | Assignee | Task ID | Branch | OBS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dùng chung** | Tìm hiểu nền tảng & chuyển vai trò | Xem giới thiệu, khám phá hoạt động nổi bật | Trang chủ giới thiệu | `dist/pages/index/index.html` | R | Normal, Empty | AI-4 (Chatbot) | Nguyễn Bá Thành | TASK-01 | `feature/volunteer-screens` | `SV2-01-index.mp4` |
| **Dùng chung** | Cập nhật tin tức & phản hồi hệ thống | Xem thông báo ca, duyệt đơn, đánh dấu đã đọc | Trung tâm thông báo | `dist/pages/notifications/index.html` | R, U | Normal, Empty, Loading | — | Nguyễn Bá Thành | TASK-02 | `feature/volunteer-screens` | `SV2-02-notifications.mp4` |
| **Dùng chung** | Nhận biết lỗi phân quyền | Xem thông báo không có quyền truy cập | Lỗi 403 Forbidden | `dist/pages/403/index.html` | R | Normal | — | Nguyễn Bá Thành | TASK-03 | `feature/volunteer-screens` | `SV2-03-403.mp4` |
| **Dùng chung** | Định hướng khi gõ sai đường dẫn | Xem thông báo trang không tồn tại & quay lại | Lỗi 404 Not Found | `dist/pages/404/index.html` | R | Normal | — | Nguyễn Bá Thành | TASK-04 | `feature/volunteer-screens` | `SV2-04-404.mp4` |
| **Tình nguyện viên** | Quản lý thông tin & kỹ năng bản thân | Cập nhật kỹ năng, khu vực, lịch rảnh, liên hệ | Hồ sơ tình nguyện viên | `dist/pages/volunteer-profile/index.html` | R, U | Normal, Loading, Error | — | Nguyễn Bá Thành | TASK-05 | `feature/volunteer-screens` | `SV2-05-volunteer-profile.mp4` |
| **Tình nguyện viên** | Tìm kiếm hoạt động phù hợp | Lọc theo chủ đề, địa điểm, xem gợi ý ghép đôi | Tìm kiếm hoạt động | `dist/pages/volunteer-opportunity-search/index.html` | C, R, U | Normal, Loading, Empty, Error | AI-1 (Volunteer Matcher) | Nguyễn Bá Thành | TASK-06 | `feature/volunteer-screens` | `SV2-06-opportunity-search.mp4` |
| **Tình nguyện viên** | Theo dõi lịch trực & tiến độ ca | Xem ca sắp tới, hủy đăng ký, điểm danh | Ca của tôi | `dist/pages/volunteer-my-shifts/index.html` | C, R, U, D | Normal, Empty, Loading | — | Nguyễn Bá Thành | TASK-07 | `feature/volunteer-screens` | `SV2-07-volunteer-my-shifts.mp4` |
| **Tình nguyện viên** | Ghi nhận cống hiến & huy hiệu | Xem số giờ tích lũy, huy hiệu đạt được, mục tiêu | Thành tựu tình nguyện | `dist/pages/volunteer-achievements/index.html` | R | Normal, Loading, Empty | — | Nguyễn Bá Thành | TASK-08 | `feature/volunteer-screens` | `SV2-08-volunteer-achievements.mp4` |
| **Tổ chức xã hội** | Tổ chức chiến dịch cộng đồng | Đăng hoạt động mới, sửa mô tả, đóng hoạt động | Quản lý hoạt động | `dist/pages/organization-opportunity-management/index.html` | C, R, U, D | Normal, Loading, Empty, Error | — | Nguyễn Bá Thành | TASK-09 | `feature/volunteer-screens` | `SV2-09-org-opp-manage.mp4` |
| **Tổ chức xã hội** | Quản trị nhân lực & thời gian ca | Tạo ca trực, định lượng tình nguyện viên, xem cảnh báo thiếu | Quản lý ca trực | `dist/pages/organization-shift-management/index.html` | C, R, U | Normal, Loading, Empty, Error | AI-2 (Shift Predictor) | Nguyễn Bá Thành | TASK-10 | `feature/volunteer-screens` | `SV2-10-org-shift-manage.mp4` |
| **Tổ chức xã hội** | Duyệt & điểm danh tình nguyện viên | Phê duyệt đơn đăng ký, điểm danh, ghi nhận giờ | Danh sách đăng ký ca | `dist/pages/organization-volunteer-roster/index.html` | C, R, U, D | Normal, Loading, Empty, Error | — | Nguyễn Bá Thành | TASK-11 | `feature/volunteer-screens` | `SV2-11-org-roster.mp4` |
| **Tài khoản** | Xác thực danh tính | Đăng nhập hệ thống bằng email và mật khẩu | Đăng nhập | `dist/pages/login/index.html` | R | Normal, Error | — | Trần Văn Minh | TASK-12 | `feature/auth-and-admin` | `SV1-12-login.mp4` |
| **Tài khoản** | Gia nhập mạng lưới | Tạo tài khoản tình nguyện viên hoặc tổ chức | Đăng ký | `dist/pages/register/index.html` | C, R | Normal, Error | — | Trần Văn Minh | TASK-13 | `feature/auth-and-admin` | `SV1-13-register.mp4` |
| **Tài khoản** | Khôi phục quyền truy cập | Gửi yêu cầu đặt lại mật khẩu qua email | Quên mật khẩu | `dist/pages/forgot-password/index.html` | R, U | Normal, Error | — | Trần Văn Minh | TASK-14 | `feature/auth-and-admin` | `SV1-14-forgot-password.mp4` |
| **Điều phối viên** | Giám sát toàn cục tài nguyên | Theo dõi số ca thiếu hụt, tỷ lệ lấp đầy, nhu cầu kỹ năng | Bảng điều khiển tài nguyên | `dist/pages/coordinator-resource-dashboard/index.html` | R | Normal, Loading, Empty | — | Trần Văn Minh | TASK-15 | `feature/coordinator-portal` | `SV1-15-coord-dashboard.mp4` |
| **Điều phối viên** | Tối ưu hóa điều phối nhân lực | Ghép đôi tình nguyện viên rảnh với ca còn thiếu | Bảng ghép ca thông minh | `dist/pages/coordinator-matching-board/index.html` | C, R, U | Normal, Loading, Empty, Error | AI-1 (Volunteer Matcher) | Trần Văn Minh | TASK-16 | `feature/coordinator-portal` | `SV1-16-coord-matching.mp4` |
| **Điều phối viên** | Báo cáo tác động xã hội | Tổng kết số giờ công hiến, giá trị kinh tế, xuất báo cáo | Tổng kết tác động | `dist/pages/coordinator-impact-summary/index.html` | C, R, U, D | Normal, Loading, Empty | AI-3 (Impact Summary) | Trần Văn Minh | TASK-17 | `feature/coordinator-portal` | `SV1-17-coord-impact.mp4` |
| **Quản trị viên** | Chuẩn hóa danh mục toàn hệ thống | Thêm, sửa, đóng danh mục kỹ năng và lĩnh vực | Quản lý danh mục | `dist/pages/admin-category-management/index.html` | C, R, U, D | Normal, Loading, Empty, Error | — | Trần Văn Minh | TASK-18 | `feature/auth-and-admin` | `SV1-18-admin-category.mp4` |
| **Quản trị viên** | Kiểm soát người dùng nền tảng | Phân quyền, khóa/mở tài khoản, xem lịch sử | Quản lý người dùng | `dist/pages/admin-user-management/index.html` | C, R, U | Normal, Loading, Empty, Error | — | Trần Văn Minh | TASK-19 | `feature/auth-and-admin` | `SV1-19-admin-user.mp4` |
| **Quản trị viên** | Đảm bảo an toàn nội dung cộng đồng | Phê duyệt hoặc từ chối chiến dịch do tổ chức tạo | Hàng đợi kiểm duyệt | `dist/pages/admin-moderation/index.html` | C, R, U, D | Normal, Loading, Empty, Error | — | Trần Văn Minh | TASK-20 | `feature/auth-and-admin` | `SV1-20-admin-moderation.mp4` |
| **Quản trị viên** | Giám sát chỉ số vận hành tổng thể | Xem KPI hệ thống, tăng trưởng người dùng và lượt tham gia | Bảng tổng quan quản trị | `dist/pages/admin-dashboard/index.html` | R | Normal, Loading, Empty | — | Trần Văn Minh | TASK-21 | `feature/auth-and-admin` | `SV1-21-admin-dashboard.mp4` |

---

## Thống kê phân công Vertical Slice

- **Nguyễn Bá Thành (SV2):** 11 màn hình (TASK-01 → TASK-11)
  - Vai trò chính: Tình nguyện viên (Volunteer), Tổ chức xã hội (Organization), Các trang dùng chung (Shared/Error).
  - Tính năng AI phụ trách: **AI-1** (Volunteer Matcher phía tìm kiếm), **AI-2** (Shift Shortage Predictor phía tổ chức).
  - Trục chéo: Kiến trúc JavaScript, mô-đun dữ liệu giả lập (`js/services.js`, `localStorage`), chuẩn hóa tương tác AI UX.

- **Trần Văn Minh (SV1):** 10 màn hình (TASK-12 → TASK-21)
  - Vai trò chính: Điều phối viên (Coordinator), Quản trị viên (Admin), Tài khoản & Xác thực (Auth).
  - Tính năng AI phụ trách: **AI-1** (Matching Board phía điều phối), **AI-3** (Impact Summary).
  - Trục chéo: Design System (`css/style.css`, biến `:root`), điều hướng chung (`Role Switcher`), Accessibility (A11y).

