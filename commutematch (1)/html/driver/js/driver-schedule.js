let filterStatus = 'scheduled';
    let cancelTripId = null;

    document.addEventListener("DOMContentLoaded", () => window.DriverApi.ready.then(renderSchedule));

    function renderSchedule() {
      const allTrips = window.Storage.get("trips");
      const user = window.Storage.getCurrentUser();

      // Lọc các chuyến xe của tài xế này
      const myTrips = window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username)
        .map(t => window.DriverTripUtils.syncSeats(t.id) || t);

      const sched = myTrips.filter(t => t.status === 'scheduled');
      const comp = myTrips.filter(t => t.status === 'completed');
      const canc = myTrips.filter(t => t.status === 'cancelled');

      document.getElementById("countSched").innerHTML = sched.length;
      document.getElementById("countComp").innerHTML = comp.length;
      document.getElementById("countCanc").innerHTML = canc.length;

      let list = [];
      if (filterStatus === 'scheduled') list = sched;
      else if (filterStatus === 'completed') list = comp;
      else if (filterStatus === 'cancelled') list = canc;

      const container = document.getElementById("scheduleContainer");

      if (list.length === 0) {
        container.innerHTML = `
          <div class="card">
            <div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-calendar-days" aria-hidden="true"></i></div>
              <div class="empty-title">Không có chuyến xe nào trong mục này</div>
              <div class="empty-desc">Bạn chưa có lịch trình nào trong trạng thái này. Hãy đăng chuyến đi mới để kết nối bạn đồng hành!</div>
              <a href="driver/driver-trip-create.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-plus" aria-hidden="true"></i> Đăng Chuyến Đi Mới</a>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = list.map(t => `
        <div class="card" style="border-left: 4px solid ${
          t.status === 'scheduled' ? 'var(--primary)' :
          t.status === 'completed' ? 'var(--success)' : 'var(--danger)'
        };">
          <div class="card-body">
            <div class="d-flex justify-between items-start flex-wrap gap-2 mb-2">
              <div>
                <span class="badge ${
                  t.status === 'scheduled' ? 'badge-primary' :
                  t.status === 'completed' ? 'badge-success' : 'badge-danger'
                } mb-1">
                  ${t.status === 'scheduled' ? 'Sắp khởi hành' : t.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                </span>
                <h3 style="font-size: 1.15rem; margin: 0.2rem 0;">
                  ${t.origin} → ${t.destination}
                </h3>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                  <i class="fa-solid fa-calendar-days" aria-hidden="true"></i> Ngày đi: <strong>${t.departureDate}</strong> • Giờ xuất phát: <strong style="color: var(--primary);">${t.departureTime}</strong>
                </div>
              </div>

              <div class="text-right">
                <div class="font-bold" style="font-size: 1.25rem; color: var(--text-main);">
                  ${(t.costSharing || 12000).toLocaleString('vi-VN')} đ
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${window.DriverTripUtils.costLabel(t.vehicleType)}</div>
              </div>
            </div>

            <div style="background-color: var(--bg-muted); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1rem;">
              <div class="d-flex justify-between mb-1">
                <span><i class="fa-solid fa-bus-simple" aria-hidden="true"></i> Điểm đón: <strong>${t.pickupZoneName || 'Trạm đón KTX Khu B'}</strong></span>
                <span>Chỗ trống: <strong>${t.availableSeats} / ${t.totalSeats} ghế</strong></span>
              </div>
              <div class="d-flex justify-between text-muted" style="font-size: 0.8rem;">
                <span>Phương tiện: ${t.vehicleInfo}</span>
                <span>Ghi chú: ${t.notes || 'Không có'}</span>
              </div>
            </div>

            <div class="d-flex justify-end gap-2">
              ${t.status === 'scheduled' ? `
                <a href="driver/driver-trip-execution.html?id=${t.id}" class="btn btn-secondary btn-sm"><i class='fa-solid fa-traffic-light' aria-hidden='true'></i> Điều Hành Chuyến Đi</a>
                <a href="driver/driver-trip-detail.html?id=${t.id}" class="btn btn-outline btn-sm">Chi Tiết & Khách</a>
                <button class="btn btn-outline btn-sm text-danger" onclick="promptCancelTrip('${t.id}')">Hủy Chuyến</button>
              ` : `
                <a href="driver/driver-trip-detail.html?id=${t.id}" class="btn btn-outline btn-sm">Xem Lại Lịch Sử</a>
              `}
            </div>
          </div>
        </div>
      `).join('');
    }

    function switchFilter(st, btn) {
      filterStatus = st;
      document.querySelectorAll(".driver-schedule-tabs .tab-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      renderSchedule();
    }

    function promptCancelTrip(tripId) {
      cancelTripId = tripId;
      window.Modal.open("driverCancelModal");
    }

    function confirmDriverCancel() {
      if (!cancelTripId) return;
      const reason = document.getElementById("driverCancelReason").value;
      const trip = window.Storage.getById("trips", cancelTripId);
      if (!trip || trip.status !== "scheduled") return;

      window.DriverTripUtils.notifyTripPassengers(trip, {
        title: "Chuyến đi đã bị hủy",
        message: `Tài xế đã hủy chuyến ${trip.origin} → ${trip.destination} khởi hành ${trip.departureDate} lúc ${trip.departureTime}. Lý do: ${reason}.`,
        type: "trip_cancelled"
      });

      window.Storage.update("trips", cancelTripId, {
        status: "cancelled",
        cancelReason: reason,
        cancelledAt: new Date().toISOString(),
        registrationClosed: true
      });
      window.DriverTripUtils.getRequests(cancelTripId)
        .filter(request => request.status === "accepted" || request.status === "pending")
        .forEach(request => window.Storage.update("joinRequests", request.id, {
          status: "cancelled",
          cancelReason: "Chuyến xe đã bị tài xế hủy",
          updatedAt: new Date().toISOString()
        }));
      window.DriverTripUtils.syncSeats(cancelTripId, { closed: true });

      window.Modal.close("driverCancelModal");
      window.Toast.show("Đã hủy chuyến đi thành công.", "info");
      renderSchedule();
      document.querySelector(".driver-schedule-tabs .tab-btn[aria-pressed='true']")?.focus();
    }
