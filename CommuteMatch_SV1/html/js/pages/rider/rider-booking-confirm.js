let activeTrip = null;
    let selectedZone = null;

    document.addEventListener("DOMContentLoaded", async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tripId = urlParams.get("tripId") || "trip_101";

      activeTrip = window.Storage.getById("trips", tripId) || window.Storage.get("trips")[0];
      if (!activeTrip) return;

      document.getElementById("summaryDriverName").innerHTML = activeTrip.driverName;
      document.getElementById("summaryVehicle").innerHTML = activeTrip.vehicleInfo;
      document.getElementById("summaryDate").innerHTML = activeTrip.departureDate;
      document.getElementById("summaryTime").innerHTML = activeTrip.departureTime;
      document.getElementById("summaryRoute").innerHTML = `${activeTrip.origin} → ${activeTrip.destination}`;
      document.getElementById("summaryFare").innerHTML = `${(activeTrip.costSharing || 12000).toLocaleString('vi-VN')} đ`;
      document.getElementById("confirmCost").innerHTML = `${(activeTrip.costSharing || 12000).toLocaleString('vi-VN')} đ`;

      // Nạp danh mục trạm đón
      const zones = window.Storage.get("pickupZones");
      const select = document.getElementById("pickupSelect");
      select.innerHTML = zones.map(z => `<option value="${z.id}">${z.name} (${z.area})</option>`).join('');

      // Chạy AI-2 gợi ý điểm đón
      const aiRes = await window.AIEngine.recommendPickupZone("KTX Khu B", activeTrip.origin);
      if (aiRes.success) {
        selectedZone = aiRes.zone;
        document.getElementById("aiZoneName").innerHTML = selectedZone.name;
        document.getElementById("pickupSelect").value = selectedZone.id;
      }
    });

    function acceptAiZone() {
      window.Toast.show("Đã áp dụng trạm đón tối ưu được AI gợi ý!", "success");
      document.getElementById("btnAcceptZone").innerHTML = "<i class='fa-solid fa-check' aria-hidden='true'></i> Đã chọn trạm này";
      document.getElementById("btnAcceptZone").classList.replace("btn-primary", "btn-secondary");
    }

    function toggleManualZone() {
      const el = document.getElementById("manualZoneGroup");
      el.style.display = el.style.display === "none" ? "block" : "none";
    }

    function submitBooking(e) {
      e.preventDefault();
      const currentUser = window.Storage.getCurrentUser();
      const notes = document.getElementById("riderNotes").value.trim();
      const dropoff = document.getElementById("dropoffInput").value.trim();
      const zoneId = document.getElementById("pickupSelect").value;
      const zone = window.Storage.getById("pickupZones", zoneId) || selectedZone;

      const newRequest = {
        id: "req_" + Date.now(),
        tripId: activeTrip.id,
        riderId: currentUser.id,
        riderName: currentUser.name,
        riderPhone: currentUser.phone,
        riderAvatar: currentUser.avatar || "U",
        seatsRequested: 1,
        pickupZoneId: zone ? zone.id : "zone_01",
        pickupPoint: zone ? zone.name : "Trạm đón KTX Khu B",
        dropoffPoint: dropoff,
        status: "pending",
        note: notes || "Không có ghi chú thêm.",
        requestTime: new Date().toISOString(),
        cost: activeTrip.costSharing || 12000
      };

      window.Storage.insert("joinRequests", newRequest);

      // Thêm thông báo giả lập cho tài xế
      window.Storage.insert("notifications", {
        userId: activeTrip.driverId,
        title: "Có yêu cầu ghép chuyến mới! <i class='fa-solid fa-car' aria-hidden='true'></i>",
        message: `${currentUser.name} vừa đặt chỗ chuyến ${activeTrip.origin} lúc ${activeTrip.departureTime}.`,
        time: "Vừa xong",
        type: "join_request",
        unread: true,
        link: "driver/driver-join-requests.html"
      });

      window.Toast.show("Đã gửi yêu cầu ghép chuyến thành công!", "success");

      setTimeout(() => {
        window.location.href = "rider/rider-my-trips.html";
      }, 700);
    }