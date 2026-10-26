# VolunteerLink 🤝

> **BTL-24** · Học phần Phát triển ứng dụng web cơ bản (CSE122)  
> **Nhóm:** Trần Văn Minh · Nguyễn Bá Thành

## Giới thiệu

**VolunteerLink** là một sản phẩm web frontend nguyên mẫu, ghép tình nguyện viên với các ca hoạt động cộng đồng. Sản phẩm giải quyết 4 vấn đề:

1. **P1** - Thông tin hoạt động phân tán
2. **P2** - Khó ghép đúng kỹ năng
3. **P3** - Điều phối ca thủ công
4. **P4** - Khó ghi nhận đóng góp

## 4 Vai trò

| Vai trò | Trách nhiệm chính |
|---------|-------------------|
| 🟢 Tình nguyện viên | Xây hồ sơ và đăng ký ca |
| 🔵 Tổ chức xã hội | Tạo hoạt động và ca |
| 🟡 Điều phối viên | Matching và theo dõi thiếu hụt |
| 🔴 Quản trị viên | Taxonomy và kiểm duyệt |

## 3 Tính năng AI

| AI | Tên | Mô tả |
|----|-----|-------|
| AI-1 | Volunteer Matcher | Ghép kỹ năng và lịch rảnh |
| AI-2 | Shift Shortage Predictor | Cảnh báo ca thiếu người |
| AI-3 | Impact Summary | Sinh tóm tắt đóng góp sau hoạt động |

## Công nghệ

- **HTML** semantic (header, aside, main, form, section...)
- **CSS** thuần (Flexbox, Grid, biến CSS) - không dùng Bootstrap
- **JavaScript** (DOM, sự kiện, LocalStorage)
- **JSON** + **LocalStorage** cho dữ liệu giả lập

## Cấu trúc thư mục

```
BTL/
├── README.md
├── css/
│   ├── style.css              ← Kiểu chung (biến CSS, layout, components)
│   └── responsive.css         ← Responsive cho mobile/tablet
├── js/
│   ├── main.js                ← Bố cục, điều hướng, tiện ích
│   ├── api.js                 ← Quản lý dữ liệu (CRUD + Auth)
│   └── modules/
│       ├── ai-panel.js        ← Component AI dùng chung
│       ├── volunteer-matcher.js  ← AI-1
│       ├── shift-predictor.js    ← AI-2
│       ├── impact-summary.js     ← AI-3
│       └── volunteer-achievements.js ← Thành tựu dùng chung
├── assets/
│   ├── images/
│   │   └── volunteer-login-bg.svg
│   └── data/
│       ├── volunteers.json
│       ├── organizations.json
│       ├── opportunities.json
│       ├── shifts.json
│       ├── registrations.json
│       └── skills.json
└── dist/                      ← Ứng dụng hoàn chỉnh
    ├── index.html             ← Lối vào, tự chuyển đến trang chủ
    ├── pages/                 ← Mỗi trang có thư mục riêng
    │   └── <ten-trang>/
    │       ├── index.html     ← Giao diện của trang
    │       ├── style.css      ← Nạp CSS chung; có thể thêm kiểu riêng tại đây
    │       └── script.js      ← Xử lý riêng của trang
    ├── css/                   ← CSS dùng chung
    ├── js/                    ← API, bố cục và module dùng chung
    └── assets/                ← Dữ liệu JSON và hình ảnh
```

### Tìm và chỉnh sửa một trang

Mỗi trang nằm trong `dist/pages/` và có cùng ba file. Ví dụ trang kiểm duyệt:

- `dist/pages/admin-moderation/index.html` — cấu trúc HTML.
- `dist/pages/admin-moderation/style.css` — kiểu riêng của trang; CSS chung được nạp tự động.
- `dist/pages/admin-moderation/script.js` — JavaScript riêng của trang.

Các trang vẫn dùng chung tiện ích trong `dist/js/` và giao diện nền trong `dist/css/`, tránh sao chép mã dùng chung. Để làm lại/quay một trang, mở ba file tương ứng trong đúng thư mục trang.

