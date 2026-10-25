# CommuteMatch – Ghép Chuyến Đi Chung Cho Cộng Đồng (CSE122)

> **Dự án BTL-06:** Phát triển ứng dụng Web cơ bản – CSE122
> **Quy mô:** 50 trang HTML, lưu dữ liệu trên LocalStorage và các phép tính ghép chuyến / nhu cầu dạng heuristic; chưa tích hợp dịch vụ AI hay bản đồ trực tiếp.

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN
1. **Không cần cài đặt backend:** Hệ thống dùng HTML5, CSS3, JavaScript ES6+ và LocalStorage. Một bộ dữ liệu mô phỏng có nhãn được khởi tạo một lần để thử luồng; các chỉnh sửa được giữ sau khi tải lại trang. Tài khoản đã lưu trong trình duyệt được giữ nguyên.
2. **Cách mở:**
   - Mở trực tiếp tệp `index.html` bằng bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari).
   - Hoặc dùng Live Server trong VS Code / IDE của bạn.
3. **Đăng nhập và cấp vai trò:**
   - Các tính năng nghiệp vụ yêu cầu đăng nhập. Tài khoản đăng ký mới bắt đầu với vai trò **Hành khách**.
   - Trong **Ứng tuyển vai trò**, gửi đơn làm tài xế hoặc điều phối viên riêng biệt. Quản trị viên duyệt đơn tại **Duyệt đơn ứng tuyển**; sau khi được duyệt, vai trò mới xuất hiện trong danh sách chuyển vai trò.
   - CommuteMatch chỉ ghép chuyến bằng ô tô từ 7 chỗ trở lên (số ghế hành khách bằng tổng ghế trừ ghế tài xế). Điều phối viên lập tuyến, điểm dừng, trạm đón và chỉ định tài xế có hồ sơ ô tô phù hợp tại `coordinator-trip-management.html`. Tài xế chỉ xem và vận hành chuyến được phân công; không tự tạo chuyến.
   - Tài khoản Super Admin mẫu: tên đăng nhập `longchieusigma`, mật khẩu `longchieusigma`. Tài khoản có sẵn các vai trò thông thường và quyền Super Admin gốc; không thể cấp hoặc tước quyền Super Admin cho bất kỳ tài khoản nào.
   - Dữ liệu chuyến, trạm đón và đơn ứng tuyển mô phỏng được gắn với tài khoản có sẵn; ứng dụng không tự tạo tài khoản mô phỏng và không đổi vai trò tài khoản.
   - Phân quyền theo cấp: Super Admin được cấp / tước Tài xế, Điều phối viên và Admin cho tài khoản khác; Admin được cấp / tước Tài xế và Điều phối viên nhưng không được thay đổi tài khoản Admin / Super Admin; Điều phối viên chỉ được cấp / tước Tài xế. Mọi tài khoản luôn giữ vai trò Hành khách; quyền Super Admin chỉ dành cho tài khoản gốc, không thể cấp / tước.
   - Tin nhắn chỉ mở cho hành khách, tài xế và điều phối viên có liên quan đến cùng chuyến hoặc yêu cầu ghép; không có danh bạ nhắn tin đại trà.
   - Mỗi lần đăng nhập hoặc chuyển vào Super Admin đều cần xác thực lại mật khẩu và câu hỏi bảo mật trong `superadmin-auth.html`. Đây là mô phỏng phía trình duyệt, không phải MFA an toàn.
   - Nút **"Xóa dữ liệu hoạt động"** xóa dữ liệu chuyến, yêu cầu, trò chuyện và vận hành, nhưng giữ nguyên tài khoản và phiên đăng nhập hiện tại. Bộ dữ liệu mô phỏng ban đầu không tự tạo lại sau khi bạn xóa.

   - Khi mở hệ thống lần đầu trên một trình duyệt chưa có dữ liệu, ứng dụng thêm hai trạm đón, hai chuyến do tài khoản có sẵn phụ trách, một đơn ứng tuyển chờ duyệt và nhật ký minh họa. Các bản ghi được đánh dấu **Mô phỏng**; sửa, duyệt hoặc hủy sẽ lưu trạng thái mới thay vì khôi phục mẫu khi tải lại.

> **Lưu ý:** Đây là bản demo thuần HTML/JavaScript dùng LocalStorage. Mật khẩu, tin nhắn, hồ sơ và quyền truy cập chỉ lưu trong trình duyệt hiện tại; tin nhắn chưa đồng bộ giữa các thiết bị. Quy tắc hiển thị hồ sơ chỉ là mô phỏng phía giao diện, không bảo vệ được dữ liệu trước người có thể truy cập LocalStorage. Cần backend xác thực, phân quyền và lưu trữ an toàn trước khi dùng với dữ liệu thật.

---

## 👥 THÀNH VIÊN NHÓM & PHÂN CÔNG LÁT CẮT DỌC
- **Sinh viên 1 (SV1):** Phụ trách Phân hệ Hành khách (Rider) + Hệ thống Design Tokens CSS + Xác thực cơ bản (15 màn hình).
- **Sinh viên 2 (SV2):** Phụ trách Phân hệ Tài xế (Driver) + Đăng ký/Xe/Chat + Mô hình LocalStorage CRUD (12 màn hình).
- **Sinh viên 3 (SV3):** Phụ trách Phân hệ Điều phối viên & Admin + Khung Điều hướng Global Nav & Responsive QA (15 màn hình).

---

## 🧭 QUY TRÌNH GHÉP CHUYẾN
- Điều phối viên tạo trạm đón đã kiểm tra, sau đó lập chuyến, các điểm dừng và phân công tài xế.
- Hành khách tìm chuyến theo tuyến, ngày, giờ và chỗ trống, rồi gửi yêu cầu. Tài xế được giao chuyến xử lý yêu cầu.
- Chat giới hạn trong những người có liên quan đến chuyến / yêu cầu. Trạng thái chuyến và nhu cầu được tính từ dữ liệu LocalStorage thực tế.
- Điểm ghép và thống kê nhu cầu hiện dùng heuristic phía trình duyệt; không có AI trực tuyến, dữ liệu giao thông, khoảng cách tuyến thực tế hay GPS trực tiếp.

---

## 📁 CẤU TRÚC THƯ MỤC
```text
commutematch/
├── index.html
├── pages/
│   ├── common/        # Đăng nhập, đăng ký, giới thiệu, an toàn, điều khoản
│   ├── account/       # Hồ sơ, phương tiện, tin nhắn, thông báo, ứng tuyển
│   ├── rider/         # Các màn hình Hành khách
│   ├── driver/        # Các màn hình Tài xế
│   ├── coordinator/   # Các màn hình Điều phối viên
│   ├── admin/         # Các màn hình Quản trị
│   └── system/        # 403, 404, xác thực Super Admin
├── css/               # style.css, components.css, responsive.css
├── js/
│   ├── modules/        # auth.js, ai-engine.js, toast.js, modal.js
│   ├── routes.js       # Điều hướng theo thư mục pages/
│   ├── storage.js      # CRUD LocalStorage
│   └── main.js         # Khởi tạo giao diện và điều hướng
├── assets/
│   ├── data/           # mock-data.js
│   └── images/
└── docs/               # screen-inventory, phân công, đề xuất, báo cáo AI
```
