# Báo cáo sử dụng AI (AI Usage Report) - VolunteerLink

> BTL-24 · Học phần Phát triển ứng dụng web cơ bản (CSE122)  
> Nhóm sinh viên: Trần Văn Minh & Nguyễn Bá Thành

---

## 1. Công cụ AI đã sử dụng
- **Trợ lý lập trình AI:** Hỗ trợ sinh khung mã nguồn HTML semantic, cấu trúc CSS biến, dữ liệu mẫu JSON và tài liệu phân tích.
- **Trải nghiệm AI trong sản phẩm:** Mô phỏng dựa trên luật suy diễn phía frontend (Rule-based heuristics & Scored algorithms) kết hợp luồng trạng thái chuẩn UX/UI:
  - `Nhập liệu` → `Đang xử lý (Loading/Spinner)` → `Kết quả` → `Vì sao có kết quả này? (Explain)` → `Người dùng kiểm soát (Chấp nhận / Sửa / Từ chối / Tạo lại)` → `Xử lý lỗi / Fallback`.

---

## 2. Chi tiết 3 tính năng AI trong sản phẩm

### AI-1: Volunteer Matcher
- **Màn hình:** `volunteer-opportunity-search.html` & `coordinator-matching-board.html`
- **Cơ chế hoạt động:**
  - So khớp tập kỹ năng (`skills`) của tình nguyện viên với yêu cầu của hoạt động.
  - So khớp lịch rảnh (`availability`: Thứ 2, Thứ 4, ...) với ngày diễn ra ca (`shifts.date`).
  - Ưu tiên tình nguyện viên có kinh nghiệm (`totalHours`).
  - Trả về danh sách được chấm điểm theo độ phù hợp cùng lý do chi tiết.
- **Trạng thái khi thất bại:** Khi không tìm thấy ứng viên phù hợp hoặc chưa có đủ dữ liệu, hệ thống đưa ra cảnh báo "Không đủ dữ liệu đề xuất" và nút "Làm thủ công".

### AI-2: Shift Shortage Predictor
- **Màn hình:** `organization-shift-management.html`
- **Cơ chế hoạt động:**
  - Tính toán tỷ lệ lấp đầy ca (`currentVolunteers / requiredVolunteers`).
  - Đánh giá khoảng cách thời gian còn lại đến ngày hoạt động.
  - Phân loại mức độ cảnh báo: `🔴 Khẩn cấp` (tỷ lệ < 30% hoặc còn dưới 3 ngày), `🟡 Cần chú ý` (tỷ lệ < 60%), `🟢 Bình thường`.
- **Trạng thái khi thất bại:** Khi tất cả ca đã đủ người hoặc không có ca mở, hiển thị thông báo rõ ràng.

### AI-3: Impact Summary
- **Màn hình:** `coordinator-impact-summary.html`
- **Cơ chế hoạt động:**
  - Tổng hợp số giờ tình nguyện tích lũy, số lượng người tham gia thực tế và tỷ lệ hoàn thành ca trực.
  - Tự động sinh văn bản tóm tắt tác động xã hội với số liệu cụ thể.
  - Người dùng có toàn quyền chỉnh sửa đoạn văn bản sinh ra trước khi lưu vào hệ thống.

---

## 3. Quá trình kiểm chứng và học tập của sinh viên
- **Phần AI hỗ trợ:** Khởi tạo cấu trúc dự án mẫu, dữ liệu giả lập 6 thực thể.
- **Phần sinh viên kiểm thử & hoàn thiện:**
  - Kiểm tra và tinh chỉnh giao diện responsive trên di động (sidebar ẩn/hiện, bảng chuyển thành thẻ).
  - Viết logic kiểm tra hợp lệ biểu mẫu (form validation) chuẩn xác.
  - Xây dựng cơ chế điều hướng thống nhất giữa các trang HTML tập trung trong `dist/`.
  - Đảm bảo mã nguồn đơn giản, dễ đọc hiểu, tách biệt rõ ràng HTML, CSS, JS để phục vụ báo cáo bảo vệ BTL.