## Phân công

### Trần Văn Minh
- **Vai trò:** Tình nguyện viên + Điều phối viên
- **Trang:** 10 trang (volunteer-*, coordinator-*, login, register, forgot-password)
- **AI:** AI-1 Volunteer Matcher, AI-3 Impact Summary
- **Trách nhiệm chéo:** Hệ thống thiết kế, điều hướng, responsive

### Nguyễn Bá Thành
- **Vai trò:** Tổ chức xã hội + Quản trị viên
- **Trang:** 10 trang (organization-*, admin-*, index, notifications, 403, 404)
- **AI:** AI-2 Shift Shortage Predictor + Panel AI dùng chung
- **Trách nhiệm chéo:** JavaScript, dữ liệu, tích hợp, QA

## Cách chạy

1. Mở thư mục dự án bằng VS Code.
2. Khởi chạy Live Server từ `dist/index.html`; trang này tự chuyển đến `dist/pages/index/index.html`.
3. Mỗi trang và mã riêng nằm trong thư mục tương ứng dưới `dist/pages/`; CSS, JavaScript dùng chung và dữ liệu vẫn được đặt riêng trong `dist/css/`, `dist/js/` và `dist/assets/`.

> **Lưu ý:** Cần Live Server hoặc HTTPS để tải JSON và dùng Web Crypto. Mở trực tiếp bằng `file://` có thể khiến đăng nhập và dữ liệu không hoạt động.

Trang `dist/index.html` là trang chủ công khai. Liên kết “Trang chủ” luôn quay về trang này; sau khi đăng nhập, trang chào người dùng và hiển thị lối tắt phù hợp với vai trò thay vì đưa người dùng về màn hình đăng nhập.

## Tài khoản test

Đăng ký tài khoản tình nguyện viên hoặc tổ chức bằng email và mật khẩu của bạn, sau đó dùng đúng thông tin đó để đăng nhập. Vai trò được lấy từ tài khoản đã đăng ký; email và mật khẩu tùy ý không thể tạo phiên đăng nhập. Vai trò điều phối viên/quản trị viên không thể tự chọn từ form đăng ký công khai.

Tài khoản tình nguyện viên mẫu đã đăng ký sẵn:
- **Email:** `an.nguyen@email.com`
- **Mật khẩu:** `VolunteerLink@2026`

Các trang chức năng yêu cầu đăng nhập và đúng vai trò; chưa đăng nhập sẽ được chuyển về trang đăng nhập. Đây chỉ là kiểm tra phía trình duyệt cho bản nguyên mẫu dùng LocalStorage, không thay thế xác thực và phân quyền ở máy chủ khi triển khai thực tế.
Mật khẩu được dẫn xuất bằng PBKDF2 và lưu cùng muối trong LocalStorage; hãy chạy bằng HTTPS hoặc Live Server để trình duyệt hỗ trợ Web Crypto. Tài khoản mới bắt đầu với 0 giờ, 0 ca hoàn thành, 0 huy hiệu và 0% điểm tin cậy. Huy hiệu được trao theo số ca/giờ đã hoàn thành, còn điểm tin cậy tính từ ca hoàn thành so với các ca đã hủy.
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

Trong cả hai thực thể, hãy thêm trường văn bản `localId`. Ứng dụng dùng trường này để giữ nguyên mã định danh như `V001` và `OPP001` cho các ca, lượt đăng ký liên quan, trong khi MockAPI vẫn tạo `id` riêng. Các trường còn lại phải khớp với cấu trúc trong `assets/data/volunteers.json` và `assets/data/opportunities.json`; trường danh sách như `skills`, `availability` và `requiredSkills` cần chấp nhận dữ liệu JSON/mảng. Vì đây là API công khai, chỉ dùng dữ liệu thử nghiệm; không nhập thông tin cá nhân thật.

