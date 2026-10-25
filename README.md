# CommuteMatch — Ghép chuyến đi chung cho cộng đồng

## 1. Tổng quan dự án

CommuteMatch là website hỗ trợ cộng đồng tìm và chia sẻ chuyến đi, tập trung vào an toàn, tối ưu lộ trình và chia sẻ chi phí.

## 2. Bài toán và mục tiêu

Dự án giải quyết khó khăn khi tìm người đi cùng phù hợp, chọn điểm đón an toàn, theo dõi thay đổi chuyến và quản lý lịch sử chuyến đi.

## 3. Vai trò sử dụng

Hệ thống có các vai trò Hành khách, Tài xế, Điều phối viên và Quản trị viên. Màn hình và quyền truy cập thay đổi theo nghiệp vụ của từng vai trò.

## 4. Phạm vi màn hình

Danh sách màn hình và người phụ trách được theo dõi tại [docs/screen-inventory.md](commutematch%20(1)/docs/screen-inventory.md). Inventory hiện có 42 màn hình; SV2 phụ trách 11 màn hình.

## 5. Chức năng chính

Người dùng có thể đăng ký, quản lý phương tiện, tìm/đăng chuyến, gửi yêu cầu ghép chuyến, trao đổi, vận hành chuyến và xem lịch sử chia sẻ chi phí.

## 6. Công nghệ

HTML5, CSS3, Bootstrap 5.3, JavaScript ES6, LocalStorage và MockAPI cho dữ liệu nghiệp vụ tài xế.

## 7. Cấu trúc thư mục

```text
CSE122_67KTPM1_BTCK_Nhom3/
├── README.md
├── .github/workflows/pages.yml
└── commutematch (1)/
    ├── index.html
    ├── html/                 # Màn hình ứng dụng
    ├── css/                  # style.css, components.css, responsive.css
    ├── js/                   # module dùng chung, dữ liệu, API
    ├── assets/               # ảnh và tài nguyên giao diện
    └── docs/                 # proposal, inventory, phân công, AI report
```

Một số màn hình cũ vẫn còn trong các thư mục tương thích; inventory xác định danh sách màn hình hiện hành.

## 8. Chạy dự án trên máy

Mở thư mục `commutematch (1)` bằng VS Code và chạy `index.html` với Live Server. Dùng Live Server để các yêu cầu `fetch()` và MockAPI hoạt động đúng.

## 9. Dữ liệu và lưu trữ

Dữ liệu mẫu được khởi tạo từ `js/data/mock-data.js`. Ứng dụng demo lưu dữ liệu phía trình duyệt bằng LocalStorage; xóa dữ liệu trình duyệt sẽ xóa trạng thái demo cục bộ.

## 10. Tích hợp API

`js/modules/driver-api.js` kết nối MockAPI resource `driverData` để đồng bộ chuyến, yêu cầu ghép, thông báo và lịch định kỳ. Khi API không khả dụng, ứng dụng dùng dữ liệu LocalStorage dự phòng.

## 11. CRUD và trạng thái giao diện

Các màn hình nghiệp vụ hỗ trợ đọc/tạo/cập nhật/hủy phù hợp vai trò. Giao diện có phản hồi trạng thái; hãy xem từng dòng `States` trong inventory để đối chiếu. Cần kiểm tra thao tác thực tế và tải lại trang trước khi nghiệm thu.

## 12. Tính năng AI

AI-1 gợi ý ghép chuyến; AI-2 đề xuất điểm hẹn; AI-3 mô phỏng bản đồ nhiệt nhu cầu. Đây là logic mô phỏng phía trình duyệt, không phải dịch vụ AI production. Cách dùng AI được khai báo tại [docs/ai-usage-report.md](commutematch%20(1)/docs/ai-usage-report.md).

## 13. Responsive và Accessibility

Các tệp `css/responsive.css` và Bootstrap điều chỉnh bố cục cho desktop, tablet và điện thoại 320–375px. Các trang SV2 có skip link, một vùng `main`, tiêu đề chính và viền focus bàn phím. Cần hoàn tất kiểm tra trực quan tại zoom 200%, tương phản và W3C Validator trước khi nghiệm thu.

## 14. GitHub, nhánh và Trello

`main` dành cho bản nhóm hoàn chỉnh; `dev` là nhánh tích hợp. Mỗi đầu việc phát triển trên `feature/<ten-cong-viec>`, dùng commit `feat:`, `fix:`, `style:`, `refactor:` hoặc `docs:`, rồi mở Pull Request để thành viên khác review trước khi merge. Tiến độ quản lý qua board Trello CommuteMatch.

## 15. Triển khai và tài liệu

Workflow [pages.yml](.github/workflows/pages.yml) triển khai thư mục website sau khi push/merge vào `dev`. Chủ repo cần bật **Settings → Pages → Source: GitHub Actions** để kích hoạt lần deploy đầu. Tài liệu phân tích, inventory, phân công và báo cáo AI nằm trong `commutematch (1)/docs/`.
