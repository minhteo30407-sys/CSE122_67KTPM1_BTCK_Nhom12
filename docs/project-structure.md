# Cấu trúc dự án VolunteerLink

Tài liệu này giải thích cây thư mục theo thứ tự từ thư mục gốc đến các thư mục con. Mã để chỉnh sửa nằm chủ yếu trong `src/`; `dist/` là sản phẩm được tạo ra sau khi build.

## Thư mục gốc

- `README.md`
  - Giới thiệu sản phẩm, hướng dẫn chạy, kiểm thử, build, Fake API và chatbot.
  - Là điểm bắt đầu để thành viên mới hiểu dự án.
- `package.json`
  - Khai báo tên dự án, loại module Node.js và các lệnh npm.
  - `npm run build`: tạo bản build bằng `src/build.js`.
  - `npm start`: chạy máy chủ trong `server/server.js`.
  - `npm test`: chạy các kiểm thử Node.js trong `tests/`.
- `.gitignore`
  - Bảo Git bỏ qua `node_modules/`, `.env` và các biến thể `.env.*`.
  - Cho phép giữ `.env.example` trong Git vì file mẫu không chứa bí mật.
- `.env.example`
  - Mẫu biến môi trường dành cho chatbot Gemini.
  - `GEMINI_API_KEY` là chỗ điền Gemini API key nếu nhóm muốn bật chatbot Gemini thật; giá trị mẫu không phải key sử dụng được.
  - Không phải cấu hình của Fake API MockAPI.
- `render.yaml`
  - Khai báo cách tạo Web Service trên Render: dùng Node.js, chạy lệnh build/start và kiểm tra `/api/health`.
  - Không yêu cầu Gemini API key để triển khai website hoặc Fake API. Chỉ cần cấu hình key nếu muốn dùng chatbot Gemini.
- `node_modules/`
  - Thư mục thư viện Node.js được cài trên máy bằng npm.
  - Không đưa vào Git; không sửa file trong thư mục này.
- `.git/`
  - Dữ liệu nội bộ Git như lịch sử, nhánh và cấu hình repository.
  - Không phải mã nguồn ứng dụng và không chỉnh sửa thủ công.

## `src/` — mã nguồn dùng để phát triển

`src/` là nguồn chính. Hãy sửa file ở đây rồi chạy build; không sửa bản tương ứng trong `dist/` vì build sau có thể ghi đè.

### `src/build.js`

- Đọc các trang từ thư mục của hai thành viên.
- Sao chép JavaScript và tài sản dùng chung sang `dist/`.
- Kiểm tra mỗi trang có đủ `index.html`, `style.css`, `script.js`, không trùng tên, rồi xuất trang theo URL chức năng.
- Chạy bằng `npm run build`.

### `src/pages/` — 21 trang giao diện

- Mỗi thư mục con tương ứng một trang độc lập.
- Mỗi trang có ba file:
  - `index.html`: nội dung, cấu trúc, biểu mẫu và liên kết JavaScript/CSS của trang.
  - `style.css`: giao diện và responsive riêng của trang.
  - `script.js`: sự kiện và nghiệp vụ riêng của trang.
- Tên trang được giữ trong URL sau build; tên thư mục thành viên chỉ để phân chia công việc.

#### `src/pages/tran_van_minh/` — 10 trang

- `admin-category-management/`: quản lý danh mục kỹ năng.
- `admin-dashboard/`: tổng quan dành cho quản trị viên.
- `admin-moderation/`: kiểm duyệt nội dung.
- `admin-user-management/`: quản lý tài khoản người dùng.
- `coordinator-impact-summary/`: tổng hợp giờ tình nguyện và tác động.
- `coordinator-matching-board/`: ghép tình nguyện viên với ca.
- `coordinator-resource-dashboard/`: theo dõi tình hình nhân sự và tài nguyên.
- `forgot-password/`: giao diện khôi phục mật khẩu; gửi email thật chưa được tích hợp.
- `login/`: đăng nhập tài khoản.
- `register/`: đăng ký tài khoản.

