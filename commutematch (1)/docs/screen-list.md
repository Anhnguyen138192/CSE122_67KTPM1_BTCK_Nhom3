# BẢNG KIỂM KÊ MÀN HÌNH ĐẦY ĐỦ (SCREEN INVENTORY)
## Dự án: CommuteMatch – Ghép chuyến đi chung cho cộng đồng (BTL-06)
**Học phần:** Phát triển ứng dụng Web cơ bản – CSE122  
**Quy mô:** 42 màn hình giao diện thực tế hoàn chỉnh

---

| STT | Vai trò | Mục tiêu người dùng | Nhiệm vụ người dùng | Tên màn hình | Tên tệp HTML | Thao tác CRUD / Trạng thái | Tính năng AI | Người phụ trách |
|:---:|:---|:---|:---|:---|:---|:---|:---:|:---:|
| 1 | Dùng chung | Khám phá nền tảng | Tìm hiểu mô hình & xem thống kê | Trang chủ (Landing Page) | `index.html` | R (Đang tải, Bình thường) | — | SV1 |
| 2 | Dùng chung | Tìm hiểu an toàn | Đọc cẩm nang ứng xử & liên hệ khẩn cấp | Cẩm nang an toàn & Quy tắc | `safety-guidelines.html` | R (Bình thường) | — | SV1 |
| 3 | Dùng chung | Tìm hiểu sứ mệnh | Đọc giá trị cốt lõi, giảm thải CO2 | Giới thiệu dự án & Sứ mệnh | `about.html` | R (Bình thường) | — | SV1 |
| 4 | Dùng chung | Đăng nhập hệ thống | Xác thực tài khoản & Chọn nhanh Role demo | Đăng nhập hệ thống | `login.html` | R/U (Form validate, Sai pass, Thành công) | — | SV1 |
| 5 | Dùng chung | Gia nhập cộng đồng | Đăng ký thành viên, gửi thẻ SV/nhân viên | Đăng ký tài khoản | `register.html` | C (Validate, Đang gửi, Thành công) | — | SV2 |
| 6 | Dùng chung | Khôi phục tài khoản | Gửi OTP & Đặt lại mật khẩu mới | Quên mật khẩu | `forgot-password.html` | U (Gửi mã, Sai OTP, Thành công) | — | SV1 |
| 7 | Dùng chung | Xem chính sách | Đọc điều khoản chia sẻ chi phí xăng xe | Điều khoản & Quyền riêng tư | `terms-and-privacy.html` | R (Bình thường) | — | SV3 |
| 8 | Tài khoản | Xem uy tín cá nhân | Xem Trust Score, sao đánh giá & huy hiệu | Hồ sơ cá nhân | `profile-overview.html` | R (Đang tải, Bình thường) | — | SV1 |
| 9 | Tài khoản | Cập nhật hồ sơ | Sửa bio, số điện thoại, tải tài liệu KYC | Chỉnh sửa hồ sơ & KYC | `profile-edit.html` | U (Validate, Đang lưu, Thành công) | — | SV1 |
| 10 | Tài khoản | Quản lý xe | Thêm xe máy/ô tô, biển số, bảo hiểm | Quản lý phương tiện cá nhân | `profile-vehicles.html` | C/R/U/D (Danh sách, Rỗng, Modal) | — | SV2 |
| 11 | Tài khoản | Nhận thông báo | Xem thông báo chuyến đi & hệ thống | Trung tâm thông báo | `notifications-center.html` | R/U/D (Có thông báo, Đã đọc hết, Rỗng) | — | SV3 |
| 12 | Tài khoản | Trao đổi thông tin | Nhắn tin trước chuyến với bạn đồng hành | Tin nhắn trao đổi chuyến đi | `messages-chat.html` | C/R (Gửi tin nhắn, Nhận tin, Trống) | — | SV2 |
| 13 | Hành khách | Theo dõi tổng quan | Xem chuyến đi sắp tới, CO2 giảm, tiền tiết kiệm | Bảng điều khiển hành khách | `rider-dashboard.html` | R (Bình thường, Chưa có chuyến nào) | — | SV1 |
| 14 | Hành khách | Tìm chuyến xe | Nhập điểm đi/đến, thời gian, lọc nâng cao | Tìm kiếm chuyến đi nâng cao | `rider-trip-search.html` | R (Form tìm kiếm, Lỗi hợp lệ) | — | SV1 |
| 15 | Hành khách | Xem kết quả tìm kiếm | So sánh các chuyến đi, xem giải thích AI | Kết quả ghép chuyến & AI Match | `rider-match-results.html` | C/R (Đang xử lý AI, Danh sách, Rỗng) | AI-1 (Trip Matching) | SV1 |
| 16 | Hành khách | Xem chi tiết chuyến | Xem lộ trình, thông tin xe & đánh giá tài xế | Chi tiết chuyến đi | `rider-trip-detail.html` | R (Đang tải, Bình thường, Hết chỗ) | — | SV1 |
| 17 | Hành khách | Xác nhận đặt chỗ | Chọn điểm đón, ghi chú và gửi yêu cầu | Đặt chỗ & Cam kết chia sẻ | `rider-booking-confirm.html` | C (Đang gửi, Thành công, Lỗi trùng) | AI-2 (Meeting Point) | SV1 |
| 18 | Hành khách | Quản lý các chuyến đi | Theo dõi các tab Chờ duyệt / Sắp đi / Lịch sử | Chuyến đi của tôi | `rider-my-trips.html` | R/U/D (4 trạng thái tab, Hủy vé) | — | SV1 |
| 19 | Hành khách | Theo dõi thời gian thực | Check-in điểm đón, xem vị trí xe ước tính | Theo dõi chuyến đi trực tiếp | `rider-trip-tracking.html` | R/U (Chờ xe, Đang đi, Hoàn thành) | AI-2 (Meeting Point) | SV1 |
| 20 | Hành khách | Đánh giá tài xế | Chấm sao, chọn thẻ khen ngợi, gửi nhận xét | Đánh giá & Phản hồi chuyến đi | `rider-trip-review.html` | C (Form đánh giá, Đã gửi thành công) | — | SV1 |
| 21 | Tài xế | Theo dõi tổng quan | Xem thu nhập bù xăng xe, lịch tuần, tỷ lệ ghế | Bảng điều khiển tài xế | `driver-dashboard.html` | R (Bình thường, Biểu đồ thống kê) | — | SV2 |
| 22 | Tài xế | Tạo chuyến đi mới | Thiết lập lộ trình, giờ đi, số ghế, mức chia sẻ | Đăng tạo chuyến đi | `driver-trip-create.html` | C (Wizard nhiều bước, Lỗi validate) | AI-2 (Meeting Point) | SV2 |
| 23 | Tài xế | Thiết lập chuyến định kỳ | Đăng lịch đi làm/học cố định từ T2 - T6 | Lịch trình lặp lại hàng tuần | `driver-trip-recurring.html` | C/U (Bật/Tắt định kỳ, Đã lưu) | — | SV2 |
| 24 | Tài xế | Quản lý lịch chạy | Xem danh sách các chuyến đã đăng, hủy chuyến | Quản lý lịch trình chuyến xe | `driver-schedule.html` | R/U/D (Danh sách, Rỗng, Hủy chuyến) | — | SV2 |
| 25 | Tài xế | Quản lý khách trong xe | Xem danh sách khách đã chốt, đóng đăng ký | Chi tiết chuyến xe tài xế | `driver-trip-detail.html` | R/U (Còn chỗ, Đầy ghế, Đã đóng) | — | SV2 |
| 26 | Tài xế | Duyệt người tham gia | Duyệt hoặc từ chối các yêu cầu xin đi chung | Quản lý yêu cầu ghép chuyến | `driver-join-requests.html` | R/U (Chờ duyệt, Chấp nhận, Từ chối) | — | SV2 |
| 27 | Tài xế | Vận hành chuyến đi | Xác nhận đón từng khách, hoàn thành chuyến đi | Điều hành chuyến đi thực tế | `driver-trip-execution.html` | U (Đang đón, Khách đã lên xe, Xong) | — | SV2 |
| 28 | Tài xế | Thống kê tài chính | Xem lịch sử chia sẻ chi phí xăng, xuất báo cáo | Lịch sử chia sẻ chi phí xăng | `driver-earnings-history.html` | R (Bảng giao dịch, Lọc tháng, Rỗng) | — | SV2 |
| 29 | Điều phối | Giám sát lưu lượng | Theo dõi lưu lượng di chuyển, tỷ lệ ghép | Dashboard lưu lượng cộng đồng | `coordinator-mobility-dashboard.html` | R (Biểu đồ, Chỉ số KPI tổng hợp) | — | SV3 |
| 30 | Điều phối | Phân tích điểm nghẽn | Xem bản đồ nhiệt mật độ nhu cầu AI | Bản đồ nhiệt nhu cầu AI | `coordinator-demand-heatmap.html` | R (Tính toán AI, Heatmap, Cảnh báo) | AI-3 (Demand Heatmap)| SV3 |
| 31 | Điều phối | Quản lý trạm đón | Xem danh mục các điểm đón cộng đồng an toàn | Quản lý điểm đón an toàn | `coordinator-pickup-zone-management.html` | R/D (Danh sách điểm đón, Tạm đóng) | — | SV3 |
| 32 | Điều phối | Thêm/sửa trạm đón | Khảo sát tọa độ, ghi chú vỉa hè & đèn đường | Biên tập điểm đón an toàn | `coordinator-pickup-zone-editor.html` | C/U (Form thêm/sửa, Thành công) | — | SV3 |
| 33 | Điều phối | Tiếp nhận sự cố | Danh sách khiếu nại (bùng chuyến, tranh chấp) | Trung tâm xử lý báo cáo sự cố | `coordinator-report-center.html` | R/U (Chờ xử lý, Đang điều tra, Đóng) | — | SV3 |
| 34 | Điều phối | Hòa giải sự cố | Xem đối chất tin nhắn, lập biên bản xử lý | Chi tiết & Biên bản xử lý sự cố | `coordinator-report-detail.html` | U (Ghi chú hòa giải, Cảnh cáo tài khoản) | — | SV3 |
| 35 | Quản trị | Quản trị tổng thể | Bảng điều hành trung tâm toàn hệ thống | Bảng điều khiển quản trị viên | `admin-dashboard.html` | R (KPIs hệ thống, Tăng trưởng) | — | SV3 |
| 36 | Quản trị | Quản lý tài khoản | Danh sách người dùng, phân quyền, khóa tài khoản | Quản lý người dùng & Vai trò | `admin-user-management.html` | R/U/D (Bảng phân trang, Khóa/Mở) | — | SV3 |
| 37 | Quản trị | Thẩm định KYC | Xem và duyệt ảnh CCCD/Thẻ SV/Bằng lái xe | Chi tiết người dùng & Duyệt KYC | `admin-user-detail.html` | R/U (Chờ duyệt, Duyệt, Từ chối) | — | SV3 |
| 38 | Quản trị | Kiểm toán chuyến đi | Giám sát toàn bộ các chuyến xe trên hệ thống | Kiểm toán & Giám sát chuyến đi | `admin-trip-audit.html` | R/U (Bảng tra cứu, Hủy chuyến vi phạm) | — | SV3 |
| 39 | Quản trị | Cấu hình nền tảng | Thiết lập giá trần xăng, bán kính ghép, AI params | Cấu hình tham số nền tảng | `admin-platform-settings.html` | R/U (Form thiết lập, Lưu thành công) | — | SV3 |
| 40 | Quản trị | Nhật ký hệ thống | Theo dõi vết kiểm toán bảo mật và hành động | Nhật ký hệ thống & Audit Trail | `admin-system-logs.html` | R (Bảng log thời gian thực, Lọc loại log)| — | SV3 |
| 41 | Hệ thống | Báo lỗi truy cập | Báo lỗi 403 khi tài khoản không đủ quyền | Lỗi 403 - Quyền truy cập bị từ chối | `403.html` | R (Nút điều hướng về trang hợp lệ) | — | SV3 |
| 42 | Hệ thống | Báo lỗi đường dẫn | Báo lỗi 404 khi đường dẫn không tồn tại | Lỗi 404 - Không tìm thấy trang | `404.html` | R (Nút quay lại trang chủ) | — | SV3 |
