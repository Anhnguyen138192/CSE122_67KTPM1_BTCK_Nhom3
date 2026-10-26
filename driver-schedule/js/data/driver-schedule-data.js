/* Sample driver schedule records. Stored per signed-in driver and kept after refresh. */
(function () {
  function localDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function seedDriverSchedule(user) {
    if (!user || !window.Storage) return 0;

    const samples = [
      { key: "morning-campus", offset: 1, time: "07:15", origin: "KTX Khu B ĐHQG (Cổng Sau)", destination: "ĐH Bách Khoa Cơ Sở 2 (Dĩ An)", pickup: "Nhà Văn hóa Sinh viên ĐHQG", vehicle: "VinFast VF 8", vehicleType: "electric", plate: "51H-888.99", seats: 4, cost: 12000, status: "scheduled", notes: "Đón đúng giờ tại sảnh trước." },
      { key: "evening-home", offset: 1, time: "17:30", origin: "ĐH Bách Khoa Cơ Sở 2 (Dĩ An)", destination: "KTX Khu B ĐHQG", pickup: "Cổng chính Cơ sở 2", vehicle: "Toyota Vios", vehicleType: "gasoline", plate: "51K-123.45", seats: 3, cost: 18000, status: "scheduled", notes: "Có thể dừng tại Ngã 3 621." },
      { key: "morning-khtn", offset: 2, time: "07:30", origin: "Làng Đại học – KTX Khu B", destination: "ĐH Khoa học Tự nhiên Cơ sở 2", pickup: "Trạm xe buýt KTX Khu B", vehicle: "VinFast VF e34", vehicleType: "electric", plate: "59X-456.78", seats: 3, cost: 10000, status: "scheduled", notes: "Không hút thuốc trên xe." },
      { key: "afternoon-office", offset: 3, time: "17:45", origin: "Khu Công nghệ cao TP.HCM", destination: "Ngã tư Hàng Xanh", pickup: "Cổng D1 KCNC", vehicle: "Honda City", vehicleType: "gasoline", plate: "50H-246.80", seats: 3, cost: 22000, status: "scheduled", notes: "Khởi hành sau giờ làm." },
      { key: "friday-campus", offset: 4, time: "07:10", origin: "KTX Khu B ĐHQG", destination: "ĐH Bách Khoa Cơ Sở 2", pickup: "Cây xăng gần KTX Khu B", vehicle: "VinFast VF 8", vehicleType: "electric", plate: "51H-888.99", seats: 4, cost: 12000, status: "scheduled", notes: "Vui lòng có mặt trước 5 phút." },
      { key: "completed-yesterday", offset: -1, time: "07:20", origin: "KTX Khu B ĐHQG", destination: "ĐH Bách Khoa Cơ Sở 2", pickup: "Nhà Văn hóa Sinh viên ĐHQG", vehicle: "VinFast VF 8", vehicleType: "electric", plate: "51H-888.99", seats: 4, cost: 12000, status: "completed", notes: "Chuyến đã kết thúc an toàn." },
      { key: "completed-two-days", offset: -2, time: "17:20", origin: "ĐH Bách Khoa Cơ Sở 2", destination: "KTX Khu B ĐHQG", pickup: "Cổng chính Cơ sở 2", vehicle: "Toyota Vios", vehicleType: "gasoline", plate: "51K-123.45", seats: 3, cost: 18000, status: "completed", notes: "Đã trả khách đúng điểm hẹn." },
      { key: "completed-last-week", offset: -5, time: "07:05", origin: "Làng Đại học", destination: "Khu Công nghệ cao TP.HCM", pickup: "Trạm xe buýt KTX Khu B", vehicle: "Honda City", vehicleType: "gasoline", plate: "50H-246.80", seats: 3, cost: 20000, status: "completed", notes: "Chuyến đi đã hoàn thành." },
      { key: "cancelled-weather", offset: 5, time: "08:00", origin: "KTX Khu B ĐHQG", destination: "ĐH Khoa học Tự nhiên Cơ sở 2", pickup: "Cổng sau KTX Khu B", vehicle: "VinFast VF e34", vehicleType: "electric", plate: "59X-456.78", seats: 3, cost: 10000, status: "cancelled", cancelReason: "Thời tiết không thuận lợi", notes: "Chuyến đã hủy." },
      { key: "cancelled-schedule", offset: -3, time: "18:00", origin: "Khu Công nghệ cao TP.HCM", destination: "Ngã tư Hàng Xanh", pickup: "Cổng D1 KCNC", vehicle: "Toyota Vios", vehicleType: "gasoline", plate: "51K-123.45", seats: 3, cost: 22000, status: "cancelled", cancelReason: "Tài xế bận việc đột xuất", notes: "Chuyến đã hủy." }
    ];

    const existingIds = new Set(window.Storage.get("trips").map((trip) => String(trip.id)));
    let inserted = 0;
    samples.forEach((sample) => {
      const id = `schedule_demo_${user.id}_${sample.key}`;
      if (existingIds.has(id)) return;
      window.Storage.insert("trips", {
        id,
        driverId: user.id,
        driverUsername: user.username || "",
        driverName: user.name || "Tài xế CommuteMatch",
        driverAvatar: user.avatar || "TX",
        driverRating: Number(user.rating) || 4.8,
        origin: sample.origin,
        destination: sample.destination,
        departureDate: localDate(sample.offset),
        departureTime: sample.time,
        vehicleInfo: `${sample.vehicle} (${sample.plate})`,
        vehicleType: sample.vehicleType,
        totalSeats: sample.seats,
        availableSeats: sample.seats,
        acceptedSeats: 0,
        costSharing: sample.cost,
        costType: sample.vehicleType === "electric" ? "charging" : "fuel",
        status: sample.status,
        registrationClosed: sample.status !== "scheduled",
        pickupZoneName: sample.pickup,
        routePoints: [sample.origin, sample.destination],
        notes: sample.notes,
        ...(sample.cancelReason ? { cancelReason: sample.cancelReason } : {})
      });
      inserted += 1;
    });
    return inserted;
  }

  window.DriverScheduleData = { seedDriverSchedule };
})();
