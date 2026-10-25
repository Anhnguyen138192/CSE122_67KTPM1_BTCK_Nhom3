# SV1 – Tách nghiệp vụ Hành khách và đối chiếu ứng dụng xe công nghệ

## 1. Phạm vi chính thức của SV1

SV1 phụ trách 15 màn hình theo `docs/team-assignment.md`: trang chủ, giới thiệu, cẩm nang an toàn, đăng nhập, quên mật khẩu, hồ sơ cá nhân, chỉnh sửa hồ sơ KYC và 8 màn hình hành khách. SV1 đồng thời phụ trách Design Tokens và Base CSS (màu Emerald/Teal, typography, nút, biểu mẫu, responsive, Dark/Light mode).

### Danh sách màn hình
| # | Màn hình | Tệp | Nghiệp vụ chính |
|---:|---|---|---|
| 1 | Trang chủ | `html/index.html` | Giới thiệu dịch vụ, điều hướng tới tìm chuyến/đăng nhập |
| 2 | Giới thiệu | `html/common/about.html` | Mục tiêu và lợi ích CommuteMatch |
| 3 | Cẩm nang an toàn | `html/common/safety-guidelines.html` | Hướng dẫn an toàn, quy tắc ứng xử |
| 4 | Đăng nhập | `html/common/login.html` | Xác thực và điều hướng theo vai trò |
| 5 | Quên mật khẩu | `html/common/forgot-password.html` | Xác minh và đổi mật khẩu |
| 6 | Hồ sơ cá nhân | `html/account/profile-overview.html` | Xem thông tin, trạng thái xác minh |
| 7 | Chỉnh sửa hồ sơ/KYC | `html/account/profile-edit.html` | Cập nhật thông tin cá nhân và hồ sơ định danh |
| 8 | Dashboard hành khách | `html/rider/rider-dashboard.html` | Tổng quan chuyến sắp tới, lịch sử, chỉ số |
| 9 | Tìm chuyến | `html/rider/rider-trip-search.html` | Điểm đi/đến, ngày giờ, số người, bộ lọc |
| 10 | Kết quả AI-1 | `html/rider/rider-match-results.html` | So sánh chuyến, điểm tương thích và lý do đề xuất |
| 11 | Chi tiết chuyến | `html/rider/rider-trip-detail.html` | Lộ trình, tài xế, phương tiện, chi phí, chỗ trống |
| 12 | Xác nhận đặt chỗ | `html/rider/rider-booking-confirm.html` | Chọn điểm đón, ghi chú, gửi yêu cầu ghép chuyến |
| 13 | Chuyến đi của tôi | `html/rider/rider-my-trips.html` | Xem trạng thái, hủy/rút yêu cầu |
| 14 | Theo dõi chuyến | `html/rider/rider-trip-tracking.html` | Theo dõi trạng thái, check-in, SOS |
| 15 | Đánh giá tài xế | `html/rider/rider-trip-review.html` | Chấm sao, nhận xét sau chuyến |

## 2. Đối chiếu với ứng dụng xe công nghệ

| Nghiệp vụ | CommuteMatch theo thiết kế/mã hiện có | Đối chiếu Grab/be | Đánh giá |
|---|---|---|---|
| Tài khoản và hồ sơ | Có màn hình đăng nhập, hồ sơ, chỉnh sửa | Là chức năng cơ bản của ứng dụng gọi xe | Kiểm tra xác thực, lưu dữ liệu và trạng thái KYC |
| Tìm điểm đi/đến và giờ | Có form tìm chuyến | Ứng dụng gọi xe cũng cho nhập điểm đón/đến | Phù hợp; nên kiểm tra đầu vào và bộ lọc |
| Đề xuất chuyến AI-1 | Có kết quả ghép chuyến | Khác biệt so với luồng gọi xe thông thường | Hiển thị rõ điểm tương thích và lý do đề xuất |
| Chi tiết tài xế/xe | Có trang chi tiết | Ứng dụng gọi xe hiển thị thông tin nhận diện tài xế/xe | Cần đảm bảo dữ liệu lấy đúng chuyến đã chọn |
| Chi phí trước khi xác nhận | Có chi phí chia sẻ | Ứng dụng gọi xe hiển thị giá hoặc giá dự kiến tùy dịch vụ | Ghi rõ đây là chi phí chia sẻ dự kiến |
| Đặt chỗ và duyệt | Có gửi yêu cầu ghép chuyến | Mô hình khác đặt xe tức thời: tài xế có thể cần duyệt | Phải phân biệt chờ duyệt/được chấp nhận/từ chối/hủy |
| Quản lý chuyến | Có các tab trạng thái và hủy | Có lịch sử và quản lý chuyến | Đồng bộ trạng thái hành khách–tài xế |
| Theo dõi chuyến | Có giao diện mô phỏng trạng thái | Grab có theo dõi tài xế và ETA tùy dịch vụ | Chưa coi là GPS thời gian thực nếu chưa tích hợp định vị |
| Đánh giá | Có form đánh giá | Có đánh giá sau chuyến | Chỉ cho đánh giá chuyến hoàn thành, chống gửi trùng |
| SOS/an toàn | Có nút SOS trong giao diện | Ứng dụng xe có công cụ an toàn/hỗ trợ tùy dịch vụ | Nút hiện tại chưa chứng minh đã gửi báo động thật |
| Chia sẻ hành trình | Chưa thấy luồng riêng | Grab có tính năng chia sẻ chuyến | Nên bổ sung mức ưu tiên trung bình |
| Địa điểm thường dùng | Chưa thấy luồng riêng | Ứng dụng có thể lưu địa điểm yêu thích | Nên bổ sung nhà/trường/nơi làm việc |
| Báo cáo sự cố | Chưa thấy luồng riêng trong phần SV1 | Có kênh hỗ trợ/báo cáo sự cố | Phối hợp SV3, tránh tạo hệ thống báo cáo tách biệt |
| Thông báo trạng thái | Có trang thông báo dùng chung do SV3 phụ trách | Ứng dụng gửi thông báo về trạng thái chuyến | Phối hợp SV3 để tạo thông báo khi duyệt/hủy/hoàn thành |
| Thanh toán điện tử | Không phải luồng cốt lõi đã giao | Grab/be có phương thức thanh toán tùy dịch vụ | Chưa cần xây ví nếu đề tài chỉ mô phỏng chia sẻ chi phí |

