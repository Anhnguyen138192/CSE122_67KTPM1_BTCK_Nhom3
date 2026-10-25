# Công việc cần làm – Sinh viên 3 (SV3)

Dự án CommuteMatch – CSE122

Tài liệu này liệt kê các phần giao diện và chức năng code SV3 cần phụ trách. Các trang HTML hiện nằm ở thư mục gốc của dự án; không di chuyển chúng vào thư mục `SV3` để tránh làm hỏng đường dẫn CSS, JavaScript và liên kết giữa các trang.

## 1. Phân hệ Điều phối viên

### `coordinator-mobility-dashboard.html`
- Dựng dashboard tổng quan lưu lượng di chuyển.
- Hiển thị các chỉ số/KPI và biểu đồ hoạt động ghép chuyến.
- Bổ sung trạng thái không có dữ liệu nếu phù hợp với dữ liệu demo.

### `coordinator-demand-heatmap.html`
- Hiển thị nhu cầu di chuyển theo khu vực và khung giờ bằng heatmap.
- Trình bày chú giải màu, bộ lọc hoặc lựa chọn khung giờ, và cảnh báo điểm nghẽn.
- Kết nối phần mô phỏng AI-3 nếu chức năng được cung cấp trong `js/modules/ai-engine.js`.

### `coordinator-pickup-zone-management.html`
- Hiển thị danh sách các điểm đón an toàn.
- Cho phép xem thông tin điểm đón và thao tác quản lý/tạm đóng theo thiết kế.
- Cung cấp liên kết đến trang thêm hoặc sửa điểm đón.

### `coordinator-pickup-zone-editor.html`
- Tạo biểu mẫu thêm/sửa điểm đón.
- Có trường thông tin vị trí, tọa độ và ghi chú về điều kiện an toàn.
- Kiểm tra dữ liệu nhập, lưu theo cơ chế dữ liệu chung của dự án và hiển thị kết quả thao tác.

### `coordinator-report-center.html`
- Hiển thị danh sách báo cáo sự cố.
- Trình bày các trạng thái như chờ xử lý, đang điều tra và đã đóng.
- Cho phép mở trang chi tiết báo cáo.

### `coordinator-report-detail.html`
- Hiển thị nội dung và thông tin liên quan của báo cáo.
- Cho phép ghi chú hòa giải và cập nhật trạng thái xử lý theo quyền của Điều phối viên.

## 2. Phân hệ Admin

### `admin-dashboard.html`
- Hiển thị bảng điều hành tổng quan toàn hệ thống.
- Trình bày các chỉ số quản trị và hoạt động gần đây.

### `admin-user-management.html`
- Hiển thị danh sách tài khoản; hỗ trợ tìm kiếm/lọc nếu có trong thiết kế.
- Thể hiện vai trò và trạng thái tài khoản.
- Thực hiện các thao tác quản lý tài khoản theo quy tắc phân quyền hiện có.

### `admin-user-detail.html`
- Hiển thị hồ sơ chi tiết và thông tin/tài liệu KYC cần thẩm định.
- Cho phép cập nhật kết quả duyệt hoặc từ chối và thể hiện trạng thái sau thao tác.

### `admin-trip-audit.html`
- Hiển thị danh sách chuyến đi để tra cứu, lọc và kiểm toán.
- Trình bày thông tin cần thiết để nhận biết chuyến đi có vấn đề.
- Thực hiện thao tác xử lý chuyến vi phạm theo thiết kế và quyền hiện có.

### `admin-platform-settings.html`
- Dựng biểu mẫu xem/cập nhật tham số nền tảng, ví dụ giá trần chia sẻ chi phí và bán kính ghép chuyến.
- Kiểm tra dữ liệu đầu vào và thông báo khi lưu thành công hoặc có lỗi.

### `admin-system-logs.html`
- Hiển thị nhật ký hệ thống/audit trail theo thời gian.
- Hỗ trợ lọc loại log nếu có trong thiết kế.

