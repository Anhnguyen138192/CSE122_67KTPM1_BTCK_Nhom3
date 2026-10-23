# PHÂN CÔNG NHIỆM VỤ NHÓM 3 SINH VIÊN
## Đề tài: CommuteMatch – Ghép chuyến đi chung cho cộng đồng (CSE122)

---

## 1. NGUYÊN TẮC LÁT CẮT DỌC (VERTICAL SLICE)
Mỗi sinh viên chịu trách nhiệm trọn vẹn từ đầu đến cuối một luồng nghiệp vụ chuyên sâu:
`Bản mô phỏng Figma → HTML Semantic → CSS Components → JavaScript DOM & Storage → Trải nghiệm AI → Responsive → Nhánh Git & Pull Request → Video OBS`.

Không có tình trạng một người chỉ làm giao diện, một người chỉ viết báo cáo hay một người chỉ viết JavaScript.

---

## 2. PHÂN CÔNG CHI TIẾT THEO VAI TRÒ & MÀN HÌNH

### Sinh viên 1 (SV1) – Phụ trách chính: PHÂN HỆ HÀNH KHÁCH & AUTH CƠ BẢN
* **Trách nhiệm vai trò:**
  - Toàn bộ luồng nghiệp vụ của **Hành khách (Rider)**: Tìm kiếm chuyến, so sánh điểm số tương thích AI-1, xem chi tiết, đặt chỗ, quản lý chuyến đi của tôi, theo dõi chuyến và đánh giá tài xế.
  - Các màn hình công khai & tài khoản cơ bản: Landing page (`index.html`), Giới thiệu (`about.html`), Cẩm nang an toàn (`safety-guidelines.html`), Đăng nhập (`login.html`), Quên mật khẩu (`forgot-password.html`), Hồ sơ cá nhân (`profile-overview.html`), Chỉnh sửa hồ sơ KYC (`profile-edit.html`).
* **Trách nhiệm xuyên suốt (Cross-cutting):**
  - **Hệ thống Thiết kế UI (Design Tokens & Base CSS):** Quản lý bảng màu chuẩn (Emerald/Teal), typography, button styles, form controls, responsive grid, và chế độ Dark/Light mode.
* **Danh sách màn hình phụ trách (15 màn hình):**
  - `index.html`, `about.html`, `safety-guidelines.html`, `login.html`, `forgot-password.html`
  - `profile-overview.html`, `profile-edit.html`
  - `rider-dashboard.html`, `rider-trip-search.html`, `rider-match-results.html` (AI-1)
  - `rider-trip-detail.html`, `rider-booking-confirm.html`, `rider-my-trips.html`
  - `rider-trip-tracking.html` (AI-2), `rider-trip-review.html`

---

### Sinh viên 2 (SV2) – Phụ trách chính: PHÂN HỆ NGƯỜI CHIA SẺ XE & GIAO TIẾP
* **Trách nhiệm vai trò:**
  - Toàn bộ luồng nghiệp vụ của **Người chia sẻ xe (Driver)**: Đăng tạo chuyến đi (Form wizard + AI-2 gợi ý điểm đón), đăng lịch định kỳ, quản lý lịch chạy, xem danh sách hành khách, duyệt/từ chối yêu cầu ghép xe, vận hành chuyến đi thực tế, xem lịch sử chia sẻ chi phí xăng.
  - Các màn hình đăng ký thành viên (`register.html`), quản lý xe cá nhân (`profile-vehicles.html`), khung chat tin nhắn nội bộ (`messages-chat.html`).
* **Trách nhiệm xuyên suốt (Cross-cutting):**
  - **Tầng Dữ liệu Giả lập (Mock Data Engine & LocalStorage CRUD):** Thiết kế kiến trúc `storage.js`, dữ liệu ban đầu `mock-data.js`, validate biểu mẫu đa bước (Wizard validation), và quản lý đồng bộ trạng thái giữa các trang.
* **Danh sách màn hình phụ trách (12 màn hình):**
  - `register.html`, `profile-vehicles.html`, `messages-chat.html`
  - `driver-dashboard.html`, `driver-trip-create.html` (AI-2), `driver-trip-recurring.html`
  - `driver-schedule.html`, `driver-trip-detail.html`, `driver-join-requests.html`
  - `driver-trip-execution.html`, `driver-earnings-history.html`

---

### Sinh viên 3 (SV3) – Phụ trách chính: ĐIỀU PHỐI VIÊN, QUẢN TRỊ VIÊN & HỆ THỐNG
* **Trách nhiệm vai trò:**
  - Toàn bộ luồng nghiệp vụ của **Điều phối viên (Coordinator)**: Dashboard lưu lượng, bản đồ nhiệt nhu cầu AI-3 (`coordinator-demand-heatmap.html`), quản lý danh mục điểm đón an toàn, tiếp nhận và hòa giải báo cáo vi phạm.
  - Toàn bộ luồng nghiệp vụ của **Quản trị viên (Admin)**: Bảng điều hành Admin, quản lý người dùng & duyệt KYC, kiểm toán toàn bộ chuyến xe, cấu hình tham số nền tảng (giá trần xăng, bán kính ghép), xem nhật ký hệ thống (Audit logs).
  - Màn hình thông báo (`notifications-center.html`), Điều khoản (`terms-and-privacy.html`), và các trang lỗi hệ thống (`403.html`, `404.html`).
* **Trách nhiệm xuyên suốt (Cross-cutting):**
  - **Khung Điều hướng Toàn cục (Global Navigation, Role Switcher & Build Integration):** Tích hợp Header/Sidebar điều hướng tự động theo vai trò, hộp chọn Role chuyển đổi nhanh cho giảng viên chấm bài, kiểm thử tương thích đa màn hình (Responsive QA), đóng gói và triển khai.
* **Danh sách màn hình phụ trách (15 màn hình):**
  - `terms-and-privacy.html`, `notifications-center.html`
  - `coordinator-mobility-dashboard.html`, `coordinator-demand-heatmap.html` (AI-3)
  - `coordinator-pickup-zone-management.html`, `coordinator-pickup-zone-editor.html`
  - `coordinator-report-center.html`, `coordinator-report-detail.html`
  - `admin-dashboard.html`, `admin-user-management.html`, `admin-user-detail.html`
  - `admin-trip-audit.html`, `admin-platform-settings.html`, `admin-system-logs.html`
  - `403.html`, `404.html`

---

## 3. KẾ HOẠCH VIDEO MINH CHỨNG OBS
* Mỗi sinh viên quay video độc lập cho từng màn hình mình phụ trách theo đúng quy chuẩn:
  - Có mặt sinh viên (Webcam góc màn hình).
  - Mở file mã nguồn HTML/CSS/JS tương ứng.
  - Giải thích cấu trúc semantic và logic JavaScript.
  - Thực hiện một thao tác chỉnh sửa trực tiếp (Live code demo: ví dụ đổi màu badge, thêm trường dữ liệu).
  - Thao tác tương tác trên trình duyệt và kiểm tra LocalStorage.
  - Đặt tên video theo định dạng: `SV[X]-[STT]-[ten-man-hinh].mp4`.