## 3. Các điểm cần ưu tiên kiểm tra trong mã

### Ưu tiên rất cao
1. **Đặt chỗ:** chặn chuyến đã khởi hành/hủy/hết chỗ; chặn yêu cầu trùng; bắt buộc đăng nhập; hiển thị đúng trạng thái chờ tài xế duyệt.
2. **Đồng bộ chuyến:** khi tài xế chấp nhận/từ chối/hủy, trang Chuyến đi của tôi và Theo dõi chuyến phải cập nhật nhất quán. Phần lưu trữ dùng chung thuộc phối hợp SV2.
3. **Đánh giá:** lấy đúng mã chuyến và tài xế; chỉ đánh giá chuyến hoàn thành; mỗi hành khách đánh giá một lần/chuyến.
4. **Quên mật khẩu:** xác minh rằng mật khẩu mới thật sự được cập nhật. OTP cố định chỉ phù hợp demo, không phải bảo mật thực tế.
5. **SOS:** nếu chỉ hiện hộp thoại/toast thì ghi là mô phỏng; không thông báo đã gọi cứu hộ nếu chưa gửi sự kiện đến hệ thống tiếp nhận.

### Ưu tiên cao/trung bình
- Tìm kiếm không có kết quả: cho sửa giờ, ngày hoặc mở rộng tiêu chí mà không nhập lại toàn bộ.
- AI-1: giải thích điểm phù hợp dựa trên tuyến đường, giờ, khoảng cách điểm đón và số chỗ.
- Điểm đón: đề xuất phải thuận tiện, an toàn và có lựa chọn khác.
- Chia sẻ hành trình với người thân.
- Lưu địa điểm thường dùng.
- Báo cáo sự cố, phối hợp SV3.
- Thông báo khi yêu cầu được chấp nhận/từ chối, chuyến bị hủy hoặc hoàn thành, phối hợp SV3.

## 4. Checklist nghiệm thu SV1

- [ ] 15 màn hình mở được và liên kết đúng.
- [ ] Form tìm chuyến kiểm tra dữ liệu đầu vào.
- [ ] Kết quả AI-1 phản ánh đúng điều kiện tìm kiếm.
- [ ] Chi tiết chuyến lấy đúng dữ liệu đã chọn.
- [ ] Không đặt chuyến đã hủy/đã khởi hành/hết chỗ.
- [ ] Không tạo yêu cầu ghép chuyến trùng.
- [ ] Trạng thái chờ duyệt/được chấp nhận/từ chối/hủy hiển thị rõ.
- [ ] Hủy chuyến cập nhật dữ liệu dùng chung.
- [ ] Theo dõi chuyến ghi rõ là mô phỏng nếu chưa có GPS thật.
- [ ] SOS không tuyên bố đã gửi cứu hộ nếu chưa tích hợp thật.
- [ ] Chỉ đánh giá chuyến hoàn thành và chống đánh giá trùng.
- [ ] Quên mật khẩu cập nhật dữ liệu tài khoản trong phạm vi demo.
- [ ] Responsive và trạng thái lỗi/rỗng/thành công nhất quán.

## 5. Phân định trách nhiệm với SV2/SV3

- **SV1:** giao diện và luồng hành khách; tạo yêu cầu ghép chuyến; hiển thị trạng thái và đánh giá.
- **SV2:** tầng dữ liệu giả lập/LocalStorage dùng chung, tạo chuyến, duyệt yêu cầu và đồng bộ phía tài xế.
- **SV3:** trung tâm thông báo, tiếp nhận báo cáo sự cố, quản trị và điều phối.

Các chức năng phụ thuộc chéo cần thống nhất tên khóa LocalStorage, cấu trúc đối tượng chuyến/yêu cầu và các giá trị trạng thái trước khi tích hợp.

## 6. Tài liệu tham khảo đối chiếu

- Grab – Passenger features: https://www.grab.com/vn/en/better-everyday/passenger/
- Grab – Transport/car: https://www.grab.com/vn/en/transport/car/
- be – Ứng dụng dịch vụ: https://apps.apple.com/vn/app/be-multi-service-platform/id1440565902

Tính năng có thể khác theo phiên bản ứng dụng, khu vực và loại dịch vụ. Báo cáo này đánh giá phạm vi và các điểm cần kiểm tra, không khẳng định toàn bộ nghiệp vụ đã được kiểm thử tự động.
