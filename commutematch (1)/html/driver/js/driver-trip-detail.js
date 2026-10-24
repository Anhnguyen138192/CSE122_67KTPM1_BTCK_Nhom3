let activeTrip = null;

    document.addEventListener("DOMContentLoaded", () => window.DriverApi.ready.then(loadTripDetail));

    function loadTripDetail() {
      const urlParams = new URLSearchParams(window.location.search);
      const tripId = urlParams.get("id");
      const user = window.Storage.getCurrentUser();

      activeTrip = tripId && window.Storage.getById("trips", tripId);
      const ownTrip = activeTrip && window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username).some((trip) => trip.id === activeTrip.id);
      if (!activeTrip || !ownTrip) {
        window.Toast.show("Không tìm thấy chuyến xe thuộc tài khoản tài xế này.", "error");
        window.location.href = "driver/driver-schedule.html";
        return;
      }
      activeTrip = window.DriverTripUtils.syncSeats(activeTrip.id) || activeTrip;

      document.getElementById("dtTripRoute").innerHTML = `${activeTrip.origin} → ${activeTrip.destination}`;
      document.getElementById("dtTripDate").innerHTML = activeTrip.departureDate;
      document.getElementById("dtTripTime").innerHTML = activeTrip.departureTime;
      document.getElementById("dtTotalSeats").innerHTML = `${activeTrip.totalSeats} chỗ`;
      document.getElementById("dtAvailSeats").innerHTML = `${activeTrip.availableSeats} chỗ`;
      document.getElementById("dtFare").innerHTML = `${(activeTrip.costSharing || 12000).toLocaleString('vi-VN')} đ`;
      document.querySelector("#dtFare").previousElementSibling.textContent = window.DriverTripUtils.costLabel(activeTrip.vehicleType);
      document.getElementById("dtPickupName").innerHTML = activeTrip.pickupZoneName || "Trạm đón KTX Khu B";
      document.getElementById("dtVehicle").innerHTML = activeTrip.vehicleInfo;

      document.getElementById("btnGoExecution").href = `driver/driver-trip-execution.html?id=${activeTrip.id}`;
      document.getElementById("badgeTripStatus").textContent = activeTrip.status === "cancelled" ? "Đã hủy" : activeTrip.status === "completed" ? "Đã hoàn thành" : activeTrip.registrationClosed ? "Tạm khóa đăng ký" : "Đang mở đăng ký";
      document.getElementById("btnToggleSeats").innerHTML = activeTrip.registrationClosed
        ? "<i class='fa-solid fa-lock-open' aria-hidden='true'></i> Mở Lại Nhận Khách"
        : "<i class='fa-solid fa-lock' aria-hidden='true'></i> Tạm Khóa Đăng Ký Chỗ";

      // Render accepted passengers
      renderPassengers();
    }

    function renderPassengers() {
      const requests = window.Storage.get("joinRequests").filter(
        r => r.tripId === activeTrip.id && (r.status === 'accepted' || r.status === 'pending')
      );

      const container = document.getElementById("passengersListContainer");
      document.getElementById("passengersCountBadge").innerHTML = `${requests.length} người`;

      if (requests.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="padding: 2rem 1rem;">
            <div style="font-size: 0.88rem; color: var(--text-muted);">Chưa có hành khách nào tham gia chuyến này.</div>
          </div>
        `;
        return;
      }

      container.innerHTML = requests.map(r => `
        <div style="padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;">
          <div class="d-flex items-center gap-2">
            <div class="avatar" style="width: 40px; height: 40px; background-color: #059669; color: white;">${r.riderAvatar || 'KH'}</div>
            <div>
              <div class="font-bold" style="font-size: 0.95rem;">${r.riderName}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);"><i class="fa-solid fa-phone" aria-hidden="true"></i> ${r.riderPhone || 'Chưa cung cấp'}</div>
              <div style="font-size: 0.78rem; color: var(--primary);">Đón: ${r.pickupPoint}</div>
            </div>
          </div>
          <div class="text-right">
            <span class="badge ${r.status === 'accepted' ? 'badge-success' : 'badge-warning'} mb-1" style="font-size: 0.72rem;">
              ${r.status === 'accepted' ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
            <div>
              <a href="account/messages-chat.html" class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> Nhắn tin</a>
            </div>
          </div>
        </div>
      `).join('');
    }

    function toggleSeatRegistration() {
      if (activeTrip.status !== "scheduled") return;
      const closing = !activeTrip.registrationClosed;
      activeTrip = window.DriverTripUtils.syncSeats(activeTrip.id, { closed: closing });
      window.DriverTripUtils.notifyTripPassengers(activeTrip, {
        title: closing ? "Tài xế tạm khóa đăng ký chuyến" : "Tài xế đã mở lại đăng ký chuyến",
        message: closing
          ? `Chuyến ${activeTrip.origin} → ${activeTrip.destination} tạm ngừng nhận thêm yêu cầu. Các chỗ đã được duyệt vẫn được giữ.`
          : `Chuyến ${activeTrip.origin} → ${activeTrip.destination} đã nhận yêu cầu tham gia trở lại.`,
        type: "trip_seat_registration_updated"
      });
      document.getElementById("dtAvailSeats").innerHTML = `${activeTrip.availableSeats} chỗ`;
      document.getElementById("badgeTripStatus").textContent = closing ? "Tạm khóa đăng ký" : "Đang mở đăng ký";
      document.getElementById("btnToggleSeats").innerHTML = closing ? "<i class='fa-solid fa-lock-open' aria-hidden='true'></i> Mở Lại Nhận Khách" : "<i class='fa-solid fa-lock' aria-hidden='true'></i> Tạm Khóa Đăng Ký Chỗ";
      window.Toast.show(closing ? "Đã tạm khóa nhận khách." : "Đã mở lại đăng ký.", "info");
    }
