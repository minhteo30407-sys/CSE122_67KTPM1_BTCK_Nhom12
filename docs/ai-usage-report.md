# Báo cáo sử dụng AI (AI Usage Report) - VolunteerLink

> BTL-24 · Học phần Phát triển ứng dụng web cơ bản (CSE122)  
> Nhóm sinh viên: Trần Văn Minh & Nguyễn Bá Thành

---

## 1. Công cụ AI đã sử dụng
- Trợ lý lập trình AI: Hỗ trợ sinh khung mã nguồn HTML semantic, cấu trúc CSS biến, dữ liệu mẫu JSON và tài liệu phân tích.
- AI-1 đến AI-3: Mô phỏng dựa trên luật suy diễn và thuật toán chấm điểm chạy ở frontend (rule-based heuristics & scored algorithms).
- AI-4 Chatbot: Dùng Google Gemini qua backend Node.js; API key được giữ trong `.env` phía máy chủ, không nhúng vào frontend.
- Trải nghiệm AI trong sản phẩm: Ba công cụ phân tích dùng luồng trạng thái:
  - `Nhập liệu` → `Đang xử lý (Loading/Spinner)` → `Kết quả` → `Vì sao có kết quả này? (Explain)` → `Người dùng kiểm soát (Chấp nhận / Sửa / Từ chối / Tạo lại)` → `Xử lý lỗi / Fallback`.

---

## 2. Chi tiết 4 tính năng AI trong sản phẩm

### AI-1: Volunteer Matcher
- Màn hình: `volunteer-opportunity-search.html` & `coordinator-matching-board.html`
- Cơ chế hoạt động:
  - So khớp tập kỹ năng (`skills`) của tình nguyện viên với yêu cầu của hoạt động.
  - So khớp lịch rảnh (`availability`: Thứ 2, Thứ 4, ...) với ngày diễn ra ca (`shifts.date`).
  - Ưu tiên tình nguyện viên có kinh nghiệm (`totalHours`).
  - Trả về danh sách được chấm điểm theo độ phù hợp cùng lý do chi tiết.
- Trạng thái khi thất bại: Khi không tìm thấy ứng viên phù hợp hoặc chưa có đủ dữ liệu, hệ thống đưa ra cảnh báo "Không đủ dữ liệu đề xuất" và nút "Làm thủ công".

### AI-2: Shift Shortage Predictor
- Màn hình: `organization-shift-management.html`
- Cơ chế hoạt động:
  - Tính toán tỷ lệ lấp đầy ca (`currentVolunteers / requiredVolunteers`).
  - Đánh giá khoảng cách thời gian còn lại đến ngày hoạt động.
  - Phân loại mức độ cảnh báo: `🔴 Khẩn cấp` (tỷ lệ < 30% hoặc còn dưới 3 ngày), `🟡 Cần chú ý` (tỷ lệ < 60%), `🟢 Bình thường`.
- Trạng thái khi thất bại: Khi tất cả ca đã đủ người hoặc không có ca mở, hiển thị thông báo rõ ràng.

### AI-3: Impact Summary
- Màn hình: `coordinator-impact-summary.html`
- Cơ chế hoạt động:
  - Tổng hợp số giờ tình nguyện tích lũy, số lượng người tham gia thực tế và tỷ lệ hoàn thành ca trực.
  - Tự động sinh văn bản tóm tắt tác động xã hội với số liệu cụ thể.
  - Người dùng có toàn quyền chỉnh sửa đoạn văn bản sinh ra trước khi lưu vào hệ thống.

### AI-4: Chatbot hỏi đáp VolunteerLink
- Màn hình: Widget dùng chung ở góc dưới bên phải các trang trong `dist/pages/`.
- Cơ chế hoạt động: Gửi câu hỏi và tối đa 8 tin nhắn gần nhất từ trình duyệt đến endpoint `/api/chat`. Backend `server/server.js` gọi Google Gemini với hướng dẫn chỉ trả lời về website; không gửi hồ sơ hoặc dữ liệu tài khoản.
- Bảo vệ cấu hình: API key được đọc từ `GEMINI_API_KEY` trong `.env` ở backend; tệp `.env` được Git bỏ qua. Hội thoại chỉ lưu trong bộ nhớ tab, không ghi vào LocalStorage hay cơ sở dữ liệu.
- Trạng thái khi thất bại: Widget hiển thị thông báo riêng khi chưa cấu hình key, mất kết nối hoặc API hết hạn mức. Cần chạy `npm start` và cấu hình `.env`; Live Server không khởi chạy API chatbot.

## 3. Đầu ra, giải thích, quyền kiểm soát và lưu

- AI-1 Volunteer Matcher: Hiển thị danh sách xếp hạng và giải thích tiêu chí; người dùng có thể chấp nhận, sửa/đặt lại, từ chối hoặc tạo lại. Chấp nhận đề xuất sẽ lưu hoạt động yêu thích hoặc đăng ký ghép ca tương ứng.
- AI-2 Shift Shortage Predictor: Hiển thị mức độ thiếu hụt cùng lý do; chấp nhận sẽ lưu các cảnh báo đã xem trong LocalStorage để nhóm điều phối theo dõi.
- AI-3 Impact Summary: Hiển thị chỉ số, giải thích và đoạn tóm tắt có thể chỉnh sửa; chấp nhận sẽ lưu bản đã sửa cùng số liệu vào LocalStorage và có thể xuất báo cáo CSV.
- AI-4 Chatbot: Hiển thị câu trả lời hội thoại. Không có dữ liệu website thời gian thực trong prompt; chatbot được hướng dẫn không bịa lịch, số lượng chỗ hoặc thông tin hoạt động.

---

## 4. Quá trình kiểm chứng và học tập của sinh viên
- Phần AI hỗ trợ: Khởi tạo cấu trúc dự án mẫu, dữ liệu giả lập 6 thực thể.
- Phần sinh viên kiểm thử & hoàn thiện:
  - Kiểm tra và tinh chỉnh giao diện responsive trên di động (sidebar ẩn/hiện, bảng chuyển thành thẻ).
  - Viết logic kiểm tra hợp lệ biểu mẫu (form validation) chuẩn xác.
  - Xây dựng cơ chế điều hướng thống nhất giữa các trang HTML tập trung trong `dist/`.
  - Đảm bảo mã nguồn đơn giản, dễ đọc hiểu, tách biệt rõ ràng HTML, CSS, JS để phục vụ báo cáo bảo vệ BTL.
