# BẢNG KIỂM KÊ MÀN HÌNH ĐẦY ĐỦ (SCREEN INVENTORY)
## Dự án: CommuteMatch – Ghép chuyến đi chung cho cộng đồng (BTL-06)
**Học phần:** Phát triển ứng dụng Web cơ bản – CSE122
**Quy mô:** 50 trang HTML trong dự án

---

| STT | Role | User Goal | User Task | Screen | File | CRUD | States | AI | Assignee | Task ID | Branch | OBS |
|:---:|:---|:---|:---|:---|:---|:---:|:---|:---:|:---:|:---:|:---|:---:|
| 1 | Dùng chung | Khám phá nền tảng | Tìm hiểu mô hình & xem thống kê | Trang chủ (Landing Page) | `index.html` | R | Đang tải, Bình thường | — | SV1 | CM-001 | — | — |
| 2 | Dùng chung | Tìm hiểu an toàn | Đọc cẩm nang ứng xử & liên hệ khẩn cấp | Cẩm nang an toàn & Quy tắc | `pages/common/safety-guidelines.html` | R | Bình thường | — | SV1 | CM-002 | — | — |
| 3 | Dùng chung | Tìm hiểu sứ mệnh | Đọc giá trị cốt lõi, giảm thải CO2 | Giới thiệu dự án & Sứ mệnh | `pages/common/about.html` | R | Bình thường | — | SV1 | CM-003 | — | — |
| 4 | Dùng chung | Đăng nhập hệ thống | Xác thực tài khoản | Đăng nhập hệ thống | `pages/common/login.html` | R/U | Form validate, Sai pass, Thành công | — | SV1 | CM-004 | — | — |
| 5 | Dùng chung | Gia nhập cộng đồng | Đăng ký thành viên, gửi thẻ SV/nhân viên | Đăng ký tài khoản | `pages/common/register.html` | C | Validate, Đang gửi, Thành công | — | SV2 | CM-005 | — | — |
| 6 | Dùng chung | Khôi phục tài khoản | Gửi OTP & Đặt lại mật khẩu mới | Quên mật khẩu | `pages/common/forgot-password.html` | U | Gửi mã, Sai OTP, Thành công | — | SV1 | CM-006 | — | — |
| 7 | Dùng chung | Xem chính sách | Đọc điều khoản chia sẻ chi phí xăng xe | Điều khoản & Quyền riêng tư | `pages/common/terms-and-privacy.html` | R | Bình thường | — | SV3 | CM-007 | — | — |
| 8 | Tài khoản | Xem hồ sơ cá nhân | Xem thông tin và đánh giá đã lưu | Hồ sơ cá nhân | `pages/account/profile-overview.html` | R | Dữ liệu đã lưu, Rỗng | — | SV1 | CM-008 | — | — |
| 9 | Tài khoản | Cập nhật hồ sơ | Sửa bio, số điện thoại, tải tài liệu KYC | Chỉnh sửa hồ sơ & KYC | `pages/account/profile-edit.html` | U | Validate, Đang lưu, Thành công | — | SV1 | CM-009 | — | — |
| 10 | Tài khoản | Quản lý xe | Khai báo ô tô từ 7 chỗ tổng cộng, biển số, bảo hiểm | Quản lý ô tô chia sẻ | `pages/account/profile-vehicles.html` | C/R/U/D | Danh sách, Rỗng, Modal | — | SV2 | CM-010 | — | — |
| 11 | Tài khoản | Nhận thông báo | Xem thông báo chuyến đi & hệ thống | Trung tâm thông báo | `pages/account/notifications-center.html` | R/U/D | Có thông báo, Đã đọc hết, Rỗng | — | SV3 | CM-011 | — | — |
| 12 | Tài khoản | Trao đổi thông tin | Chọn người liên quan đến chuyến / yêu cầu ghép để nhắn tin | Tin nhắn trao đổi chuyến đi | `pages/account/messages-chat.html` | C/R | Gửi tin nhắn, Nhận tin, Trống | — | SV2 | CM-012 | — | — |
| 13 | Hành khách | Theo dõi tổng quan | Xem các chuyến và yêu cầu đã lưu | Bảng điều khiển hành khách | `pages/rider/rider-dashboard.html` | R | Dữ liệu đã lưu, Chưa có chuyến nào | — | SV1 | CM-013 | — | — |
| 14 | Hành khách | Tìm chuyến xe | Nhập điểm đi/đến, thời gian, lọc nâng cao | Tìm kiếm chuyến đi nâng cao | `pages/rider/rider-trip-search.html` | R | Form tìm kiếm, Lỗi hợp lệ | — | SV1 | CM-014 | — | — |
| 15 | Hành khách | Xem kết quả tìm kiếm | So sánh chuyến theo mức độ phù hợp tuyến và thời gian | Kết quả ghép chuyến | `pages/rider/rider-match-results.html` | C/R | Đang tính, Danh sách, Rỗng | Heuristic ghép chuyến | SV1 | CM-015 | — | — |
| 16 | Hành khách | Xem chi tiết chuyến | Xem lộ trình, điểm dừng, chỗ trống và thông tin tài xế | Chi tiết chuyến đi | `pages/rider/rider-trip-detail.html` | R | Đang tải, Bình thường, Hết chỗ | — | SV1 | CM-016 | — | — |
| 17 | Hành khách | Xác nhận đặt chỗ | Chọn điểm đón trong tuyến đã được điều phối, ghi chú và gửi yêu cầu | Đặt chỗ & Cam kết chia sẻ | `pages/rider/rider-booking-confirm.html` | C | Đang gửi, Thành công, Lỗi trùng | — | SV1 | CM-017 | — | — |
| 18 | Hành khách | Quản lý các chuyến đi | Theo dõi các tab Chờ duyệt / Sắp đi / Lịch sử | Chuyến đi của tôi | `pages/rider/rider-my-trips.html` | R/U/D | 4 trạng thái tab, Hủy vé | — | SV1 | CM-018 | — | — |
| 19 | Hành khách | Theo dõi chuyến đi | Xem trạng thái chuyến và điểm đón đã thống nhất | Theo dõi chuyến đi | `pages/rider/rider-trip-tracking.html` | R/U | Chờ xe, Đang đi, Hoàn thành | — | SV1 | CM-019 | — | — |
| 20 | Hành khách | Đánh giá tài xế | Chấm sao, chọn thẻ khen ngợi, gửi nhận xét | Đánh giá & Phản hồi chuyến đi | `pages/rider/rider-trip-review.html` | C | Form đánh giá, Đã gửi thành công | — | SV1 | CM-020 | — | — |
| 21 | Tài xế | Theo dõi tổng quan | Xem lịch chuyến được phân công và dữ liệu hoạt động | Bảng điều khiển tài xế | `pages/driver/driver-dashboard.html` | R | Dữ liệu đã lưu, Rỗng | — | SV2 | CM-021 | — | — |
| 22 | Tài xế | Xem quy trình tạo chuyến | Đọc hướng dẫn tạo chuyến qua điều phối viên | Quy trình điều phối | `pages/driver/driver-trip-create.html` | R | Hướng dẫn, Điều hướng | — | SV2 | CM-022 | — | — |
| 23 | Tài xế | Xem quy trình chuyến định kỳ | Đọc hướng dẫn gửi nhu cầu lịch định kỳ cho điều phối viên | Lịch trình lặp lại hàng tuần | `pages/driver/driver-trip-recurring.html` | R | Hướng dẫn, Điều hướng | — | SV2 | CM-023 | — | — |
| 24 | Tài xế | Xem lịch được giao | Xem các chuyến được điều phối viên phân công | Lịch trình chuyến xe | `pages/driver/driver-schedule.html` | R/U | Danh sách, Rỗng, Cập nhật trạng thái | — | SV2 | CM-024 | — | — |
| 25 | Tài xế | Quản lý khách trong xe | Xem danh sách khách đã chốt, đóng đăng ký | Chi tiết chuyến xe tài xế | `pages/driver/driver-trip-detail.html` | R/U | Còn chỗ, Đầy ghế, Đã đóng | — | SV2 | CM-025 | — | — |
| 26 | Tài xế | Duyệt người tham gia | Duyệt hoặc từ chối các yêu cầu xin đi chung | Quản lý yêu cầu ghép chuyến | `pages/driver/driver-join-requests.html` | R/U | Chờ duyệt, Chấp nhận, Từ chối | — | SV2 | CM-026 | — | — |
| 27 | Tài xế | Vận hành chuyến đi | Xác nhận đón từng khách, hoàn thành chuyến đi | Điều hành chuyến đi thực tế | `pages/driver/driver-trip-execution.html` | U | Đang đón, Khách đã lên xe, Xong | — | SV2 | CM-027 | — | — |
| 28 | Tài xế | Thống kê tài chính | Xem lịch sử chia sẻ chi phí đã ghi nhận | Lịch sử chia sẻ chi phí | `pages/driver/driver-earnings-history.html` | R | Bảng giao dịch, Rỗng | — | SV2 | CM-028 | — | — |
| 29 | Điều phối | Giám sát lưu lượng | Theo dõi lưu lượng di chuyển, tỷ lệ ghép | Dashboard lưu lượng cộng đồng | `pages/coordinator/coordinator-mobility-dashboard.html` | R | Biểu đồ, Chỉ số KPI tổng hợp | — | SV3 | CM-029 | — | — |
| 30 | Điều phối | Phân tích nhu cầu | Xem nhu cầu từ yêu cầu ghép và chỗ còn trống | Bản đồ nhu cầu | `pages/coordinator/coordinator-demand-heatmap.html` | R | Tính toán từ dữ liệu, Rỗng | — | SV3 | CM-030 | — | — |
| 31 | Điều phối | Quản lý trạm đón | Xem danh mục các điểm đón cộng đồng an toàn | Quản lý điểm đón an toàn | `pages/coordinator/coordinator-pickup-zone-management.html` | R/D | Danh sách điểm đón, Tạm đóng | — | SV3 | CM-031 | — | — |
| 32 | Điều phối | Thêm/sửa trạm đón | Khảo sát tọa độ, ghi chú vỉa hè & đèn đường | Biên tập điểm đón an toàn | `pages/coordinator/coordinator-pickup-zone-editor.html` | C/U | Form thêm/sửa, Thành công | — | SV3 | CM-032 | — | — |
| 33 | Điều phối | Tiếp nhận sự cố | Danh sách khiếu nại (bùng chuyến, tranh chấp) | Trung tâm xử lý báo cáo sự cố | `pages/coordinator/coordinator-report-center.html` | R/U | Chờ xử lý, Đang điều tra, Đóng | — | SV3 | CM-033 | — | — |
| 34 | Điều phối | Hòa giải sự cố | Xem báo cáo sự cố và ghi nhận xử lý | Chi tiết & Biên bản xử lý sự cố | `pages/coordinator/coordinator-report-detail.html` | U | Ghi chú hòa giải, Cảnh cáo tài khoản | — | SV3 | CM-034 | — | — |
| 35 | Điều phối | Lập và phân công chuyến | Thiết lập tuyến, điểm dừng, trạm đón và tài xế | Quản lý chuyến xe điều phối | `pages/coordinator/coordinator-trip-management.html` | C/R/U | Tạo chuyến, Phân công tài xế, Danh sách | — | SV3 | CM-035 | — | — |
| 36 | Quản trị | Quản trị tổng thể | Bảng điều hành trung tâm toàn hệ thống | Bảng điều khiển quản trị viên | `pages/admin/admin-dashboard.html` | R | Dữ liệu đã lưu, Rỗng | — | SV3 | CM-036 | — | — |
| 37 | Quản trị | Quản lý tài khoản | Danh sách người dùng, phân quyền, khóa tài khoản | Quản lý người dùng & Vai trò | `pages/admin/admin-user-management.html` | R/U/D | Bảng phân trang, Khóa/Mở | — | SV3 | CM-037 | — | — |
| 38 | Quản trị | Thẩm định KYC | Xem và duyệt tài liệu người dùng đã gửi | Chi tiết người dùng & Duyệt KYC | `pages/admin/admin-user-detail.html` | R/U | Chờ duyệt, Duyệt, Từ chối | — | SV3 | CM-038 | — | — |
| 39 | Quản trị | Kiểm toán chuyến đi | Giám sát các chuyến có trong hệ thống | Kiểm toán & Giám sát chuyến đi | `pages/admin/admin-trip-audit.html` | R/U | Bảng tra cứu, Hủy chuyến vi phạm | — | SV3 | CM-039 | — | — |
| 40 | Quản trị | Cấu hình nền tảng | Cấu hình các tham số hệ thống | Cấu hình tham số nền tảng | `pages/admin/admin-platform-settings.html` | R/U | Form thiết lập, Lưu thành công | — | SV3 | CM-040 | — | — |
| 41 | Quản trị | Nhật ký hệ thống | Theo dõi và tải xuống nhật ký đã ghi nhận | Nhật ký hệ thống & Audit Trail | `pages/admin/admin-system-logs.html` | R | Bảng log, Tải CSV | — | SV3 | CM-041 | — | — |
| 42 | Hệ thống | Báo lỗi truy cập | Báo lỗi 403 khi tài khoản không đủ quyền | Lỗi 403 - Quyền truy cập bị từ chối | `pages/system/403.html` | R | Nút điều hướng về trang hợp lệ | — | SV3 | CM-042 | — | — |
| 43 | Hệ thống | Báo lỗi đường dẫn | Báo lỗi 404 khi đường dẫn không tồn tại | Lỗi 404 - Không tìm thấy trang | `pages/system/404.html` | R | Nút quay lại trang chủ | — | SV3 | CM-043 | — | — |
| 44 | Tài khoản | Ứng tuyển vai trò | Gửi và xem trạng thái đơn tài xế / điều phối viên | Ứng tuyển vai trò | `pages/account/role-applications.html` | C/R | Gửi đơn, Trạng thái đơn | — | SV2 | CM-044 | — | — |
| 45 | Quản trị | Duyệt ứng tuyển | Duyệt hoặc từ chối đơn xin vai trò | Duyệt đơn ứng tuyển | `pages/admin/admin-role-applications.html` | R/U | Chờ duyệt, Duyệt, Từ chối | — | SV3 | CM-045 | — | — |
| 46 | Quản trị | Xác thực Super Admin | Xác thực lại trước khi truy cập quyền Super Admin | Xác thực Super Admin | `pages/system/superadmin-auth.html` | U | Xác thực, Từ chối, Điều hướng | — | SV3 | CM-046 | — | — |
| 47 | Hệ thống | Tương thích đường dẫn hồ sơ | Chuyển hướng đường dẫn hồ sơ cũ đến trang hồ sơ hiện tại | Chuyển hướng hồ sơ | `pages/account/profile.html` | R | Chuyển hướng | — | SV3 | CM-047 | — | — |
| 48 | Hệ thống | Tương thích đường dẫn thông báo | Chuyển hướng đường dẫn thông báo cũ đến trung tâm thông báo | Chuyển hướng thông báo | `pages/account/notifications.html` | R | Chuyển hướng | — | SV3 | CM-048 | — | — |
| 49 | Điều phối | Kiểm định phương tiện | Xem hồ sơ và cập nhật trạng thái kiểm định ô tô | Kiểm định ô tô | `pages/coordinator/coordinator-vehicle-inspection.html` | R/U | Danh sách, chờ duyệt, đạt, không đạt | — | SV3 | CM-049 | — | — |
| 50 | Điều phối | Xét hồ sơ tài xế | Kiểm tra và duyệt hồ sơ ứng tuyển tài xế | Duyệt hồ sơ tài xế | `pages/coordinator/coordinator-driver-applications.html` | R/U | Chờ duyệt, đạt, từ chối | — | SV3 | CM-050 | — | — |
