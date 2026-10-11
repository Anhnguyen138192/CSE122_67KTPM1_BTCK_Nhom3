window.CommuteMatchMockData = {
  trips: [
    { id: 1, route: 'Mỹ Đình → Đại học Quốc gia Hà Nội', time: '25/09/2026 · 07:15', driver: 'Hoàng Long', price: '25.000đ', status: 'Đã xác nhận' },
    { id: 2, route: 'Cầu Giấy → Đại học Quốc gia Hà Nội', time: '26/09/2026 · 07:30', driver: 'Ngọc Thảo', price: '20.000đ', status: 'Đang chờ' }
  ],
  requests: [
    { id: 1, name: 'Duc Anh', route: 'Mỹ Đình → Đại học Quốc gia Hà Nội', time: '25/09 · 07:15', status: 'Đang chờ' },
    { id: 2, name: 'Chiến', route: 'Nam Từ Liêm → Đại học Quốc gia Hà Nội', time: '25/09 · 07:30', status: 'Đang chờ' },
    { id: 3, name: 'Long Chiêu', route: 'Ba Đình → Đại học Quốc gia Hà Nội', time: '26/09 · 08:00', status: 'Đang chờ' }
  ],
  reports: [
    { id: 1, subject: 'Điểm đón không rõ ràng', type: 'Trải nghiệm chuyến đi', status: 'Mới', date: '23/09/2026' },
    { id: 2, subject: 'Tài xế đến trễ', type: 'Báo cáo chuyến đi', status: 'Đang xử lý', date: '22/09/2026' }
  ],
  zones: [
    { id: 1, name: 'Cổng chính Đại học Quốc gia Hà Nội', area: 'Nam Từ Liêm', demand: 'Cao', status: 'Đang hoạt động' },
    { id: 2, name: 'Ngã tư Cầu Giấy', area: 'Mỹ Đình', demand: 'Vừa', status: 'Đang hoạt động' },
    { id: 3, name: 'Nhà văn hóa Thanh Niên', area: 'Hoàn Kiếm', demand: 'Thấp', status: 'Tạm dừng' }
  ],
  users: [
    { id: 1, name: 'Hoàng Long', email: 'long.hoang@example.com', role: 'Người chia sẻ xe', status: 'Hoạt động' },
    { id: 2, name: 'Duc Anh', email: 'duc.anh@example.com', role: 'Hành khách', status: 'Hoạt động' },
    { id: 3, name: 'Chiến', email: 'huy.gia@example.com', role: 'Hành khách', status: 'Hoạt động' }
  ]
};


