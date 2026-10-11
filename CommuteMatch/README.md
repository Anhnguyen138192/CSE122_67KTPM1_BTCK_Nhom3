# CommuteMatch

Mở `index.html` để chạy trang chủ. Các màn hình được nhóm theo vai trò trong `Hanhkhach/`, `Nguoichiase/`, `Dieuphoi/` và `admin/`.

- `css/`: kiểu dáng dùng chung và bản đồ.
- `js/`: tương tác trang chủ, điều hướng/màn hình vai trò và Google Maps.
- `data/`: dữ liệu giả lập dùng chung.

Để bật bản đồ tương tác, thêm Google Maps JavaScript API key vào `js/google-maps-config.js`; bật Maps JavaScript API và giới hạn key theo HTTP referrer trong Google Cloud. Không đưa key không giới hạn lên kho công khai. Hiện tại, bạn có thể nhập hoặc sửa điểm đón và điểm đến trực tiếp trong biểu mẫu; Google Maps chưa được bật.

