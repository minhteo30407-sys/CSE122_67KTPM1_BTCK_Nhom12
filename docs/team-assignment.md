# Phân công nhiệm vụ nhóm - VolunteerLink

- Học phần: Phát triển ứng dụng web cơ bản (CSE122).
- Thành viên: Trần Văn Minh và Nguyễn Bá Thành.
- Phân công trang được đối chiếu với các thư mục hiện có trong `src/pages/`.
- Mỗi người thực hiện HTML, CSS và JavaScript cho toàn bộ trang thuộc phạm vi mình; hai người cùng kiểm thử tích hợp và review chéo.
- Bảng công việc Trello: [VolunteerLink - BTL Phát triển ứng dụng web](https://trello.com/b/6aa76d8cbf36c881dce53f29/).

## Trần Văn Minh

- Thư mục nguồn: `src/pages/tran_van_minh/`.
- Vai trò phụ trách: Điều phối viên, quản trị viên và các trang tài khoản.
- Tổng số: 10 trang.

### Các trang phụ trách

- `coordinator-resource-dashboard`: Bảng điều khiển tài nguyên điều phối.
- `coordinator-matching-board`: Bảng ghép tình nguyện viên với ca.
- `coordinator-impact-summary`: Tổng hợp đóng góp và tác động.
- `admin-category-management`: Quản lý danh mục.
- `admin-dashboard`: Bảng điều khiển quản trị.
- `admin-moderation`: Kiểm duyệt nội dung.
- `admin-user-management`: Quản lý người dùng.
- `login`: Đăng nhập.
- `register`: Đăng ký.
- `forgot-password`: Khôi phục mật khẩu.

### Module liên quan được các trang sử dụng

- `src/js/modules/volunteer-matcher.js`: Ghép tình nguyện viên phù hợp với ca.
- `src/js/modules/impact-summary.js`: Tổng hợp số liệu đóng góp và tác động.

## Nguyễn Bá Thành

- Thư mục nguồn: `src/pages/nguyen_ba_thanh/`.
- Vai trò phụ trách: Tình nguyện viên, tổ chức xã hội và các trang dùng chung.
- Tổng số: 11 trang.

### Các trang phụ trách

- `index`: Trang chủ.
- `notifications`: Trung tâm thông báo.
- `403`: Trang không có quyền truy cập.
- `404`: Trang không tìm thấy.
- `volunteer-profile`: Hồ sơ tình nguyện viên.
- `volunteer-opportunity-search`: Tìm kiếm hoạt động tình nguyện.
- `volunteer-my-shifts`: Các ca tình nguyện của tôi.
- `volunteer-achievements`: Thành tựu tình nguyện.
- `organization-opportunity-management`: Quản lý hoạt động của tổ chức.
- `organization-shift-management`: Quản lý ca của tổ chức.
- `organization-volunteer-roster`: Danh sách tình nguyện viên đăng ký.

### Module liên quan được các trang sử dụng

- `src/js/modules/volunteer-matcher.js`: Gợi ý hoạt động phù hợp cho tình nguyện viên.
- `src/js/modules/shift-predictor.js`: Phân tích và cảnh báo ca có thể thiếu người.
- `src/js/modules/volunteer-achievements.js`: Hiển thị thành tựu tình nguyện.

## Cấu trúc mỗi trang

- Mỗi trang có thư mục riêng dưới `src/pages/tran_van_minh/` hoặc `src/pages/nguyen_ba_thanh/`.
- `index.html`: Nội dung và cấu trúc trang.
- `style.css`: Kiểu giao diện riêng của trang.
- `script.js`: Xử lý tương tác riêng của trang.

## Mã nguồn dùng chung

- `src/js/services.js`: Dữ liệu, xác thực và đồng bộ dữ liệu.
- `src/js/modules/ai-panel.js`: Giao diện bảng tính năng AI.
- `src/js/modules/site-chat.js`: Widget chatbot dùng chung.
- `src/assets/`: Dữ liệu và hình ảnh dùng chung.
- Mỗi trang có `style.css` riêng trong thư mục người phụ trách; CSS không được nạp từ thư mục dùng chung.
- JavaScript và dữ liệu dùng chung được giữ tách riêng vì nhiều trang cùng sử dụng; việc một trang gọi module không xác định riêng tác giả của module đó.

## Build và chỉnh sửa

- `src/build.js` đọc các trang từ hai thư mục thành viên.
- Lệnh `npm run build` tạo các trang trong `dist/pages/` theo tên chức năng, không đưa tên người phụ trách vào URL.
- Chỉnh sửa mã nguồn trong `src/`, không sửa trực tiếp bản build trong `dist/`.
