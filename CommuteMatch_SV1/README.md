# CommuteMatch – Ghép Chuyến Đi Chung Cho Cộng Đồng (CSE122)

> **Dự án BTL-06:** Phát triển ứng dụng Web cơ bản – CSE122  
> **Quy mô:** 42 Màn hình giao diện hoàn chỉnh, tương tác JavaScript, mô phỏng LocalStorage & 3 tính năng AI giải thích được (Explainable AI).

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN
1. **Không cần cài đặt backend phức tạp:** Hệ thống được xây dựng thuần HTML5, CSS3 hiện đại, và JavaScript ES6+ với mô-đun lưu trữ `LocalStorage` tự động khởi tạo dữ liệu mẫu khi mở lần đầu.
2. **Cách mở:**
   - Mở trực tiếp tệp `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari).
   - Hoặc dùng Live Server trong VS Code / IDE của bạn.
3. **Đăng nhập và cấp vai trò:**
   - Các tính năng nghiệp vụ yêu cầu đăng nhập. Tài khoản đăng ký mới bắt đầu với vai trò **Hành khách**.
   - Trong **Ứng tuyển vai trò**, gửi đơn làm tài xế hoặc điều phối viên riêng biệt. Quản trị viên duyệt đơn tại **Duyệt đơn ứng tuyển**; sau khi được duyệt, vai trò mới xuất hiện trong danh sách chuyển vai trò.
   - Tài khoản Super Admin mẫu: tên đăng nhập `longchieusigma`, mật khẩu `longchieusigma`. Tài khoản có sẵn các vai trò thông thường và quyền Super Admin gốc; không thể cấp hoặc tước quyền Super Admin cho bất kỳ tài khoản nào.
   - Phân quyền theo cấp: Super Admin được cấp / tước Tài xế, Điều phối viên và Admin cho tài khoản khác; Admin được cấp / tước Tài xế và Điều phối viên nhưng không được thay đổi tài khoản Admin / Super Admin; Điều phối viên chỉ được cấp / tước Tài xế. Mọi tài khoản luôn giữ vai trò Hành khách; quyền Super Admin chỉ dành cho tài khoản gốc, không thể cấp / tước.
   - Người dùng có thể mở hồ sơ cơ bản và nhắn tin cho tài xế từ chi tiết / kết quả chuyến đi; tài xế có thể mở hồ sơ và nhắn tin cho hành khách trong yêu cầu ghép chuyến. Hành khách và tài xế chỉ xem thông tin cơ bản của nhau; Điều phối viên xem chi tiết hồ sơ hành khách / tài xế; Admin và Super Admin xem chi tiết mọi hồ sơ.
   - Mỗi lần đăng nhập hoặc chuyển vào Super Admin đều cần xác thực lại mật khẩu và câu hỏi bảo mật trong `superadmin-auth.html`. Đây là mô phỏng phía trình duyệt, không phải MFA an toàn.
   - Nút **"Khởi tạo lại Dữ liệu mẫu" (Reset Demo Data)** ở chân trang giúp khôi phục hệ thống về trạng thái ban đầu bất cứ lúc nào.

> **Lưu ý:** Đây là bản demo thuần HTML/JavaScript dùng LocalStorage. Mật khẩu, tin nhắn, hồ sơ và quyền truy cập chỉ lưu trong trình duyệt hiện tại; tin nhắn chưa đồng bộ giữa các thiết bị. Quy tắc hiển thị hồ sơ chỉ là mô phỏng phía giao diện, không bảo vệ được dữ liệu trước người có thể truy cập LocalStorage. Cần backend xác thực, phân quyền và lưu trữ an toàn trước khi dùng với dữ liệu thật.

---

## 👥 THÀNH VIÊN NHÓM & PHÂN CÔNG LÁT CẮT DỌC
- **Sinh viên 1 (SV1):** Phụ trách Phân hệ Hành khách (Rider) + Hệ thống Design Tokens CSS + Xác thực cơ bản (15 màn hình).
- **Sinh viên 2 (SV2):** Phụ trách Phân hệ Tài xế (Driver) + Đăng ký/Xe/Chat + Mô hình LocalStorage CRUD (12 màn hình).
- **Sinh viên 3 (SV3):** Phụ trách Phân hệ Điều phối viên & Admin + Khung Điều hướng Global Nav & Responsive QA (15 màn hình).

---

## 🧠 3 TÍNH NĂNG AI GIẢI THÍCH ĐƯỢC (EXPLAINABLE AI)
- **AI-1: Trip Matching Score** (Tại `rider-match-results.html`): Chấm điểm phù hợp 0-100% dựa trên trùng khớp lộ trình, chênh lệch thời gian xuất phát và điểm tín nhiệm của tài xế.
- **AI-2: Meeting Point Recommender** (Tại `rider-booking-confirm.html`, `rider-trip-tracking.html`, `driver-trip-create.html`): Gợi ý điểm hẹn tối ưu giảm tắc đường, khoảng cách đi bộ < 300m, vỉa hè an toàn.
- **AI-3: Mobility Demand Heatmap** (Tại `coordinator-demand-heatmap.html` & `coordinator-mobility-dashboard.html`): Mô phỏng mật độ lưu lượng theo khu vực và khung giờ, tự động cảnh báo điểm nghẽn thiếu xe.

---

## 📁 CẤU TRÚC THƯ MỤC
```text
commutematch/
├── index.html
├── html/
│   ├── index.html
│   ├── common/                  # Giới thiệu, đăng nhập, đăng ký, chính sách
│   ├── account/                 # Hồ sơ, phương tiện, tin nhắn, thông báo
│   ├── rider/                   # Tìm chuyến, đặt chỗ, theo dõi, đánh giá
│   ├── driver/                  # Đăng chuyến, lịch chạy, yêu cầu, điều hành
│   ├── coordinator/             # Trạm đón, báo cáo, lưu lượng
│   ├── admin/                   # Quản trị, phân quyền, cấu hình, kiểm toán
│   └── system/                  # Trang 403 và 404
├── css/                         # Shared stylesheets
├── js/
│   ├── main.js, storage.js
│   ├── data/                    # Dữ liệu mẫu
│   ├── modules/                 # Xác thực, AI, modal, toast
│   └── pages/                   # Script trang, chia theo cùng nhóm với html/
├── assets/                      # Hình minh họa và tài nguyên tĩnh
└── docs/                        # Danh mục màn hình, đề xuất, ghi chú dự án
```