Khi mỗi collection còn trống, ứng dụng chỉ đưa dữ liệu mẫu trong `assets/data/*.json` lên MockAPI; không tự tải hồ sơ tài khoản cũ từ LocalStorage. Khi collection đã có dữ liệu, MockAPI là nguồn dữ liệu cho thực thể đó. Thao tác thêm, sửa và xóa tình nguyện viên/hoạt động được đồng bộ lên API; tài khoản đã tồn tại cục bộ nhưng chưa có trên API vẫn được giữ riêng trong LocalStorage. Nếu đồng bộ thất bại, website sẽ báo lỗi. Các thực thể `organizations`, `shifts`, `registrations` và `skills`, cùng thông tin đăng nhập, vẫn dùng LocalStorage/dữ liệu JSON. Mật khẩu và giá trị băm mật khẩu không được gửi lên MockAPI.

`FakeAPI.request(method, path, body)` vẫn cung cấp các endpoint giả lập cục bộ cho đăng ký/đăng nhập và hồ sơ tình nguyện viên; các endpoint hiện có là `POST /auth/register`, `POST /auth/login`, `GET`/`PATCH /volunteers/:id/profile` và `GET /volunteers/:id/registrations`. MockAPI là dịch vụ mock công khai, không thay thế backend thật hoặc hệ thống xác thực an toàn.

## Công cụ tình nguyện viên

- Trang **Tìm hoạt động** cho phép lưu/bỏ lưu hoạt động yêu thích và lọc để chỉ xem các hoạt động đã lưu. Danh sách yêu thích được lưu riêng theo tài khoản trong LocalStorage của trình duyệt.
- Có thể chấp nhận gợi ý từ Volunteer Matcher để lưu các hoạt động được đề xuất vào danh sách yêu thích.
- Trang **Ca của tôi** có lịch xem theo tháng hoặc tuần, điều hướng kỳ trước/kỳ tiếp theo và nút trở về hôm nay. Lịch hiển thị giờ bắt đầu, tên hoạt động và trạng thái đăng ký; ca đã hủy không hiển thị trong lịch.

## Dữ liệu

Dữ liệu mẫu nằm trong `assets/data/*.json`. Các thực thể chưa kết nối MockAPI được copy vào LocalStorage; `volunteers` và `opportunities` được tải từ MockAPI và giữ một bản cache trong LocalStorage. Mọi thao tác CRUD trên các thực thể cục bộ lưu trong LocalStorage.

### Luồng đăng ký và cập nhật ca

- Khi tình nguyện viên đăng ký, lượt đăng ký ở trạng thái chờ duyệt sẽ giữ một chỗ; hệ thống không cho đăng ký trùng hoặc vượt sức chứa ca.
- Tổ chức duyệt đơn không làm tăng số chỗ lần nữa. Từ chối hoặc hủy đơn sẽ trả chỗ để người khác đăng ký.
- Chỉ khi tổ chức ghi nhận ca hoàn thành, số giờ theo thời lượng ca mới được cộng vào hồ sơ tình nguyện viên và báo cáo tác động.
- Các màn hình liên quan tự cập nhật sau thay đổi dữ liệu trong cùng tab hoặc tab khác. Danh sách người dùng, đăng ký và báo cáo có thể tải xuống dạng CSV.

Để xóa cache LocalStorage và tải lại dữ liệu: mở Console trình duyệt → gõ `DataStore.reset()`. Lệnh này không xóa dữ liệu đã lưu trên MockAPI.

## Bảng màu

| Màu | Mã | Dùng cho |
|-----|-----|---------|
| 🟢 Xanh lá | `#2E7D5B` | Nút chính, sidebar, liên kết |
| 🟠 Cam | `#F59E0B` | Nút nhấn, cảnh báo |
| 🟣 Tím | `#7C3AED` | Panel AI, badge AI |
| ⬜ Trắng | `#FFFFFF` | Card, bảng, form |
| 🔘 Xám nhạt | `#F7F9F8` | Nền trang |