#### `src/pages/nguyen_ba_thanh/` — 11 trang

- `403/`: thông báo không có quyền truy cập.
- `404/`: thông báo không tìm thấy trang.
- `index/`: trang chủ giới thiệu VolunteerLink.
- `notifications/`: trung tâm thông báo.
- `organization-opportunity-management/`: tổ chức tạo và quản lý hoạt động.
- `organization-shift-management/`: tổ chức tạo, quản lý và theo dõi ca.
- `organization-volunteer-roster/`: danh sách tình nguyện viên đăng ký.
- `volunteer-achievements/`: thành tựu và tiến độ tình nguyện viên.
- `volunteer-my-shifts/`: các ca tình nguyện viên đã đăng ký.
- `volunteer-opportunity-search/`: tìm kiếm, lọc và lưu hoạt động yêu thích.
- `volunteer-profile/`: hồ sơ tình nguyện viên.

Danh sách màn hình, vai trò và nghiệp vụ chi tiết hơn nằm trong [screen-list.md](./screen-list.md). Người phụ trách từng trang được ghi trong [team-assignment.md](./team-assignment.md).

### `src/js/` — JavaScript dùng chung

- `app.js`
  - Các hàm nền dùng bởi nhiều trang: khung giao diện, menu theo vai trò, điều hướng, kiểm tra đăng nhập/quyền truy cập, thông báo, hộp thoại, kiểm tra biểu mẫu, trạng thái tải/rỗng, xuất CSV và một số hàm hiển thị.
- `services.js`
  - Nạp dữ liệu JSON ban đầu, quản lý dữ liệu trong LocalStorage và xử lý tài khoản.
  - Chứa cấu hình URL MockAPI: `https://6ada264a7512f497b3ffad0b.mockapi.io/api/v1`.
  - Đồng bộ hai collection `volunteers` và `opportunities`; các thực thể khác tiếp tục dùng JSON/LocalStorage.
  - MockAPI này là Fake API của dự án, không cần Gemini API key. Chỉ dùng dữ liệu thử nghiệm, không đưa dữ liệu cá nhân thật lên dịch vụ công khai.

#### `src/js/modules/` — module dùng chung theo tính năng

- `ai-panel.js`: giao diện khung/panel dùng để trình bày tính năng gợi ý và phân tích.
- `impact-summary.js`: tính toán, giải thích và lưu báo cáo tác động tình nguyện.
- `shift-predictor.js`: ước tính ca có nguy cơ thiếu tình nguyện viên bằng quy tắc trên dữ liệu hiện có.
- `site-chat.js`: giao diện chatbot; gửi câu hỏi tới endpoint backend `/api/chat`.
- `volunteer-achievements.js`: tính và hiển thị huy hiệu/thành tựu tình nguyện viên.
- `volunteer-matcher.js`: chấm điểm mức độ phù hợp giữa tình nguyện viên, kỹ năng và hoạt động/ca.
- AI-1, AI-2, AI-3 chạy bằng thuật toán/heuristic trong ứng dụng; không cần Gemini key.
- AI-4 mới gọi mô hình Gemini ở backend; chỉ tính năng này cần `GEMINI_API_KEY`.

### `src/assets/` — dữ liệu và hình ảnh nguồn

#### `src/assets/data/`

- `opportunities.json`: dữ liệu mẫu hoạt động tình nguyện.
- `organizations.json`: dữ liệu mẫu tổ chức xã hội.
- `registrations.json`: dữ liệu mẫu đăng ký tham gia ca.
- `shifts.json`: dữ liệu mẫu ca tình nguyện.
- `skills.json`: danh mục kỹ năng.
- `volunteers.json`: dữ liệu mẫu tình nguyện viên.
- Các JSON này là dữ liệu seed để khởi tạo ứng dụng; chúng không phải cấu hình API key.

#### `src/assets/images/`

