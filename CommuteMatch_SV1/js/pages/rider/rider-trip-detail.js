document.addEventListener("DOMContentLoaded", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tripId = urlParams.get("id") || "trip_101";

      const trip = window.Storage.getById("trips", tripId) || window.Storage.get("trips")[0];
      if (!trip) return;

      document.getElementById("detailDate").innerHTML = trip.departureDate;
      document.getElementById("detailTime").innerHTML = trip.departureTime;
      document.getElementById("detailSeats").innerHTML = `${trip.availableSeats} chỗ trống`;
      document.getElementById("detailCost").innerHTML = `${(trip.costSharing || 12000).toLocaleString('vi-VN')} đ`;
      document.getElementById("detailNotes").innerHTML = trip.notes || "Không có ghi chú thêm.";

      document.getElementById("tripVehicleBadge").innerHTML = trip.vehicleType === 'electric' ? '<i class="fa-solid fa-bolt" aria-hidden="true"></i> Ô tô điện' : '<i class="fa-solid fa-gas-pump" aria-hidden="true"></i> Ô tô xăng';
      document.getElementById("driverName").innerHTML = trip.driverName;
      document.getElementById("driverAvatar").innerHTML = trip.driverAvatar || "TX";
      document.getElementById("driverRating").innerHTML = trip.driverRating || "4.9";
      document.getElementById("driverVehicle").innerHTML = trip.vehicleInfo;
      document.getElementById("driverPlate").innerHTML = (trip.vehicleInfo.match(/\((.*?)\)/) || ['', '59-XX 123.45'])[1];

      // Render timeline points
      const points = trip.routePoints || [trip.origin, trip.destination];
      const timeline = document.getElementById("routeTimeline");
      timeline.innerHTML = points.map((p, idx) => `
        <div style="position: relative;">
          <div style="position: absolute; left: -1.95rem; top: 0.15rem; width: 14px; height: 14px; border-radius: 50%; background-color: ${idx === 0 ? 'var(--primary)' : idx === points.length - 1 ? 'var(--danger)' : 'var(--secondary)'}; border: 2px solid white;"></div>
          <div class="font-bold" style="font-size: 0.92rem;">${p}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${idx === 0 ? 'Điểm xuất phát' : idx === points.length - 1 ? 'Điểm kết thúc' : 'Trạm dừng dọc đường'}</div>
        </div>
      `).join('');

      const bookUrl = `rider/rider-booking-confirm.html?tripId=${trip.id}`;
      document.getElementById("btnBookTop").href = bookUrl;
      document.getElementById("btnBookSide").href = bookUrl;
      const driverProfileUrl = `account/profile-overview.html?userId=${encodeURIComponent(trip.driverId)}`;
      document.getElementById("btnDriverProfile").href = driverProfileUrl;
      document.getElementById("btnMessageDriver").href = `account/messages-chat.html?userId=${encodeURIComponent(trip.driverId)}`;
    });
