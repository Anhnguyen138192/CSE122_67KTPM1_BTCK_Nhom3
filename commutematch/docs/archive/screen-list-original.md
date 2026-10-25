# BẢNG KIỂM KÊ MÀN HÌNH ĐẦY ĐỦ (SCREEN INVENTORY)
## Dự án: CommuteMatch – Ghép chuyến đi chung cho cộng đồng (BTL-06)
**Học phần:** Phát triển ứng dụng Web cơ bản – CSE122
**Quy mô:** 48 trang HTML trong dự án

---

| STT | Vai trò | Mục tiêu người dùng | Nhiệm vụ người dùng | Tên màn hình | Tên tệp HTML | Thao tác CRUD / Trạng thái | Tính năng AI | Người phụ trách |
|:---:|:---|:---|:---|:---|:---|:---|:---:|:---:|
| 1 | Dùng chung | Khám phá nền tảng | Tìm hiểu mô hình & xem thống kê | Trang chủ (Landing Page) | `index.html` | R (Đang tải, Bình thường) | — | SV1 |
| 2 | Dùng chung | Tìm hiểu an toàn | Đọc cẩm nang ứng xử & liên hệ khẩn cấp | Cẩm nang an toàn & Quy tắc | `safety-guidelines.html` | R (Bình thường) | — | SV1 |
| 3 | Dùng chung | Tìm hiểu sứ mệnh | Đọc giá trị cốt lõi, giảm thải CO2 | Giới thiệu dự án & Sứ mệnh | `about.html` | R (Bình thường) | — | SV1 |
| 4 | Dùng chung | Đăng nhập hệ thống | Xác thực tài khoản | Đăng nhập hệ thống | `login.html` | R/U (Form validate, Sai pass, Thành công) | — | SV1 |
| 5 | Dùng chung | Gia nhập cộng đồng | Đăng ký thành viên, gửi thẻ SV/nhân viên | Đăng ký tài khoản | `register.html` | C (Validate, Đang gửi, Thành công) | — | SV2 |
| 6 | Dùng chung | Khôi phục tài khoản | Gửi OTP & Đặt lại mật khẩu mới | Quên mật khẩu | `forgot-password.html` | U (Gửi mã, Sai OTP, Thành công) | — | SV1 |
| 7 | Dùng chung | Xem chính sách | Đọc điều khoản chia sẻ chi phí xăng xe | Điều khoản & Quyền riêng tư | `terms-and-privacy.html` | R (Bình thường) | — | SV3 |
| 8 | Tài khoản | Xem hồ sơ cá nhân | Xem thông tin và đánh giá đã lưu | Hồ sơ cá nhân | `profile-overview.html` | R (Dữ liệu đã lưu, Rỗng) | — | SV1 |
| 9 | Tài khoản | Cập nhật hồ sơ | Sửa bio, số điện thoại, tải tài liệu KYC | Chỉnh sửa hồ sơ & KYC | `profile-edit.html` | U (Validate, Đang lưu, Thành công) | — | SV1 |
| 10 | Tài khoản | Quản lý xe | Khai báo ô tô từ 7 chỗ tổng cộng, biển số, bảo hiểm | Quản lý ô tô chia sẻ | `profile-vehicles.html` | C/R/U/D (Danh sách, Rỗng, Modal) | — | SV2 |
| 11 | Tài khoản | Nhận thông báo | Xem thông báo chuyến đi & hệ thống | Trung tâm thông báo | `notifications-center.html` | R/U/D (Có thông báo, Đã đọc hết, Rỗng) | — | SV3 |
| 12 | Tài khoản | Trao đổi thông tin | Chọn người liên quan đến chuyến / yêu cầu ghép để nhắn tin | Tin nhắn trao đổi chuyến đi | `messages-chat.html` | C/R (Gửi tin nhắn, Nhận tin, Trống) | — | SV2 |
| 13 | Hành khách | Theo dõi tổng quan | Xem các chuyến và yêu cầu đã lưu | Bảng điều khiển hành khách | `rider-dashboard.html` | R (Dữ liệu đã lưu, Chưa có chuyến nào) | — | SV1 |
| 14 | Hành khách | Tìm chuyến xe | Nhập điểm đi/đến, thời gian, lọc nâng cao | Tìm kiếm chuyến đi nâng cao | `rider-trip-search.html` | R (Form tìm kiếm, Lỗi hợp lệ) | — | SV1 |
| 15 | Hành khách | Xem kết quả tìm kiếm | So sánh chuyến theo mức độ phù hợp tuyến và thời gian | Kết quả ghép chuyến | `rider-match-results.html` | C/R (Đang tính, Danh sách, Rỗng) | Heuristic ghép chuyến | SV1 |
| 16 | Hành khách | Xem chi tiết chuyến | Xem lộ trình, điểm dừng, chỗ trống và thông tin tài xế | Chi tiết chuyến đi | `rider-trip-detail.html` | R (Đang tải, Bình thường, Hết chỗ) | — | SV1 |
| 17 | Hành khách | Xác nhận đặt chỗ | Chọn điểm đón trong tuyến đã được điều phối, ghi chú và gửi yêu cầu | Đặt chỗ & Cam kết chia sẻ | `rider-booking-confirm.html` | C (Đang gửi, Thành công, Lỗi trùng) | — | SV1 |
| 18 | Hành khách | Quản lý các chuyến đi | Theo dõi các tab Chờ duyệt / Sắp đi / Lịch sử | Chuyến đi của tôi | `rider-my-trips.html` | R/U/D (4 trạng thái tab, Hủy vé) | — | SV1 |
| 19 | Hành khách | Theo dõi chuyến đi | Xem trạng thái chuyến và điểm đón đã thống nhất | Theo dõi chuyến đi | `rider-trip-tracking.html` | R/U (Chờ xe, Đang đi, Hoàn thành) | — | SV1 |
| 20 | Hành khách | Đánh giá tài xế | Chấm sao, chọn thẻ khen ngợi, gửi nhận xét | Đánh giá & Phản hồi chuyến đi | `rider-trip-review.html` | C (Form đánh giá, Đã gửi thành công) | — | SV1 |
| 21 | Tài xế | Theo dõi tổng quan | Xem lịch chuyến được phân công và dữ liệu hoạt động | Bảng điều khiển tài xế | `driver-dashboard.html` | R (Dữ liệu đã lưu, Rỗng) | — | SV2 |
| 22 | Tài xế | Xem quy trình tạo chuyến | Đọc hướng dẫn tạo chuyến qua điều phối viên | Quy trình điều phối | `driver-trip-create.html` | R (Hướng dẫn, Điều hướng) | — | SV2 |
| 23 | Tài xế | Xem quy trình chuyến định kỳ | Đọc hướng dẫn gửi nhu cầu lịch định kỳ cho điều phối viên | Lịch trình lặp lại hàng tuần | `driver-trip-recurring.html` | R (Hướng dẫn, Điều hướng) | — | SV2 |
| 24 | Tài xế | Xem lịch được giao | Xem các chuyến được điều phối viên phân công | Lịch trình chuyến xe | `driver-schedule.html` | R/U (Danh sách, Rỗng, Cập nhật trạng thái) | — | SV2 |
| 25 | Tài xế | Quản lý khách trong xe | Xem danh sách khách đã chốt, đóng đăng ký | Chi tiết chuyến xe tài xế | `driver-trip-detail.html` | R/U (Còn chỗ, Đầy ghế, Đã đóng) | — | SV2 |
| 26 | Tài xế | Duyệt người tham gia | Duyệt hoặc từ chối các yêu cầu xin đi chung | Quản lý yêu cầu ghép chuyến | `driver-join-requests.html` | R/U (Chờ duyệt, Chấp nhận, Từ chối) | — | SV2 |
| 27 | Tài xế | Vận hành chuyến đi | Xác nhận đón từng khách, hoàn thành chuyến đi | Điều hành chuyến đi thực tế | `driver-trip-execution.html` | U (Đang đón, Khách đã lên xe, Xong) | — | SV2 |
| 28 | Tài xế | Thống kê tài chính | Xem lịch sử chia sẻ chi phí đã ghi nhận | Lịch sử chia sẻ chi phí | `driver-earnings-history.html` | R (Bảng giao dịch, Rỗng) | — | SV2 |
| 29 | Điều phối | Giám sát lưu lượng | Theo dõi lưu lượng di chuyển, tỷ lệ ghép | Dashboard lưu lượng cộng đồng | `coordinator-mobility-dashboard.html` | R (Biểu đồ, Chỉ số KPI tổng hợp) | — | SV3 |
| 30 | Điều phối | Phân tích nhu cầu | Xem nhu cầu từ yêu cầu ghép và chỗ còn trống | Bản đồ nhu cầu | `coordinator-demand-heatmap.html` | R (Tính toán từ dữ liệu, Rỗng) | — | SV3 |
| 31 | Điều phối | Quản lý trạm đón | Xem danh mục các điểm đón cộng đồng an toàn | Quản lý điểm đón an toàn | `coordinator-pickup-zone-management.html` | R/D (Danh sách điểm đón, Tạm đóng) | — | SV3 |
| 32 | Điều phối | Thêm/sửa trạm đón | Khảo sát tọa độ, ghi chú vỉa hè & đèn đường | Biên tập điểm đón an toàn | `coordinator-pickup-zone-editor.html` | C/U (Form thêm/sửa, Thành công) | — | SV3 |
| 33 | Điều phối | Tiếp nhận sự cố | Danh sách khiếu nại (bùng chuyến, tranh chấp) | Trung tâm xử lý báo cáo sự cố | `coordinator-report-center.html` | R/U (Chờ xử lý, Đang điều tra, Đóng) | — | SV3 |
| 34 | Điều phối | Hòa giải sự cố | Xem báo cáo sự cố và ghi nhận xử lý | Chi tiết & Biên bản xử lý sự cố | `coordinator-report-detail.html` | U (Ghi chú hòa giải, Cảnh cáo tài khoản) | — | SV3 |
| 35 | Điều phối | Lập và phân công chuyến | Thiết lập tuyến, điểm dừng, trạm đón và tài xế | Quản lý chuyến xe điều phối | `coordinator-trip-management.html` | C/R/U (Tạo chuyến, Phân công tài xế, Danh sách) | — | SV3 |
| 36 | Quản trị | Quản trị tổng thể | Bảng điều hành trung tâm toàn hệ thống | Bảng điều khiển quản trị viên | `admin-dashboard.html` | R (Dữ liệu đã lưu, Rỗng) | — | SV3 |
| 37 | Quản trị | Quản lý tài khoản | Danh sách người dùng, phân quyền, khóa tài khoản | Quản lý người dùng & Vai trò | `admin-user-management.html` | R/U/D (Bảng phân trang, Khóa/Mở) | — | SV3 |
| 38 | Quản trị | Thẩm định KYC | Xem và duyệt tài liệu người dùng đã gửi | Chi tiết người dùng & Duyệt KYC | `admin-user-detail.html` | R/U (Chờ duyệt, Duyệt, Từ chối) | — | SV3 |
| 39 | Quản trị | Kiểm toán chuyến đi | Giám sát các chuyến có trong hệ thống | Kiểm toán & Giám sát chuyến đi | `admin-trip-audit.html` | R/U (Bảng tra cứu, Hủy chuyến vi phạm) | — | SV3 |
| 40 | Quản trị | Cấu hình nền tảng | Cấu hình các tham số hệ thống | Cấu hình tham số nền tảng | `admin-platform-settings.html` | R/U (Form thiết lập, Lưu thành công) | — | SV3 |
| 41 | Quản trị | Nhật ký hệ thống | Theo dõi và tải xuống nhật ký đã ghi nhận | Nhật ký hệ thống & Audit Trail | `admin-system-logs.html` | R (Bảng log, Tải CSV) | — | SV3 |
| 42 | Hệ thống | Báo lỗi truy cập | Báo lỗi 403 khi tài khoản không đủ quyền | Lỗi 403 - Quyền truy cập bị từ chối | `403.html` | R (Nút điều hướng về trang hợp lệ) | — | SV3 |
| 43 | Hệ thống | Báo lỗi đường dẫn | Báo lỗi 404 khi đường dẫn không tồn tại | Lỗi 404 - Không tìm thấy trang | `404.html` | R (Nút quay lại trang chủ) | — | SV3 |
| 44 | Tài khoản | Ứng tuyển vai trò | Gửi và xem trạng thái đơn tài xế / điều phối viên | Ứng tuyển vai trò | `role-applications.html` | C/R (Gửi đơn, Trạng thái đơn) | — | SV2 |
| 45 | Quản trị | Duyệt ứng tuyển | Duyệt hoặc từ chối đơn xin vai trò | Duyệt đơn ứng tuyển | `admin-role-applications.html` | R/U (Chờ duyệt, Duyệt, Từ chối) | — | SV3 |
| 46 | Quản trị | Xác thực Super Admin | Xác thực lại trước khi truy cập quyền Super Admin | Xác thực Super Admin | `superadmin-auth.html` | U (Xác thực, Từ chối, Điều hướng) | — | SV3 |
| 47 | Hệ thống | Tương thích đường dẫn hồ sơ | Chuyển hướng đường dẫn hồ sơ cũ đến trang hồ sơ hiện tại | Chuyển hướng hồ sơ | `profile.html` | R (Chuyển hướng) | — | SV3 |
| 48 | Hệ thống | Tương thích đường dẫn thông báo | Chuyển hướng đường dẫn thông báo cũ đến trung tâm thông báo | Chuyển hướng thông báo | `notifications.html` | R (Chuyển hướng) | — | SV3 |
