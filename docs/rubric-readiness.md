# Đối chiếu mức độ sẵn sàng theo rubric

Đánh giá này phân biệt **những gì có thể xác nhận trong mã/tài liệu hiện tại** với **minh chứng cần có khi nộp và bảo vệ**. Trạng thái “Một phần” không đồng nghĩa đã đạt điểm tối đa; chưa có đủ kiểm thử thủ công và minh chứng để tự chấm điểm chính xác.

| Tiêu chí | Hiện trạng có thể xác nhận | Còn thiếu / cần làm trước khi nộp |
|---|---|---|
| **1. Tư duy sản phẩm & UI/UX** | Có bối cảnh, vấn đề, hành trình tổng quát và danh mục 21 màn hình trong tài liệu dự án. | Chưa thấy liên kết/bản Figma hoặc Canva, wireframe/mockup, trạng thái thiết kế và bằng chứng giảng viên duyệt trước khi code. Hoàn thiện luồng người dùng cụ thể cho từng vai trò và gắn với màn hình trong inventory. |
| **2. Vai trò, nghiệp vụ & CRUD** | Có 4 vai trò; tài liệu mô tả luồng đăng ký, duyệt/từ chối, quản lý hoạt động/ca, hồ sơ và báo cáo. Có JSON, LocalStorage và một số thực thể nối MockAPI. | Chưa có báo cáo kiểm thử end-to-end từng vai trò, CRUD và trạng thái Normal/Loading/Empty/Error. Đây là nguyên mẫu: nhiều dữ liệu và quyền truy cập nằm ở trình duyệt, không thay thế backend xác thực/phân quyền thật. |
| **3. Thẩm mỹ, responsive & accessibility** | Có design tokens, CSS Grid/Flexbox, stylesheet responsive và quy tắc focus; đã điều chỉnh tràn ngang cho trang chủ và kích thước chatbot ở màn hình nhỏ. | Chưa kiểm tra toàn bộ 21 màn hình ở viewport thật 320px, tablet và zoom 200%; môi trường trình duyệt kiểm thử đang giới hạn chiều rộng CSS nhỏ nhất ở khoảng 381px. Cần rà soát thủ công alt, label, thứ tự focus, focus-visible và độ tương phản. |
| **4. HTML5 & kiến trúc CSS/Bootstrap** | Dự án dùng HTML ngữ nghĩa, CSS thuần, biến `:root`, Grid và Flexbox. | Không thấy Bootstrap được sử dụng. Nếu giảng viên yêu cầu Bootstrap, cần bổ sung có chủ đích; nếu không, chuẩn bị giải thích vì sao hệ thống CSS thuần phù hợp và nhất quán hơn cho sản phẩm này. Kiểm tra ngữ nghĩa/accessibility trên các màn hình quan trọng. |
| **5. JavaScript, form, dữ liệu/API & an toàn** | Có thao tác tìm kiếm/lọc, kiểm tra biểu mẫu, JSON, LocalStorage, MockAPI và các luồng CRUD. Đã thêm escape dữ liệu động ở các bề mặt đã rà soát và 4 kiểm thử an toàn render. | 4 unit test không thay thế kiểm thử toàn bộ form, CRUD, API lỗi/mất mạng, XSS trên mọi màn hình hoặc E2E. Cần chạy các kịch bản nghiệp vụ và kiểm tra trạng thái lỗi/rỗng/đang tải trên trình duyệt. |
| **6. Trải nghiệm AI** | Có 4 tính năng: AI-1 matching, AI-2 dự báo thiếu người, AI-3 tóm tắt tác động và AI-4 chatbot Gemini. AI-1 đến AI-3 là thuật toán/heuristic phía frontend; kết quả được giải thích và các thao tác chấp nhận/lưu được hỗ trợ. Chatbot giữ API key ở backend, có UX khi thiếu cấu hình/lỗi và không lưu lịch sử chat. | Chatbot **chưa thể trả lời bằng Gemini** cho đến khi nhóm tự cấu hình `GEMINI_API_KEY` trong `.env` và kiểm thử thực tế. Cần trình bày trung thực AI-1–AI-3 là heuristic, không phải LLM. Chuẩn bị demo đủ Input → Processing → Output → Explainability → Control → Save cho ít nhất 3 tính năng; lưu ý hội thoại AI-4 hiện không có bước lưu. |
| **7. Công việc, Git & triển khai** | Có tài liệu phân công và hướng dẫn quy trình, nhưng đó chưa phải minh chứng hoạt động thực tế. | Git hiện chưa có commit trên `main`; chưa thấy nhánh `dev`/`feature/*`, commit Conventional Commits, PR được review hoặc URL deploy. Tạo bảng Trello/Jira thực tế, làm việc theo nhánh, commit đều đặn, mở PR/review và triển khai URL ổn định. Không đưa `.env`/API key lên Git. |
| **8. Video OBS & bảo vệ** | Tài liệu nêu yêu cầu OBS và live modification. | Chưa có video hoặc liên kết minh chứng trong dự án. Inventory hiện liệt kê 21 màn hình; đối chiếu số video cuối cùng với số màn hình độc lập đã được duyệt, bảo đảm có webcam, giải thích HTML/CSS/JS, chạy tương tác và sửa mã trực tiếp. Mỗi thành viên cần làm chủ và trình bày phần việc của mình. |

## Việc nên ưu tiên

1. Chốt bản Figma/Canva, luồng người dùng và inventory với giảng viên; thống nhất quy mô nhóm vì tài liệu giới thiệu ghi **3 sinh viên** trong khi README và bảng phân công ghi **2 thành viên**.
2. Tạo bảng công việc thực tế; bắt đầu nhánh và lịch sử Git có commit/PR/review; không commit `node_modules` hoặc `.env`.
3. Hoàn thành kiểm thử E2E theo vai trò, CRUD, lỗi/rỗng/đang tải, responsive 320px/200% và accessibility; lưu checklist/kết quả làm minh chứng.
4. Cấu hình Gemini bằng key riêng trong `.env`, kiểm thử chatbot qua backend và chuẩn bị phương án demo nếu mạng/API lỗi.
5. Deploy, xác minh URL từ trình duyệt sạch; quay OBS theo yêu cầu và tập live modification/vấn đáp cho từng thành viên.

## Kiểm tra kỹ thuật trong lần rà soát này

- `npm.cmd test`: 4/4 kiểm thử render-safety đạt.
- Kiểm tra cú pháp: 17 tệp JavaScript hiện có đạt.
- Smoke test: trang chủ trả HTTP 200; chatbot trả thông báo cấu hình rõ ràng khi chưa có key.
- Chưa có API key để xác nhận câu trả lời Gemini thực tế; chưa thay thế kiểm thử thủ công toàn bộ màn hình hoặc kiểm thử deploy.
