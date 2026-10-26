# VolunteerLink 🤝

> **BTL-24** · Học phần Phát triển ứng dụng web cơ bản (CSE122)  
> **Nhóm:** Trần Văn Minh · Nguyễn Bá Thành

## Giới thiệu

**VolunteerLink** là một ứng dụng web nguyên mẫu ghép tình nguyện viên với các ca hoạt động cộng đồng. Giao diện chạy trên trình duyệt; máy chủ Node.js phục vụ ứng dụng và cung cấp API chatbot. Sản phẩm giải quyết 4 vấn đề:

1. **P1** - Thông tin hoạt động phân tán
2. **P2** - Khó ghép đúng kỹ năng
3. **P3** - Điều phối ca thủ công
4. **P4** - Khó ghi nhận đóng góp

Đối chiếu hiện trạng và các minh chứng còn cần bổ sung theo rubric tại [docs/rubric-readiness.md](./docs/rubric-readiness.md).

## 4 Vai trò

| Vai trò             | Trách nhiệm chính              |
| ------------------- | ------------------------------ |
| 🟢 Tình nguyện viên | Xây hồ sơ và đăng ký ca        |
| 🔵 Tổ chức xã hội   | Tạo hoạt động và ca            |
| 🟡 Điều phối viên   | Matching và theo dõi thiếu hụt |
| 🔴 Quản trị viên    | Taxonomy và kiểm duyệt         |

## 4 Tính năng AI

| AI   | Tên                      | Mô tả                                                      |
| ---- | ------------------------ | ---------------------------------------------------------- |
| AI-1 | Volunteer Matcher        | Ghép kỹ năng và lịch rảnh                                  |
| AI-2 | Shift Shortage Predictor | Cảnh báo ca thiếu người                                    |
| AI-3 | Impact Summary           | Tổng hợp đóng góp và tác động sau hoạt động                |
| AI-4 | Chatbot VolunteerLink    | Trả lời câu hỏi về cách sử dụng website bằng Google Gemini |

AI-1 đến AI-3 hiện là thuật toán/heuristic chạy trên dữ liệu ứng dụng, không phải mô hình AI sinh nội dung. AI-4 gọi Google Gemini qua backend.

## Công nghệ

- **HTML** semantic (header, aside, main, form, section...)
- **CSS** thuần (Flexbox, Grid, biến CSS) - không dùng Bootstrap
- **JavaScript** (DOM, sự kiện, LocalStorage); **Node.js** `http` phục vụ ứng dụng và API chatbot
- **JSON** + **LocalStorage** cho dữ liệu giả lập

## Cấu trúc thư mục

Giải thích chi tiết từng thư mục và các file con trong [docs/project-structure.md](./docs/project-structure.md).

```
BTL/
├── README.md
├── package.json              ← Lệnh start và test
├── .gitignore                 ← Quy tắc loại trừ tệp khỏi Git
├── .env.example              ← Mẫu cấu hình Gemini key tùy chọn cho chatbot
├── node_modules/              ← Thư viện cài đặt, Git bỏ qua
├── src/                       ← Mã nguồn chính
│   ├── build.js               ← Đóng gói mã nguồn vào dist/
│   ├── js/                    ← JavaScript và modules dùng chung
│   ├── assets/                ← Dữ liệu JSON, hình ảnh
│   └── pages/
│       ├── tran_van_minh/     ← Các trang Trần Văn Minh phụ trách
│       │   └── <ten-trang>/
│       │       ├── index.html
│       │       ├── style.css
│       │       └── script.js
│       └── nguyen_ba_thanh/  ← Các trang Nguyễn Bá Thành phụ trách
│           └── <ten-trang>/
│               ├── index.html
│               ├── style.css
│               └── script.js
├── server/
│   └── server.js              ← Máy chủ tĩnh và API chatbot Gemini
├── tests/                     ← Kiểm thử Node.js
├── docs/                      ← Đề bài, rubric, kiểm kê và tài liệu
└── dist/                      ← Bản build để chạy/deploy
    ├── index.html             ← Lối vào, tự chuyển đến trang chủ
    ├── pages/                 ← Trang build ra, giữ URL theo tên chức năng
    │   └── <ten-trang>/
    │       ├── index.html     ← Giao diện của trang
    │       ├── style.css      ← Kiểu riêng của trang
    │       └── script.js      ← Xử lý riêng của trang
    ├── js/                    ← JavaScript dùng chung đã build
    └── assets/                ← Dữ liệu JSON và hình ảnh đã build
```

