# Phân công nhiệm vụ nhóm (Team Assignment) - VolunteerLink

> Học phần: Phát triển ứng dụng web cơ bản (CSE122)
> Nhóm: Trần Văn Minh và Nguyễn Bá Thành
> Danh sách trang và người phụ trách dưới đây được đối chiếu với các thư mục hiện có trong `src/pages/`.

## Trần Văn Minh

**Thư mục nguồn:** `src/pages/tran_van_minh/`
**Vai trò trên các trang:** Điều phối viên, quản trị viên và các trang tài khoản.

| # | Thư mục trang | Nội dung |
|---|---|---|
| 1 | `coordinator-resource-dashboard` | Bảng điều khiển tài nguyên điều phối |
| 2 | `coordinator-matching-board` | Bảng ghép tình nguyện viên với ca |
| 3 | `coordinator-impact-summary` | Tổng hợp đóng góp và tác động |
| 4 | `admin-category-management` | Quản lý danh mục |
| 5 | `admin-dashboard` | Bảng điều khiển quản trị |
| 6 | `admin-moderation` | Kiểm duyệt nội dung |
| 7 | `admin-user-management` | Quản lý người dùng |
| 8 | `login` | Đăng nhập |
| 9 | `register` | Đăng ký |
| 10 | `forgot-password` | Khôi phục mật khẩu |

**Phạm vi công việc:** 10 trang điều phối viên, quản trị viên và tài khoản. Các trang của điều phối viên sử dụng module ghép tình nguyện viên và tổng hợp tác động khi cần.

## Nguyễn Bá Thành

**Thư mục nguồn:** `src/pages/nguyen_ba_thanh/`
**Vai trò trên các trang:** Tình nguyện viên, tổ chức xã hội và các trang dùng chung.

| # | Thư mục trang | Nội dung |
|---|---|---|
| 1 | `index` | Trang chủ |
| 2 | `notifications` | Thông báo |
| 3 | `403` | Trang không có quyền truy cập |
| 4 | `404` | Trang không tìm thấy |
| 5 | `volunteer-profile` | Hồ sơ tình nguyện viên |
| 6 | `volunteer-opportunity-search` | Tìm kiếm hoạt động tình nguyện |
| 7 | `volunteer-my-shifts` | Các ca tình nguyện của tôi |
| 8 | `volunteer-achievements` | Thành tựu tình nguyện |
| 9 | `organization-opportunity-management` | Quản lý hoạt động của tổ chức |
| 10 | `organization-shift-management` | Quản lý ca của tổ chức |
| 11 | `organization-volunteer-roster` | Danh sách tình nguyện viên đăng ký |

**Phạm vi công việc:** 11 trang tình nguyện viên, tổ chức xã hội và trang dùng chung. Các trang liên quan sử dụng module dự đoán thiếu hụt ca, gợi ý hoạt động và thành tựu tình nguyện.

## Cấu trúc mỗi trang

Mỗi thư mục trang trong `src/pages/tran_van_minh/` và `src/pages/nguyen_ba_thanh/` có cùng cấu trúc:

- `index.html` — nội dung và cấu trúc trang.
- `style.css` — kiểu giao diện riêng của trang.
- `script.js` — xử lý tương tác riêng của trang.

## Mã nguồn dùng chung

Các module dùng chung nằm trong `src/js/`, không nằm bên trong thư mục của riêng Minh hoặc Thành:

- `services.js` — dữ liệu, xác thực và đồng bộ dữ liệu.
- `modules/ai-panel.js` — giao diện bảng tính năng AI.
- `modules/volunteer-matcher.js` — gợi ý tình nguyện viên hoặc hoạt động phù hợp.
- `modules/shift-predictor.js` — phân tích và cảnh báo ca có thể thiếu người.
- `modules/impact-summary.js` — tổng hợp số liệu đóng góp.
- `modules/volunteer-achievements.js` — thành tựu tình nguyện.
- `modules/site-chat.js` — widget chatbot dùng chung.

`src/build.js` đọc trang từ hai thư mục `tran_van_minh/` và `nguyen_ba_thanh/`, sau đó tạo bản chạy trong `dist/pages/` theo tên chức năng. Vì vậy, hãy chỉnh sửa bản nguồn trong `src/`, không chỉnh trực tiếp bản được tạo trong `dist/`.

## Phần dùng chung

Các tệp `src/js/`, `src/css/` và `src/assets/` phục vụ nhiều trang. Mã nguồn hiện tại không gắn các phần dùng chung này cho riêng một thành viên; vì vậy tài liệu không quy kết tác giả module chỉ dựa trên việc một trang đang sử dụng module đó.
