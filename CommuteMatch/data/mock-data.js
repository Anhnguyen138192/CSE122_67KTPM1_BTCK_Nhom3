window.CommuteMatchMockData = {
  trips: [
    { id: 1, route: 'Hồ Gươm → Sân bay Nội Bài — Hà Nội', time: '25/09/2026 · 07:15', driver: 'Hoàng Long', price: '60.000đ', status: 'Đã xác nhận', vehicle: 'car4-petrol', distanceKm: 30 },
    { id: 2, route: 'Hồ Gươm → Sân bay Cát Bi — Hải Phòng', time: '26/09/2026 · 06:30', driver: 'Ngọc Thảo', price: '192.000đ', status: 'Đang chờ', vehicle: 'car4-petrol', distanceKm: 120 }
  ],
  requests: [
    { id: 1, name: 'Duc Anh', route: 'Hồ Gươm → Sân bay Nội Bài — Hà Nội', time: '25/09 · 07:15', status: 'Đang chờ' },
    { id: 2, name: 'Chiến', route: 'Hồ Gươm → Sân bay Cát Bi — Hải Phòng', time: '25/09 · 07:30', status: 'Đang chờ' },
    { id: 3, name: 'Long Chiêu', route: 'Hồ Gươm → Sân bay Vân Đồn — Quảng Ninh', time: '26/09 · 08:00', status: 'Đang chờ' }
  ],
  reports: [
    { id: 1, subject: 'Điểm đón không rõ ràng', type: 'Trải nghiệm chuyến đi', status: 'Mới', date: '23/09/2026' },
    { id: 2, subject: 'Tài xế đến trễ', type: 'Báo cáo chuyến đi', status: 'Đang xử lý', date: '22/09/2026' }
  ],
  zones: [
    { id: 1, name: 'Lăng Chủ tịch Hồ Chí Minh', area: 'Nam Từ Liêm', demand: 'Cao', status: 'Đang hoạt động' },
    { id: 2, name: 'Hồ Gươm', area: 'Mỹ Đình', demand: 'Vừa', status: 'Đang hoạt động' },
    { id: 3, name: 'Nhà văn hóa Thanh Niên', area: 'Hoàn Kiếm', demand: 'Thấp', status: 'Tạm dừng' }
  ],
  users: [
    { id: 1, name: 'Hoàng Long', email: 'long.hoang@example.com', role: 'Người chia sẻ xe', status: 'Hoạt động' },
    { id: 2, name: 'Duc Anh', email: 'duc.anh@example.com', role: 'Hành khách', status: 'Hoạt động' },
    { id: 3, name: 'Chiến', email: 'huy.gia@example.com', role: 'Hành khách', status: 'Hoạt động' }
  ]
};