### Tìm và chỉnh sửa một trang

Mỗi trang có bản nguồn riêng trong thư mục của người phụ trách và gồm ba file. Ví dụ trang kiểm duyệt của Minh:

- `src/pages/tran_van_minh/admin-moderation/index.html` — cấu trúc HTML.
- `src/pages/tran_van_minh/admin-moderation/style.css` — toàn bộ kiểu giao diện riêng của trang.
- `src/pages/tran_van_minh/admin-moderation/script.js` — JavaScript riêng của trang.

Trang của Thành nằm trong `src/pages/nguyen_ba_thanh/`. Mỗi trang có `style.css` riêng, chứa kiểu giao diện và responsive của chính trang; không nạp stylesheet CSS dùng chung. JavaScript và dữ liệu cần dùng chung vẫn nằm trong `src/js/` và `src/assets/`. Không chỉnh trực tiếp bản build trong `dist/`. Chạy `npm run build` để cập nhật `dist/`; bước build xuất các trang về URL hiện có mà không đưa tên người phụ trách vào đường dẫn.

## Phân công

Nhóm gồm hai thành viên: Trần Văn Minh phụ trách 10 trang trong `src/pages/tran_van_minh/`, Nguyễn Bá Thành phụ trách 11 trang trong `src/pages/nguyen_ba_thanh/`. Xem [docs/team-assignment.md](./docs/team-assignment.md) và [docs/screen-list.md](./docs/screen-list.md) để biết chi tiết.

### Trần Văn Minh

- **Vai trò:** Điều phối viên + Quản trị viên
- **Trang:** 10 trang (coordinator-_, admin-_, login, register, forgot-password)
- **AI:** AI-1 Volunteer Matcher, AI-3 Impact Summary
- **Trách nhiệm chéo:** Hệ thống thiết kế, điều hướng, responsive

### Nguyễn Bá Thành

- **Vai trò:** Tình nguyện viên + Tổ chức xã hội
- **Trang:** 11 trang (volunteer-_, organization-_, index, notifications, 403, 404)
- **AI:** AI-2 Shift Shortage Predictor + Panel AI dùng chung
- **Trách nhiệm chéo:** JavaScript, dữ liệu, tích hợp, QA

## Cách chạy

1. Cài Node.js phiên bản 18 trở lên.
2. Mở terminal tại thư mục dự án và chạy `npm start` (hoặc `npm.cmd start` trên Windows). Nếu vừa sửa mã nguồn, chạy `npm run build` trước.
3. Mở `http://localhost:3000`. Máy chủ trong `server/server.js` phục vụ các trang trong `dist/` và API chatbot.

> **Lưu ý:** Không mở trang bằng `file://` hoặc Live Server nếu muốn dùng chatbot; các cách đó không khởi chạy API backend. Chạy qua `npm start` để tải JSON và gọi chatbot. `http://localhost` hỗ trợ Web Crypto trong các trình duyệt hiện đại.

Chạy kiểm thử bằng `npm test` (trên Windows có thể dùng `npm.cmd test`).

## Triển khai bằng Render

- Repo có cấu hình Render Blueprint trong `render.yaml`.
- Kết nối repo GitHub với Render và tạo Web Service bằng Blueprint này. Render sẽ build `dist/`, chạy Node.js server và kiểm tra `/api/health`.
- Thêm `GEMINI_API_KEY` trong phần Environment của Render nếu muốn chatbot gọi Gemini. Không đưa key vào Git hoặc `render.yaml`.
- Dự án hiện chưa được triển khai; cần kết nối repo với tài khoản Render để tạo URL công khai.

Trang `dist/index.html` là trang chủ công khai. Liên kết “Trang chủ” luôn quay về trang này; sau khi đăng nhập, trang chào người dùng và hiển thị lối tắt phù hợp với vai trò thay vì đưa người dùng về màn hình đăng nhập.

## Chatbot AI