- `volunteer-login-bg.svg`: hình nền SVG dùng ở giao diện đăng nhập.

## `server/` — máy chủ Node.js

- `server.js`
  - Phục vụ file tĩnh trong `dist/` và API chatbot.
  - `GET /api/health`: báo trạng thái cấu hình chatbot Gemini.
  - `POST /api/chat`: nhận câu hỏi từ giao diện và gọi Google Gemini nếu có `GEMINI_API_KEY`.
  - Đọc `.env` tại thư mục gốc nếu file đó tồn tại.
- MockAPI của tình nguyện viên/hoạt động được gọi trực tiếp từ trình duyệt trong `src/js/services.js`; đó là kết nối khác với API chatbot ở server.

## `tests/` — kiểm thử tự động

- `page-structure.test.js`
  - Kiểm tra Minh có 10 trang và Thành có 11 trang.
  - Kiểm tra mỗi trang nguồn có đủ HTML, CSS và JavaScript.
  - Kiểm tra stylesheet từng trang không import CSS chung.
- `render-safety.test.js`
  - Kiểm tra các hàm hiển thị và mã hóa dữ liệu động, đường dẫn trang và URL dữ liệu.
  - Giúp phát hiện lỗi hồi quy ở các tiện ích dùng chung.
- Chạy toàn bộ bằng `npm test` hoặc `npm.cmd test` trên Windows.

## `docs/` — tài liệu dự án

- `ai-usage-report.md`: mô tả bốn tính năng AI, cách hoạt động và cách kiểm chứng.
- `BTL_24_volunteerlink_ghep_tinh_nguyen_vien_voi_hoat_ong_cong_ong.md`: đề cương và mô tả bài tập lớn.
- `rubric-readiness.md`: đối chiếu hiện trạng với rubric, minh chứng đã có và việc còn cần làm.
- `screen-list.md`: danh mục 21 màn hình, vai trò và nghiệp vụ.
- `team-assignment.md`: phân công trang và module giữa hai thành viên.
- `VolunteerLink-Tai-Lieu-Gioi-Thieu-He-Thong.html`: tài liệu giới thiệu hệ thống ở định dạng HTML.
- `VolunteerLink-Tai-Lieu-Gioi-Thieu-He-Thong.pdf`: bản PDF của tài liệu giới thiệu hệ thống.
- `_review_rubric.pdf`: tài liệu barem/rubric tham khảo để đối chiếu yêu cầu.
- `project-structure.md`: tài liệu hiện tại, giải thích cây thư mục và vai trò file.

## `dist/` — bản build

- Được tạo lại bằng `npm run build`; không chỉnh sửa thủ công.
- `index.html`: lối vào bản build; tự chuyển hướng tới trang chủ trong `pages/index/`.
- `pages/`: 21 trang đã xuất ra, mỗi trang có `index.html`, `style.css`, `script.js`.
- `js/`: bản sao JavaScript dùng chung và các module từ `src/js/`.
- `assets/data/`, `assets/images/`: bản sao tài sản từ `src/assets/`.
- Máy chủ `server/server.js` đọc nội dung từ thư mục này khi phục vụ website.
- Khi sửa nguồn, chạy build để cập nhật `dist/`.

## Những phần dễ nhầm

- MockAPI/Fake API: URL công khai được khai báo trong `src/js/services.js`, hiện dùng cho dữ liệu `volunteers` và `opportunities`; không cần API key theo cấu hình hiện tại.
- Gemini API key: bí mật tùy chọn dành riêng cho chatbot Gemini. Nếu chưa cấu hình, các trang và Fake API vẫn chạy, nhưng chatbot Gemini không trả lời bằng mô hình thật.
- `.env.example`: file mẫu; `.env`: file cấu hình bí mật trên máy cá nhân, Git bỏ qua.
- `src/`: nơi sửa mã nguồn. `dist/`: đầu ra build. `node_modules/`: thư viện cài bằng npm. Ba thư mục này có mục đích khác nhau.
