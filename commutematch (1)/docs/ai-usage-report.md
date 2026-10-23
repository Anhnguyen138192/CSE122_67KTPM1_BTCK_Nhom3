# BÁO CÁO KHAI BÁO SỬ DỤNG AI (AI USAGE REPORT)
## Dự án: CommuteMatch – Ghép chuyến đi chung cho cộng đồng (CSE122)

---

## 1. CÁC CÔNG CỤ AI ĐÃ SỬ DỤNG
- **Google Antigravity / Gemini 3.8:** Hỗ trợ kiến trúc hệ thống, sinh khung mã nguồn HTML5 ngữ nghĩa, viết hàm thuật toán AI mô phỏng ở Frontend, thiết kế hệ thống Design Tokens và Mock Data.
- **Figma AI:** Hỗ trợ tạo wireframe ban đầu và bảng màu UI chuẩn tiếp cận (Contrast AA).

---

## 2. DANH SÁCH CÂU LỆNH (PROMPT) CHÍNH
1. *"Thiết kế bảng kiểm kê màn hình 42 trang đáp ứng trọn vẹn nghiệp vụ ghép chuyến đi chung cộng đồng theo chuẩn học phần CSE122."*
2. *"Xây dựng mô-đun LocalStorage CRUD độc lập mô phỏng cơ sở dữ liệu quan hệ cho các thực thể trips, joinRequests, pickupZones, users, reports, ratings."*
3. *"Hiện thực thuật toán giải thích được (Explainable AI) cho 3 bài toán: Điểm tương thích lộ trình AI-1, Điểm đón tối ưu AI-2, và Bản đồ nhiệt lưu lượng AI-3 có đầy đủ trạng thái đang xử lý, giải thích lý do và phương án dự phòng khi AI không chắc chắn."*
4. *"Thiết kế hệ thống CSS hiện đại không phụ thuộc framework nặng, responsive mobile-first, có thanh chuyển đổi vai trò (Role Switcher) trực quan trên Header phục vụ chấm điểm."*

---

## 3. PHÂN ĐỊNH PHẦN AI SINH RA & PHẦN SINH VIÊN HOÀN THIỆN
* **Phần AI sinh ra:**
  - Khung sườn cấu trúc thư mục, khởi tạo mảng dữ liệu mẫu ban đầu (`mock-data.js`).
  - Bộ khung các thẻ HTML ngữ nghĩa (`<header>`, `<nav>`, `<main>`, `<aside>`, `<section>`, `<footer>`).
  - Các công thức toán học ước tính độ lệch toạ độ (Haversine Formula) và tính toán điểm tương thích trong `ai-engine.js`.
* **Phần sinh viên chỉnh sửa & hoàn thiện:**
  - Tinh chỉnh toàn bộ nội dung text, địa danh cụ thể tại TP.HCM (Khu đô thị ĐHQG, KTX Khu B, Trường ĐH Bách Khoa, Khu Công nghệ cao, Xa lộ Hà Nội).
  - Tối ưu CSS theo chuẩn độ tương phản WCAG 2.1 AA, điều chỉnh padding/margin trên màn hình cảm ứng di động.
  - Viết logic kiểm tra hợp lệ biểu mẫu (Form validation) chặt chẽ, ràng buộc số ghế, giá trần xăng xe theo quy định bộ luật đi chung xe.
  - Xây dựng trải nghiệm "AI thất bại / AI chưa chắc chắn" và các nút can thiệp thủ công (User in the loop).

---

## 4. LỖI AI GẶP PHẢI & CÁCH SINH VIÊN KIỂM CHỨNG
1. **Lỗi bất đồng bộ khi cập nhật LocalStorage:** AI ban đầu tạo các hàm đọc ghi rời rạc gây lệch trạng thái giữa các trang.
   - *Cách khắc phục:* Nhóm tái cấu trúc thành một lớp `Storage` duy nhất phát ra sự kiện `CustomEvent('storageUpdated')` để các component tự động đồng bộ.
2. **Lỗi thuật toán AI-1 khi giờ khởi hành cách nhau qua đêm:** Khi người dùng chọn chuyến lúc 23:45 và 00:15 hôm sau, thuật toán trừ số phút đơn thuần gây điểm số âm.
   - *Cách khắc phục:* Sinh viên viết thêm logic chuẩn hóa chênh lệch thời gian tuần hoàn theo modulo 1440 phút trong ngày.
3. **Lỗi tràn bảng (Table overflow) trên di động:** Bảng dữ liệu người dùng và kiểm toán bị vỡ khung trên màn hình 375px.
   - *Cách khắc phục:* Bổ sung lớp bọc `.table-responsive` và chuyển đổi thẻ card dạng Stack trên viewport nhỏ.

---

## 5. ĐIỀU SINH VIÊN HỌC ĐƯỢC
- Nắm vững kiến trúc ứng dụng web không máy chủ (Client-side Web App) với khả năng lưu trữ bền vững qua `LocalStorage`.
- Hiểu sâu sắc nguyên tắc thiết kế **Explainable AI (XAI)**: Người dùng phải hiểu *"Vì sao AI đưa ra kết quả này?"* và luôn nắm quyền kiểm soát cuối cùng (Chấp nhận, Tinh chỉnh, Từ chối).
- Rèn luyện kỹ năng phân chia lát cắt dọc, quản lý mã nguồn Git, giải quyết xung đột (merge conflicts) và tự tin thuyết trình sản phẩm qua video OBS.

---

## 6. DANH MỤC MÔ PHỎNG VS API THẬT
- **LocalStorage & Mock Data (Mô phỏng):** Toàn bộ dữ liệu người dùng, chuyến đi, yêu cầu đặt chỗ, báo cáo và điểm đón được lưu trữ bền vững trong trình duyệt người dùng, tự động khởi tạo khi chạy lần đầu và có nút Reset dữ liệu về mặc định.
- **AI Engine (Frontend Rule-based & Heuristic AI):** Mô phỏng chu trình suy diễn AI với thời gian chờ tính toán giả lập (Skeleton loading 800ms - 1.2s), phân tích trọng số đa tiêu chí, tạo cảm giác trải nghiệm sản phẩm AI thực tế mượt mà và tin cậy.