Chatbot VolunteerLink dùng Google Gemini để trả lời câu hỏi về cách sử dụng website. Chatbot xuất hiện ở góc dưới bên phải các trang, không cần đăng nhập. API key chỉ được đọc ở backend từ tệp `.env`, không đưa vào JavaScript frontend hay chia sẻ công khai.

1. Tạo API key trong [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sao chép `.env.example` thành `.env` ở thư mục gốc dự án rồi điền key vào `GEMINI_API_KEY`.
3. Chạy lại `npm start` và mở `http://localhost:3000`.

Không gửi API key lên GitHub hoặc cho người khác. Nếu chưa cấu hình key, website vẫn mở được nhưng chatbot sẽ báo cần cấu hình. Nội dung hội thoại chỉ được giữ trong bộ nhớ của tab đang mở và gửi tới Gemini để tạo câu trả lời; dự án không lưu lịch sử chat.

## Tài khoản test

Đăng ký tài khoản tình nguyện viên hoặc tổ chức bằng email và mật khẩu của bạn, sau đó dùng đúng thông tin đó để đăng nhập. Vai trò được lấy từ tài khoản đã đăng ký; email và mật khẩu tùy ý không thể tạo phiên đăng nhập. Vai trò điều phối viên/quản trị viên không thể tự chọn từ form đăng ký công khai.

Tài khoản tình nguyện viên mẫu đã đăng ký sẵn:

- **Email:** `an.nguyen@email.com`
- **Mật khẩu:** `VolunteerLink@2026`

Các trang chức năng yêu cầu đăng nhập và đúng vai trò; chưa đăng nhập sẽ được chuyển về trang đăng nhập. Đây chỉ là kiểm tra phía trình duyệt cho bản nguyên mẫu dùng LocalStorage, không thay thế xác thực và phân quyền ở máy chủ khi triển khai thực tế.
Mật khẩu được dẫn xuất bằng PBKDF2 và lưu cùng muối trong LocalStorage; hãy chạy qua `http://localhost` hoặc HTTPS để trình duyệt hỗ trợ Web Crypto. Tài khoản mới bắt đầu với 0 giờ, 0 ca hoàn thành, 0 huy hiệu và 0% điểm tin cậy. Huy hiệu được trao theo số ca/giờ đã hoàn thành, còn điểm tin cậy tính từ ca hoàn thành so với các ca đã hủy.

- **Tân binh nhiệt huyết:** hoàn thành ít nhất 1 ca
- **Chung tay vì cộng đồng:** tích lũy ít nhất 10 giờ
- **Người bạn đồng hành:** hoàn thành ít nhất 5 ca
- **Chiến binh cộng đồng:** tích lũy ít nhất 40 giờ
  Các mốc tiếp theo: **Người đồng hành bền bỉ** (10 ca), **Ươm mầm yêu thương** (100 giờ), **Trái tim tình nguyện** (20 ca) và **Sứ giả cộng đồng** (200 giờ).
  Trang hồ sơ và trang Thành tựu hiển thị toàn bộ tám mốc, trạng thái đã đạt/chưa đạt và tiến độ còn lại. Số giờ và số ca chỉ tính từ đăng ký đã được ghi nhận hoàn thành.
  Menu tình nguyện viên có trang **Thành tựu** riêng để xem tổng quan giờ/ca, thành tựu đã chinh phục và mục tiêu tiếp theo.
  Khôi phục mật khẩu qua email chưa hoạt động vì nguyên mẫu chưa có máy chủ gửi thư.

## Fake API

Website kết nối MockAPI tại `https://6ada264a7512f497b3ffad0b.mockapi.io/api/v1` cho hai thực thể:

- `volunteers`: đọc và đồng bộ hồ sơ tình nguyện viên.
- `opportunities`: đọc và đồng bộ hoạt động tình nguyện.

Trong cả hai thực thể, hãy thêm trường văn bản `localId`. Ứng dụng dùng trường này để giữ nguyên mã định danh như `V001` và `OPP001` cho các ca, lượt đăng ký liên quan, trong khi MockAPI vẫn tạo `id` riêng. Các trường còn lại phải khớp với cấu trúc trong `src/assets/data/volunteers.json` và `src/assets/data/opportunities.json`; trường danh sách như `skills`, `availability` và `requiredSkills` cần chấp nhận dữ liệu JSON/mảng. Vì đây là API công khai, chỉ dùng dữ liệu thử nghiệm; không nhập thông tin cá nhân thật.

Khi mỗi collection còn trống, ứng dụng chỉ đưa dữ liệu mẫu trong `dist/assets/data/*.json` lên MockAPI; không tự tải hồ sơ tài khoản cũ từ LocalStorage. Khi collection đã có dữ liệu, MockAPI là nguồn dữ liệu cho thực thể đó. Thao tác thêm, sửa và xóa tình nguyện viên/hoạt động được đồng bộ lên API; tài khoản đã tồn tại cục bộ nhưng chưa có trên API vẫn được giữ riêng trong LocalStorage. Lỗi đồng bộ thao tác được hiển thị trong website; nếu MockAPI không truy cập được khi khởi tạo, ứng dụng tiếp tục bằng dữ liệu cục bộ. Các thực thể `organizations`, `shifts`, `registrations` và `skills`, cùng thông tin đăng nhập, vẫn dùng LocalStorage/dữ liệu JSON. Mật khẩu và giá trị băm mật khẩu không được gửi lên MockAPI.

`FakeAPI.request(method, path, body)` vẫn cung cấp các endpoint giả lập cục bộ cho đăng ký/đăng nhập và hồ sơ tình nguyện viên; các endpoint hiện có là `POST /auth/register`, `POST /auth/login`, `GET`/`PATCH /volunteers/:id/profile` và `GET /volunteers/:id/registrations`. MockAPI là dịch vụ mock công khai, không thay thế backend thật hoặc hệ thống xác thực an toàn.

## Công cụ tình nguyện viên

- Trang **Tìm hoạt động** cho phép lưu/bỏ lưu hoạt động yêu thích và lọc để chỉ xem các hoạt động đã lưu. Danh sách yêu thích được lưu riêng theo tài khoản trong LocalStorage của trình duyệt.
- Có thể chấp nhận gợi ý từ Volunteer Matcher để lưu các hoạt động được đề xuất vào danh sách yêu thích.
- Trang **Ca của tôi** có lịch xem theo tháng hoặc tuần, điều hướng kỳ trước/kỳ tiếp theo và nút trở về hôm nay. Lịch hiển thị giờ bắt đầu, tên hoạt động và trạng thái đăng ký; ca đã hủy không hiển thị trong lịch.

## Dữ liệu

Dữ liệu mẫu nguồn nằm trong `src/assets/data/*.json` và được build sang `dist/assets/`. Các thực thể chưa kết nối MockAPI được copy vào LocalStorage; `volunteers` và `opportunities` được tải từ MockAPI và giữ một bản cache trong LocalStorage. Mọi thao tác CRUD trên các thực thể cục bộ lưu trong LocalStorage.

### Luồng đăng ký và cập nhật ca

- Khi tình nguyện viên đăng ký, lượt đăng ký ở trạng thái chờ duyệt sẽ giữ một chỗ; hệ thống không cho đăng ký trùng hoặc vượt sức chứa ca.
- Tổ chức duyệt đơn không làm tăng số chỗ lần nữa. Từ chối hoặc hủy đơn sẽ trả chỗ để người khác đăng ký.
- Chỉ khi tổ chức ghi nhận ca hoàn thành, số giờ theo thời lượng ca mới được cộng vào hồ sơ tình nguyện viên và báo cáo tác động.
- Các màn hình liên quan tự cập nhật sau thay đổi dữ liệu trong cùng tab hoặc tab khác. Danh sách người dùng, đăng ký và báo cáo có thể tải xuống dạng CSV.

Để xóa cache LocalStorage và tải lại dữ liệu: mở Console trình duyệt → gõ `DataStore.reset()`. Lệnh này không xóa dữ liệu đã lưu trên MockAPI.

## Bảng màu

| Màu         | Mã        | Dùng cho                     |
| ----------- | --------- | ---------------------------- |
| 🟢 Xanh lá  | `#2E7D5B` | Nút chính, sidebar, liên kết |
| 🟠 Cam      | `#F59E0B` | Nút nhấn, cảnh báo           |
| 🟣 Tím      | `#7C3AED` | Panel AI, badge AI           |
| ⬜ Trắng    | `#FFFFFF` | Card, bảng, form             |
| 🔘 Xám nhạt | `#F7F9F8` | Nền trang                    |
