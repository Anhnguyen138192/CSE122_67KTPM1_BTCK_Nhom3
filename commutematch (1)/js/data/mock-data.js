/**
 * COMMUTEMATCH MOCK SEED DATA
 * Học phần: CSE122 - BTL-06 CommuteMatch
 * Chứa dữ liệu hạt giống ban đầu cho toàn bộ hệ thống
 */

window.COMMUTE_MOCK_DATA = {
  // 1. NGƯỜI DÙNG & TÀI KHOẢN (users)
  users: [
    {
      id: "u_rider1",
      name: "Nguyễn Văn An",
      email: "an.nguyen@sinhvien.edu.vn",
      password: "password123", // Mật khẩu thực tế
      phone: "0901 234 567",
      role: "rider",
      roleLabel: "Hành khách",
      avatar: "NA",
      avatarColor: "#059669",
      university: "ĐH Bách Khoa ĐHQG-HCM",
      studentId: "2210045",
      trustScore: 98,
      rating: 4.9,
      tripsCount: 24,
      co2Saved: "42.5 kg",
      moneySaved: "450.000 đ",
      kycStatus: "approved",
      kycDocument: "Thẻ sinh viên Bách Khoa",
      bio: "Sinh viên năm 3 Khoa CNTT, thường đi tuyến KTX Khu B sang Cơ sở 2.",
      joinedDate: "15/09/2023"
    },
    {
      id: "u_driver1",
      name: "Trần Minh Quân",
      email: "quan.tran@sinhvien.edu.vn",
      password: "password123",
      phone: "0912 345 678",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "MQ",
      avatarColor: "#0d9488",
      university: "ĐH Khoa Học Tự Nhiên",
      studentId: "2112089",
      trustScore: 99,
      rating: 4.95,
      tripsCount: 68,
      co2Saved: "112.0 kg",
      earnings: "1.850.000 đ",
      kycStatus: "approved",
      kycDocument: "GPLX A1 + Đăng ký xe",
      bio: "Đi xe Honda Air Blade 2022, có trang bị sẵn nón bảo hiểm sạch sẽ.",
      joinedDate: "10/08/2023",
      vehicle: {
        type: "Xe máy (Air Blade 2022)",
        plate: "59-X3 888.99",
        seatsTotal: 1,
        color: "Đen Nhám"
      }
    },
    {
      id: "u_driver2",
      name: "Lê Hoàng Phúc",
      email: "phuc.le@alumni.edu.vn",
      password: "password123",
      phone: "0988 765 432",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "HP",
      avatarColor: "#2563eb",
      university: "Cựu SV - Kỹ sư Khu Công Nghệ Cao",
      studentId: "NV-KCNC-809",
      trustScore: 97,
      rating: 4.88,
      tripsCount: 42,
      co2Saved: "185.0 kg",
      earnings: "3.200.000 đ",
      kycStatus: "approved",
      kycDocument: "GPLX B2 + Đăng kiểm ô tô",
      bio: "Đi ô tô 4 chỗ từ Ngã Tư Hàng Xanh sang Khu Công Nghệ Cao mỗi sáng.",
      joinedDate: "01/10/2023",
      vehicle: {
        type: "Ô tô 4 chỗ (Vios 2021)",
        plate: "51-K 123.45",
        seatsTotal: 3,
        color: "Trắng"
      }
    },
    {
      id: "u_coord1",
      name: "Đặng Thùy Trang",
      email: "trang.coord@commutematch.edu.vn",
      password: "password123",
      phone: "0933 112 233",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "TT",
      avatarColor: "#7c3aed",
      department: "Ban Quản lý Di chuyển KTX ĐHQG",
      trustScore: 100,
      rating: 5.0,
      reportsResolved: 38,
      kycStatus: "approved",
      bio: "Điều phối viên lưu lượng giao thông & hỗ trợ điểm đón an toàn Làng Đại Học.",
      joinedDate: "01/06/2023"
    },
    {
      id: "u_admin1",
      name: "Ban Quản Trị Hệ Thống",
      email: "admin@commutematch.edu.vn",
      password: "adminpassword",
      phone: "028 3822 9999",
      role: "rider",
      roles: ["rider"],
      roleLabel: "Hành khách",
      avatar: "AD",
      avatarColor: "#dc2626",
      department: "Hội đồng Điều hành Nền tảng CommuteMatch",
      trustScore: 100,
      rating: 5.0,
      kycStatus: "approved",
      bio: "Giám sát an ninh, cấu hình tham số thuật toán và kiểm toán tuân thủ.",
      joinedDate: "01/01/2023"
    },
    {
      id: "u_longchieusigma",
      username: "longchieusigma",
      name: "Long Chieu Sigma",
      email: "longchieusigma@commutematch.local",
      password: "longchieusigma",
      phone: "",
      role: "superadmin",
      roles: ["rider", "driver", "coordinator", "admin", "superadmin"],
      roleLabel: "Super Admin",
      avatar: "LS",
      avatarColor: "#4c1d95",
      university: "CommuteMatch",
      studentId: "longchieusigma",
      trustScore: 90,
      rating: 5.0,
      tripsCount: 0,
      co2Saved: "0.0 kg",
      kycStatus: "pending",
      bio: "Tài khoản mẫu CommuteMatch.",
      joinedDate: "19/10/2026"
    }
  ],

  // 2. CHUYẾN ĐI (trips)
  trips: [
    {
      id: "trip_101",
      driverId: "u_driver1",
      driverName: "Trần Minh Quân",
      driverAvatar: "MQ",
      driverRating: 4.95,
      driverPhone: "0912 345 678",
      vehicleInfo: "Honda Air Blade (59-X3 888.99)",
      vehicleType: "motorbike",
      origin: "KTX Khu B ĐHQG (Cổng Sau)",
      destination: "ĐH Bách Khoa Cơ Sở 2 (Dĩ An)",
      departureTime: "07:15",
      departureDate: "2026-10-20",
      totalSeats: 1,
      availableSeats: 1,
      costSharing: 12000,
      status: "scheduled",
      pickupZoneId: "zone_01",
      pickupZoneName: "Trạm đón KTX Khu B - Cây xăng Petrolimex",
      routePoints: ["KTX Khu B", "Ngã 3 621", "ĐH Khoa Học Tự Nhiên CS2", "ĐH Bách Khoa CS2"],
      notes: "Ưu tiên bạn có mang balo vừa phải, có mũ bảo hiểm sạch sẵn sàng.",
      aiMatchScore: 96,
      createdAt: "2026-10-18T20:00:00Z"
    },
    {
      id: "trip_102",
      driverId: "u_driver2",
      driverName: "Lê Hoàng Phúc",
      driverAvatar: "HP",
      driverRating: 4.88,
      driverPhone: "0988 765 432",
      vehicleInfo: "Toyota Vios 4 chỗ (51-K 123.45)",
      vehicleType: "car",
      origin: "Ngã Tư Hàng Xanh (Bình Thạnh)",
      destination: "Khu Công Nghệ Cao (SHTP) - Vòng xoay Liên Phường",
      departureTime: "07:30",
      departureDate: "2026-10-20",
      totalSeats: 3,
      availableSeats: 2,
      costSharing: 25000,
      status: "scheduled",
      pickupZoneId: "zone_03",
      pickupZoneName: "Trạm Bus Hàng Xanh (Đoạn Cây Điệp)",
      routePoints: ["Hàng Xanh", "Cầu Sài Gòn", "Xa Lộ Hà Nội", "Ngã 4 Thủ Đức", "KCNC"],
      notes: "Xe ô tô máy lạnh, không hút thuốc, dừng trả dọc trục Xa Lộ Hà Nội.",
      aiMatchScore: 89,
      createdAt: "2026-10-18T21:15:00Z"
    },
    {
      id: "trip_103",
      driverId: "u_driver1",
      driverName: "Trần Minh Quân",
      driverAvatar: "MQ",
      driverRating: 4.95,
      driverPhone: "0912 345 678",
      vehicleInfo: "Honda Air Blade (59-X3 888.99)",
      vehicleType: "motorbike",
      origin: "ĐH Khoa Học Tự Nhiên CS Thủ Đức",
      destination: "Ngã Tư Bình Thái - Ga Metro Bình Thái",
      departureTime: "17:15",
      departureDate: "2026-10-20",
      totalSeats: 1,
      availableSeats: 1,
      costSharing: 15000,
      status: "scheduled",
      pickupZoneId: "zone_02",
      pickupZoneName: "Nhà Văn Hóa Sinh Viên ĐHQG (Sảnh Trước)",
      routePoints: ["KHTN CS2", "Vòng xoay ĐHQG", "Suối Tiên", "Ga Metro Bình Thái"],
      notes: "Về chiều tan học, khởi hành đúng 17h15.",
      aiMatchScore: 92,
      createdAt: "2026-10-19T08:30:00Z"
    },
    {
      id: "trip_104",
      driverId: "u_driver2",
      driverName: "Lê Hoàng Phúc",
      driverAvatar: "HP",
      driverRating: 4.88,
      driverPhone: "0988 765 432",
      vehicleInfo: "Toyota Vios 4 chỗ (51-K 123.45)",
      vehicleType: "car",
      origin: "Khu Công Nghệ Cao (SHTP)",
      destination: "Ngã Tư Hàng Xanh / Cầu Thị Nghè",
      departureTime: "18:00",
      departureDate: "2026-10-20",
      totalSeats: 3,
      availableSeats: 3,
      costSharing: 25000,
      status: "scheduled",
      pickupZoneId: "zone_04",
      pickupZoneName: "Cổng KCNC Đường D1 (Trạm xe buýt VinBus)",
      routePoints: ["KCNC Cổng D1", "Ngã 4 Thủ Đức", "Xa Lộ Hà Nội", "Cầu Sài Gòn", "Hàng Xanh"],
      notes: "Chiều về sau giờ làm việc, xe ô tô mát mẻ nghe nhạc nhẹ.",
      aiMatchScore: 85,
      createdAt: "2026-10-19T09:00:00Z"
    },
    {
      id: "trip_105",
      driverId: "u_driver1",
      driverName: "Trần Minh Quân",
      driverAvatar: "MQ",
      driverRating: 4.95,
      driverPhone: "0912 345 678",
      vehicleInfo: "Honda Air Blade (59-X3 888.99)",
      vehicleType: "motorbike",
      origin: "KTX Khu B ĐHQG",
      destination: "ĐH Khoa Học Tự Nhiên CS2",
      departureTime: "07:15",
      departureDate: "2026-10-19",
      totalSeats: 1,
      availableSeats: 0,
      costSharing: 10000,
      status: "completed",
      pickupZoneId: "zone_01",
      pickupZoneName: "Trạm đón KTX Khu B - Cây xăng Petrolimex",
      routePoints: ["KTX Khu B", "ĐH KHTN"],
      notes: "Chuyến đi sáng hôm qua đã hoàn thành an toàn.",
      aiMatchScore: 98,
      createdAt: "2026-10-18T10:00:00Z"
    }
  ],

  // 3. YÊU CẦU THAM GIA / ĐẶT CHỖ (joinRequests)
  joinRequests: [
    {
      id: "req_201",
      tripId: "trip_101",
      riderId: "u_rider1",
      riderName: "Nguyễn Văn An",
      riderPhone: "0901 234 567",
      riderAvatar: "NA",
      seatsRequested: 1,
      pickupZoneId: "zone_01",
      pickupPoint: "Trạm đón KTX Khu B - Cổng phụ",
      dropoffPoint: "ĐH Bách Khoa CS2 (Cổng 1)",
      status: "pending",
      note: "Em chào anh, em đứng sẵn trước sảnh KTX lúc 07:10 ạ.",
      requestTime: "2026-10-19T14:20:00Z",
      cost: 12000
    },
    {
      id: "req_202",
      tripId: "trip_102",
      riderId: "u_rider1",
      riderName: "Nguyễn Văn An",
      riderPhone: "0901 234 567",
      riderAvatar: "NA",
      seatsRequested: 1,
      pickupZoneId: "zone_03",
      pickupPoint: "Trạm Bus Hàng Xanh",
      dropoffPoint: "Ngã tư Thủ Đức (Cổng SPKT)",
      status: "accepted",
      note: "Em xin đi nhờ đoạn sang trường SPKT ạ.",
      requestTime: "2026-10-19T11:00:00Z",
      cost: 25000
    },
    {
      id: "req_203",
      tripId: "trip_105",
      riderId: "u_rider1",
      riderName: "Nguyễn Văn An",
      riderPhone: "0901 234 567",
      riderAvatar: "NA",
      seatsRequested: 1,
      pickupZoneId: "zone_01",
      pickupPoint: "KTX Khu B",
      dropoffPoint: "ĐH KHTN CS2",
      status: "completed",
      note: "Chuyến đi đã xong suôn sẻ.",
      requestTime: "2026-10-18T19:00:00Z",
      cost: 10000
    }
  ],

  roleApplications: [],

  // 4. ĐIỂM ĐÓN CỘNG ĐỒNG AN TOÀN (pickupZones)
  pickupZones: [
    {
      id: "zone_01",
      name: "Trạm đón KTX Khu B - Cổng phụ Cây Xăng",
      area: "ĐHQG TP.HCM",
      address: "Đường Lưu Hữu Phước, Phường Đông Hòa, Dĩ An, Bình Dương",
      coordinates: "10.8805, 106.7820",
      hasSidewalk: true,
      hasLighting: true,
      hasCCTV: true,
      capacity: 15,
      status: "active",
      safetyScore: 9.8,
      notes: "Vỉa hè rộng 4m, có đèn LED cao áp và camera an ninh KTX, rất an toàn buổi sớm/tối."
    },
    {
      id: "zone_02",
      name: "Nhà Văn Hóa Sinh Viên ĐHQG (Sảnh Trước)",
      area: "ĐHQG TP.HCM",
      address: "Khu Đô thị ĐHQG-HCM, TP.Thủ Đức",
      coordinates: "10.8752, 106.8015",
      hasSidewalk: true,
      hasLighting: true,
      hasCCTV: true,
      capacity: 25,
      status: "active",
      safetyScore: 9.9,
      notes: "Khu vực sảnh có mái che mưa nắng, có bảo vệ túc trực 24/7."
    },
    {
      id: "zone_03",
      name: "Trạm Bus Hàng Xanh (Hướng Cầu Sài Gòn)",
      area: "Quận Bình Thạnh",
      address: "178 Điện Biên Phủ, Phường 21, Bình Thạnh",
      coordinates: "10.7998, 106.7118",
      hasSidewalk: true,
      hasLighting: true,
      hasCCTV: false,
      capacity: 12,
      status: "active",
      safetyScore: 8.9,
      notes: "Điểm đón đông người, cần chú ý quan sát xe cộ khi dừng đỗ."
    },
    {
      id: "zone_04",
      name: "Cổng KCNC Đường D1 (Trạm VinBus)",
      area: "Khu Công Nghệ Cao Thủ Đức",
      address: "Đường D1, Phường Tân Phú, TP.Thủ Đức",
      coordinates: "10.8540, 106.7925",
      hasSidewalk: true,
      hasLighting: true,
      hasCCTV: true,
      capacity: 20,
      status: "active",
      safetyScore: 9.5,
      notes: "Điểm dừng chuyên dụng cho xe đưa đón và đi chung, có biển báo nhận diện."
    },
    {
      id: "zone_05",
      name: "Cổng Trường ĐH Sư Phạm Kỹ Thuật (Võ Văn Ngân)",
      area: "TP.Thủ Đức",
      address: "01 Võ Văn Ngân, Phường Linh Chiểu, TP.Thủ Đức",
      coordinates: "10.8512, 106.7720",
      hasSidewalk: true,
      hasLighting: true,
      hasCCTV: true,
      capacity: 10,
      status: "active",
      safetyScore: 9.2,
      notes: "Gần ngã tư Thủ Đức và ga Metro tương lai."
    }
  ],

  // 5. BÁO CÁO SỰ CỐ & KHIẾU NẠI (reports)
  reports: [
    {
      id: "rep_301",
      tripId: "trip_102",
      reporterId: "u_rider1",
      reporterName: "Nguyễn Văn An",
      reportedUserId: "u_driver2",
      reportedUserName: "Lê Hoàng Phúc",
      type: "delay",
      title: "Tài xế trễ hẹn 15 phút không báo trước",
      description: "Tài xế hẹn 07:30 nhưng đến 07:45 mới tới trạm đón, làm em suýt trễ giờ thi môn Kiến trúc máy tính.",
      status: "investigating",
      priority: "medium",
      coordinatorNotes: "Đã liên hệ tài xế Hoàng Phúc. Lý do kẹt xe cầu Sài Gòn đột xuất. Nhắc nhở tài xế cần nhắn tin trước trên hệ thống.",
      createdAt: "2026-10-19T08:15:00Z"
    },
    {
      id: "rep_302",
      tripId: "trip_105",
      reporterId: "u_driver1",
      reporterName: "Trần Minh Quân",
      reportedUserId: "u_rider1",
      type: "lost_item",
      title: "Hành khách để quên tài liệu học tập",
      description: "Sau chuyến đi hôm qua, em phát hiện bạn khách để quên một bìa sơ mi tài liệu môn Giải tích.",
      status: "resolved",
      priority: "low",
      coordinatorNotes: "Đã kết nối hai bạn qua khung chat nội bộ, bạn An đã nhận lại tài liệu tại cổng KTX.",
      createdAt: "2026-10-18T18:00:00Z"
    }
  ],

  // 6. ĐÁNH GIÁ & PHẢN HỒI (ratings)
  ratings: [
    {
      id: "rate_401",
      tripId: "trip_105",
      fromUserId: "u_rider1",
      fromUserName: "Nguyễn Văn An",
      toUserId: "u_driver1",
      toUserName: "Trần Minh Quân",
      stars: 5,
      tags: ["Đúng giờ", "Lái xe an toàn", "Nón bảo hiểm sạch"],
      comment: "Anh Quân chạy rất cẩn thận, đúng giờ hẹn từng phút, nói chuyện thân thiện. Rất đề xuất cho các bạn sinh viên!",
      date: "2026-10-19"
    },
    {
      id: "rate_402",
      tripId: "trip_105",
      fromUserId: "u_driver1",
      fromUserName: "Trần Minh Quân",
      toUserId: "u_rider1",
      toUserName: "Nguyễn Văn An",
      stars: 5,
      tags: ["Đúng giờ", "Lịch sự", "Đứng đúng điểm hẹn"],
      comment: "Bạn An chuẩn bị sẵn sàng, ra điểm hẹn trước 5 phút giúp chuyến đi xuất phát rất chuẩn giờ.",
      date: "2026-10-19"
    }
  ],

  // 7. CẤU HÌNH THAM SỐ HỆ THỐNG (settings)
  settings: {
    maxFarePerKm: 3500,
    maxFareCarPerKm: 8000,
    maxDetourRadiusKm: 2.5,
    minTrustScoreToShare: 80,
    aiWeightRouteMatch: 50,
    aiWeightTimeDelta: 30,
    aiWeightDriverRating: 20,
    platformStatus: "operational",
    allowRecurringTrips: true
  },

  // 8. THÔNG BÁO HỆ THỐNG (notifications)
  notifications: [
    {
      id: "notif_01",
      userId: "u_rider1",
      title: "Yêu cầu ghép chuyến được chấp nhận! 🎉",
      message: "Tài xế Lê Hoàng Phúc đã phê duyệt yêu cầu chuyến Ngã Tư Hàng Xanh -> Khu Công Nghệ Cao lúc 07:30.",
      time: "15 phút trước",
      type: "trip_approved",
      unread: true,
      link: "rider-my-trips.html"
    },
    {
      id: "notif_02",
      userId: "u_driver1",
      title: "Có yêu cầu ghép chuyến mới 🚗",
      message: "Nguyễn Văn An gửi yêu cầu tham gia chuyến KTX Khu B lúc 07:15 sáng mai.",
      time: "2 giờ trước",
      type: "join_request",
      unread: true,
      link: "driver-join-requests.html"
    },
    {
      id: "notif_03",
      userId: "u_rider1",
      title: "Khuyến cáo an toàn giờ cao điểm ⚠️",
      message: "Trục Xa Lộ Hà Nội đoạn Ngã 4 Bình Thái đang thi công, hãy chọn điểm đón Nhà Văn Hóa Sinh Viên để tránh kẹt xe.",
      time: "1 ngày trước",
      type: "safety_alert",
      unread: false,
      link: "safety-guidelines.html"
    }
  ],

  // 9. TIN NHẮN MOCK (messages)
  messages: [
    {
      id: "msg_01",
      senderId: "u_rider1",
      senderName: "Nguyễn Văn An",
      receiverId: "u_driver1",
      text: "Em chào anh Quân, sáng mai 07:15 mình gặp ở cây xăng KTX Khu B đúng không ạ?",
      timestamp: "19:30"
    },
    {
      id: "msg_02",
      senderId: "u_driver1",
      senderName: "Trần Minh Quân",
      receiverId: "u_rider1",
      text: "Đúng rồi An nhé, anh đi Air Blade đen nhám biển 888.99, anh sẽ đến trước 5 phút.",
      timestamp: "19:32"
    },
    {
      id: "msg_03",
      senderId: "u_rider1",
      senderName: "Nguyễn Văn An",
      receiverId: "u_driver1",
      text: "Dạ vâng anh, em có mặt sẵn sàng ở cổng ạ!",
      timestamp: "19:33"
    }
  ],

  // 10. NHẬT KÝ HỆ THỐNG / AUDIT LOGS (auditLogs)
  auditLogs: [
    {
      id: "log_01",
      timestamp: "2026-10-19 18:42:10",
      user: "Nguyễn Văn An (Rider)",
      action: "TÌM CHUYẾN",
      details: "Tìm kiếm tuyến KTX Khu B -> ĐH Bách Khoa CS2, AI gợi ý trip_101 (Match 96%)",
      status: "SUCCESS"
    },
    {
      id: "log_02",
      timestamp: "2026-10-19 16:10:05",
      user: "Lê Hoàng Phúc (Driver)",
      action: "DUYỆT YÊU CẦU",
      details: "Chấp thuận yêu cầu req_202 cho hành khách Nguyễn Văn An",
      status: "SUCCESS"
    },
    {
      id: "log_03",
      timestamp: "2026-10-19 14:05:22",
      user: "Đặng Thùy Trang (Coordinator)",
      action: "CẬP NHẬT TRẠM ĐÓN",
      details: "Nâng cấp chỉ số an toàn trạm zone_01 (KTX Khu B) lên 9.8 sau khi gắn đèn LED cao áp",
      status: "SUCCESS"
    },
    {
      id: "log_04",
      timestamp: "2026-10-19 09:12:44",
      user: "Ban Quản Trị Hệ Thống (Admin)",
      action: "DUYỆT KYC",
      details: "Phê duyệt hồ sơ GPLX & Đăng ký xe tài xế Trần Minh Quân",
      status: "SUCCESS"
    }
  ]
};
