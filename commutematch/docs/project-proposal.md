# BẢN ĐỀ XUẤT DỰ ÁN (PROJECT PROPOSAL)
## BTL-06: CommuteMatch – Ghép chuyến đi chung cho cộng đồng sinh viên & nhân viên

---

## 1. BỐI CẢNH & PHÁT BIỂU VẤN ĐỀ
Tại các khu đô thị đại học và khu công nghệ tập trung (như ĐHQG TP.HCM, Khu Công nghệ cao TP.Thủ Đức, v.v.), hàng chục ngàn sinh viên và nhân viên di chuyển trên cùng các trục đường huyết mạch mỗi ngày. Tuy nhiên:
- **P1. Khó tìm người tương thích:** Người đi xe và người cần đi nhờ thường chỉ trao đổi qua các nhóm mạng xã hội (Facebook Group, Zalo chat) tự phát, tin nhắn trôi nhanh, không thể lọc theo khung giờ, vị trí hay tuyến đường.
- **P2. Thỏa thuận điểm đón phức tạp:** Việc dừng đón ngẫu hứng trên các xa lộ gây nguy hiểm và dễ bị lỡ chuyến do thiếu các trạm dừng an toàn được quy ước trước.
- **P3. Thiếu cơ chế uy tín & lịch sử:** Người tham gia lo ngại về an toàn cá nhân, hiện tượng bùng chuyến không báo trước, thiếu đánh giá hai chiều minh bạch.
- **P4. Điều phối thiếu dữ liệu:** Nhà trường và ban quản lý khu đô thị không nắm được lưu lượng và các điểm nghẽn di chuyển để tổ chức các trạm dừng an toàn.

---

## 2. GIẢI PHÁP: NỀN TẢNG COMMUTEMATCH
**CommuteMatch** là nền tảng web ghép chuyến đi chung bằng ô tô nhiều chỗ (từ 7 ghế tổng cộng), có cấu trúc và phi thương mại, tập trung vào chia sẻ chi phí nhiên liệu, điều phối tuyến / điểm đón và xây dựng cộng đồng di chuyển văn minh.

### 4 Vai trò cốt lõi trong hệ thống:
1. **Hành khách (Rider):** Tìm chuyến thông minh theo lộ trình, nhận gợi ý AI Matching, đặt chỗ, check-in điểm hẹn và đánh giá uy tín tài xế.
2. **Người chia sẻ xe (Driver):** Tham gia các chuyến được điều phối viên phân công, xử lý yêu cầu của hành khách, vận hành chuyến và ghi nhận chia sẻ chi phí.
3. **Điều phối viên cộng đồng (Coordinator):** Thiết lập trạm đón an toàn, tạo tuyến và điểm dừng, phân công tài xế, xem nhu cầu từ yêu cầu ghép đã gửi, tiếp nhận và hòa giải báo cáo sự cố.
4. **Quản trị viên hệ thống (Administrator):** Quản lý người dùng, duyệt hồ sơ định danh KYC (thẻ sinh viên/nhân viên), kiểm toán chuyến đi, cấu hình tham số hệ thống và theo dõi nhật ký hoạt động.

---

## 3. MỤC TIÊU & CHỈ SỐ THÀNH CÔNG (KPI)
- Xây dựng 43 màn hình giao diện web tương tác, phản hồi nhanh và hỗ trợ thiết bị di động.
- Dùng các phép tính heuristic phía trình duyệt để hỗ trợ tìm chuyến và tổng hợp nhu cầu; chưa tích hợp AI trực tuyến, bản đồ hoặc dữ liệu giao thông trực tiếp.
- Cơ chế quản lý dữ liệu Client-side hoàn chỉnh bằng `LocalStorage`, cho phép demo mượt mà không phụ thuộc hạ tầng mạng máy chủ phức tạp.
- Minh chứng quy trình làm việc nhóm chuyên nghiệp: GitHub Branching, Commit chuẩn conventional, PR review chéo, và Video OBS cho từng màn hình.