## 3. Màn hình dùng chung được giao

### `terms-and-privacy.html`
- Trình bày điều khoản sử dụng và quyền riêng tư theo bố cục dễ đọc.

### `notifications-center.html`
- Hiển thị danh sách thông báo và trạng thái đã đọc/chưa đọc.
- Xử lý thao tác đọc thông báo và trạng thái danh sách trống nếu được hỗ trợ.

### `403.html` và `404.html`
- Hiển thị thông báo lỗi phù hợp.
- Cung cấp nút/liên kết để quay lại trang hợp lệ hoặc trang chủ.

## 4. Global Navigation – điều hướng dùng chung

SV3 phụ trách tích hợp và kiểm tra khung điều hướng được sử dụng xuyên suốt các trang:

- Header và/hoặc sidebar chứa các liên kết đến khu vực chính của ứng dụng.
- Hiển thị liên kết phù hợp với vai trò hiện tại; không làm mất logic phân quyền đã có.
- Role Switcher phục vụ chuyển vai trò khi demo/kiểm thử, nếu dự án đang bật chức năng này.
- Đánh dấu mục/trang hiện tại để người dùng biết mình đang ở đâu.
- Kiểm tra logo, liên kết, nút menu và điều hướng giữa các trang không bị sai đường dẫn.
- Trên điện thoại, menu phải mở/đóng được và các mục điều hướng phải thao tác được.

## 5. Responsive QA

Kiểm tra các trang thuộc phạm vi SV3 ở kích thước desktop, tablet và điện thoại:

- Không tràn ngang, chồng lấp hoặc cắt mất nội dung.
- Bảng dữ liệu, biểu đồ, heatmap, biểu mẫu và nút vẫn đọc được, sử dụng được.
- Menu điều hướng phù hợp với màn hình nhỏ.
- Nội dung dài, thông báo, trạng thái rỗng và hộp thoại hiển thị hợp lý.
- Sửa lỗi responsive trong phạm vi các trang SV3 phụ trách; tránh thay đổi ngoài phạm vi nếu không cần thiết.

## 6. Các file dùng chung có thể cần phối hợp

- `js/main.js` – khởi tạo giao diện, header và Role Switcher.
- `js/storage.js` – lưu/đọc dữ liệu demo nếu màn hình cần thao tác dữ liệu.
- `js/modules/auth.js` – kiểm tra phiên đăng nhập và quyền vai trò.
- `js/modules/ai-engine.js` – chức năng AI-3 cho heatmap, nếu đã được triển khai.
- `css/components.css` – thành phần giao diện dùng chung.
- `css/responsive.css` – breakpoint và bố cục responsive.

Phối hợp với thành viên đang sở hữu các file dùng chung trước khi chỉnh sửa để tránh ghi đè thay đổi của nhau.

## 7. Checklist bàn giao

- [ ] Hoàn thiện 6 màn hình Điều phối viên.
- [ ] Hoàn thiện 6 màn hình Admin.
- [ ] Hoàn thiện 4 màn hình dùng chung/trang lỗi.
- [ ] Kiểm tra điều hướng và hiển thị theo vai trò.
- [ ] Kiểm tra các luồng thao tác chính và thông báo lỗi/thành công.
- [ ] Kiểm thử responsive trên desktop, tablet và điện thoại.
- [ ] Kiểm tra liên kết, CSS và JavaScript trên tất cả màn hình SV3 phụ trách.
- [ ] Tích hợp với phần còn lại của nhóm và chuẩn bị nội dung trình diễn.

## 8. Cần thống nhất số lượng màn hình

Danh sách trong README hiện ghi SV3 phụ trách **15 màn hình**, nhưng danh sách chi tiết gồm **16 file**: 6 Điều phối viên, 6 Admin và 4 màn hình dùng chung/trang lỗi. Hãy xác nhận với nhóm/giảng viên màn hình nào không tính vào chỉ tiêu 15 trước khi chốt phân công.
