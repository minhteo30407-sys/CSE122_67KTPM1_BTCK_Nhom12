# Đối chiếu mức độ sẵn sàng theo rubric

Đánh giá này phân biệt những gì có thể xác nhận trong mã/tài liệu hiện tại với minh chứng cần có khi nộp và bảo vệ. Trạng thái “Một phần” không đồng nghĩa đã đạt điểm tối đa; chưa có đủ kiểm thử thủ công và minh chứng để tự chấm điểm chính xác.

## Tiêu chí 1: Tư duy sản phẩm và UI/UX

- Hiện trạng: Có bối cảnh, vấn đề, hành trình tổng quát, danh mục 21 màn hình và link Figma.
- Minh chứng thiết kế cho tiêu chí UI/UX: [Bản Figma BTL_Volunteerlink](https://www.figma.com/design/HuP4KEqctSwA49iLHnBQV6/BTL_Volunteerlink?node-id=5-2030&t=JJLerCAi8yzLaugf-1). Nội dung này cũng được ghi ở mục 18 “Figma / Canva” trong tài liệu đề cương dự án.
- Còn thiếu: Trạng thái duyệt của giảng viên hiện chưa rõ; chưa có bằng chứng luồng người dùng, wireframe/mockup và trạng thái thiết kế đã khớp với mã nguồn.
- Việc cần làm: Đối chiếu từng luồng của 4 vai trò với màn hình trong inventory và bản Figma; xin xác nhận của giảng viên và lưu phản hồi.

## Tiêu chí 2: Vai trò, nghiệp vụ và CRUD

- Hiện trạng: Có 4 vai trò; tài liệu mô tả luồng đăng ký, duyệt/từ chối, quản lý hoạt động/ca, hồ sơ và báo cáo. Có JSON, LocalStorage và một số thực thể nối MockAPI.
- Còn thiếu: Chưa có báo cáo kiểm thử end-to-end từng vai trò, CRUD và trạng thái Normal/Loading/Empty/Error.
- Lưu ý: Đây là nguyên mẫu. Nhiều dữ liệu và quyền truy cập nằm ở trình duyệt, không thay thế backend xác thực/phân quyền thật.

## Tiêu chí 3: Thẩm mỹ, responsive và accessibility

- Hiện trạng: 21 trang có stylesheet độc lập với quy tắc responsive riêng; dùng CSS Grid/Flexbox và có một số quy tắc focus. Rà soát HTML tĩnh phát hiện 23 ô tìm kiếm/bộ lọc thiếu tên truy cập; đã bổ sung `aria-label` cho các ô này trên 9 trang.
- Còn thiếu: Chưa kiểm tra toàn bộ màn hình ở viewport 320px, tablet và zoom 200%; chưa có checklist kiểm tra accessibility đầy đủ.
- Việc cần làm: Rà soát thủ công alt, label, thứ tự focus, focus-visible và độ tương phản.

## Tiêu chí 4: HTML5 và kiến trúc CSS/Bootstrap

- Hiện trạng: Dự án dùng HTML ngữ nghĩa, CSS thuần, biến `:root`, Grid và Flexbox.
- Còn thiếu: Không thấy Bootstrap được sử dụng.
- Việc cần làm: Nếu giảng viên yêu cầu Bootstrap, cần bổ sung có chủ đích; nếu không, chuẩn bị giải thích vì sao hệ thống CSS thuần phù hợp và nhất quán hơn. Kiểm tra ngữ nghĩa/accessibility trên các màn hình quan trọng.

## Tiêu chí 5: JavaScript, form, dữ liệu/API và an toàn

- Hiện trạng: Có thao tác tìm kiếm/lọc, kiểm tra biểu mẫu, JSON, LocalStorage, MockAPI và các luồng CRUD. Đã thêm escape dữ liệu động ở các bề mặt đã rà soát cùng 9 kiểm thử, gồm kiểm tra cấu trúc và CSS độc lập của các trang.
- Còn thiếu: Unit test hiện có không thay thế kiểm thử toàn bộ form, CRUD, API lỗi/mất mạng, XSS trên mọi màn hình hoặc E2E.
- Việc cần làm: Chạy các kịch bản nghiệp vụ và kiểm tra trạng thái lỗi/rỗng/đang tải trên trình duyệt.

## Tiêu chí 6: Trải nghiệm AI

- Hiện trạng: Có 4 tính năng: AI-1 matching, AI-2 dự báo thiếu người, AI-3 tóm tắt tác động và AI-4 chatbot Gemini. AI-1 đến AI-3 là thuật toán/heuristic phía frontend; kết quả được giải thích và các thao tác chấp nhận/lưu được hỗ trợ. Fake API MockAPI đã được cấu hình trong `src/js/services.js` cho tình nguyện viên và hoạt động; tính năng này không cần Gemini API key.
- Còn thiếu: Chatbot Gemini chưa thể trả lời bằng mô hình thật cho đến khi nhóm tự cấu hình `GEMINI_API_KEY` trong `.env` và kiểm thử thực tế. Đây là cấu hình riêng cho chatbot, không phải Fake API mà đề bài yêu cầu.
- Việc cần làm: Trình bày trung thực AI-1–AI-3 là heuristic, không phải LLM. Chuẩn bị demo đủ Input → Processing → Output → Explainability → Control → Save cho ít nhất 3 tính năng; lưu ý hội thoại AI-4 hiện không có bước lưu.

## Tiêu chí 7: Công việc, Git và triển khai

- Hiện trạng: Nhánh `main` có lịch sử commit; tài liệu phân công 2 người; nhóm đã có bảng [Trello công việc](https://trello.com/b/6aa76d8cbf36c881dce53f29/).
- Còn thiếu: Hiện chỉ xác nhận được nhánh `main`; chưa cấu hình Git remote để kết nối GitHub/Render; chưa có minh chứng nhánh `dev`/`feature/*`, task hoàn thành trên Trello, PR/review hoặc URL deploy. Worktree có nhiều thay đổi chưa commit.
- Việc cần làm: Dùng board Trello để chia task theo người và theo dõi tiến độ; thống nhất nhánh/PR với nhóm. Rà soát thay đổi hiện có trước khi commit; không commit `.env`/API key.

## Tiêu chí 8: Video OBS và bảo vệ

- Hiện trạng: Tài liệu nêu yêu cầu OBS và live modification.
- Còn thiếu: Chưa có video hoặc liên kết minh chứng trong dự án.
- Việc cần làm: Đối chiếu số video cuối cùng với số màn hình độc lập đã được duyệt, bảo đảm có webcam, giải thích HTML/CSS/JS, chạy tương tác và sửa mã trực tiếp. Mỗi thành viên cần làm chủ và trình bày phần việc của mình.

## Việc nên ưu tiên

1. Đã thêm link Figma vào tài liệu đề cương và rubric-readiness. Còn cần đối chiếu các luồng/màn hình với giảng viên và lưu bằng chứng phê duyệt.
2. Đã xác nhận nhóm chính thức có 2 người và đồng bộ README, phân công, đề cương theo hai thành viên.
3. Đã có bảng [Trello công việc](https://trello.com/b/6aa76d8cbf36c881dce53f29/); dùng bảng để chia/kiểm tra task của Minh và Thành, thống nhất nhánh và review. Repo có lịch sử trên `main` nhưng chưa có minh chứng PR; rà soát worktree trước khi tạo commit.
4. Kiểm thử các luồng E2E theo vai trò và CRUD; ghi lại kết quả cho trạng thái rỗng/lỗi/đang tải, responsive 320px/tablet/zoom 200% và accessibility.
5. Fake API MockAPI đã được cấu hình và không cần API key. Chỉ khi muốn bật chatbot Gemini thật mới cần tạo Google Gemini API key, thêm vào `.env` cục bộ hoặc Environment của dịch vụ; không gửi key qua chat hay commit lên Git.
6. Đã thêm cấu hình Render trong `render.yaml`. Dịch vụ triển khai là nơi đưa website lên Internet để có URL công khai. Để tiếp tục, kết nối kho GitHub với Render và tạo Web Service bằng Blueprint. Không cần Gemini API key để triển khai Fake API; chỉ cấu hình key trong Environment của dịch vụ nếu muốn bật chatbot Gemini. Sau khi triển khai, xác minh URL từ trình duyệt sạch.
7. Quay OBS theo yêu cầu và tập live modification/vấn đáp cho từng thành viên.

## Kiểm tra kỹ thuật trong lần rà soát này

- `npm.cmd run build`: tạo thành công 21 trang.
- `npm.cmd test`: 9/9 kiểm thử đạt, gồm kiểm tra cấu trúc và CSS độc lập của 21 trang.
- Kiểm tra cú pháp: 30 tệp JavaScript trong `src/` đạt.
- Kiểm thử HTTP cục bộ: trang chủ, API health, 21/21 trang và 48 tài nguyên CSS/JavaScript/hình ảnh nội bộ trả về thành công.
- Rà soát HTML tĩnh trên 21 trang: không phát hiện thiếu `lang`, tiêu đề, tiêu đề cấp một hoặc thuộc tính `alt`; các ô tìm kiếm/bộ lọc thiếu nhãn đã được bổ sung `aria-label`.
- Chưa kiểm thử thủ công end-to-end trên toàn bộ trang; chưa có tệp `.env`/Gemini API key để xác nhận chatbot Gemini thật, chưa deploy và chưa có video OBS.
