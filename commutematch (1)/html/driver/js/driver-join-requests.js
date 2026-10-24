let activeReqTab = 'pending';

    document.addEventListener("DOMContentLoaded", () => window.DriverApi.ready.then(renderRequests));

    function renderRequests() {
      const user = window.Storage.getCurrentUser();
      const ownTrips = window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username);
      const ownTripIds = new Set(ownTrips.map((trip) => String(trip.id)));
      const tripFilter = new URLSearchParams(window.location.search).get("tripId");
      const allRequests = window.Storage.get("joinRequests").filter((request) =>
        ownTripIds.has(String(request.tripId)) && (!tripFilter || String(request.tripId) === tripFilter)
      );
      const pending = allRequests.filter(r => r.status === 'pending');
      const accepted = allRequests.filter(r => r.status === 'accepted');
      const rejected = allRequests.filter(r => r.status === 'rejected' || r.status === 'cancelled');

      document.getElementById("reqCountPending").innerHTML = pending.length;
      document.getElementById("reqCountAccepted").innerHTML = accepted.length;
      document.getElementById("reqCountRejected").innerHTML = rejected.length;

      let list = [];
      if (activeReqTab === 'pending') list = pending;
      else if (activeReqTab === 'accepted') list = accepted;
      else if (activeReqTab === 'rejected') list = rejected;

      const container = document.getElementById("requestsContainer");

      if (list.length === 0) {
        container.innerHTML = `
          <div class="card">
            <div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-users" aria-hidden="true"></i></div>
              <div class="empty-title">Không có yêu cầu nào trong mục này</div>
              <div class="empty-desc">Toàn bộ yêu cầu ghép chuyến của hành khách đã được xử lý xong!</div>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = list.map(req => `
      <div class="card" style="border-left: 4px solid ${
          req.status === 'accepted' ? 'var(--success)' :
          req.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
        };">
          <div class="card-body">
            <div class="d-flex justify-between items-start flex-wrap gap-2 mb-3">
              <div class="d-flex items-center gap-2">
                <div class="avatar" style="width: 48px; height: 48px; font-size: 1.1rem; background-color: #059669; color: white;">
                  ${req.riderAvatar || 'KH'}
                </div>
                <div>
                  <h3 style="font-size: 1.15rem; margin-bottom: 0.2rem;"><a href="account/profile-overview.html?userId=${encodeURIComponent(req.riderId || "")}">${req.riderName}</a></h3>
                  <div style="font-size:0.8rem;color:var(--primary);font-weight:600;">${window.Storage.getById("trips", req.tripId)?.origin || "Chuyến đi"} → ${window.Storage.getById("trips", req.tripId)?.destination || ""} · ${window.Storage.getById("trips", req.tripId)?.departureDate || ""}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">
                    <i class="fa-solid fa-phone" aria-hidden="true"></i> ${req.riderPhone || 'Chưa cung cấp'} • Điểm uy tín: <strong style="color: var(--primary);">98/100</strong>
                  </div>
                </div>
              </div>

              <div class="text-right">
                <span class="badge ${
                  req.status === 'accepted' ? 'badge-success' :
                  req.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                } mb-1">
                  ${req.status === 'accepted' ? 'Đã Chấp Nhận' : req.status === 'rejected' ? 'Đã Từ Chối' : 'Chờ Phê Duyệt'}
                </span>
                <div style="font-size: 0.78rem; color: var(--text-muted);">
                  Thời gian gửi: ${new Date(req.requestTime || Date.now()).toLocaleTimeString('vi-VN')}
                </div>
              </div>
            </div>

            <!-- Details Box -->
            <div style="background-color: var(--bg-muted); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1rem;">
              <div class="d-flex justify-between mb-1">
                <span><i class="fa-solid fa-bus-simple" aria-hidden="true"></i> Điểm đón mong muốn: <strong>${req.pickupPoint}</strong></span>
                <span><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i> Điểm xuống: <strong>${req.dropoffPoint || 'ĐH Bách Khoa CS2'}</strong></span>
              </div>
              <div class="d-flex justify-between text-muted" style="font-size: 0.82rem;">
                <span><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> Lời nhắn: "${req.note || 'Không có lời nhắn'}"</span>
                <span>Đóng góp chi phí: <strong style="color: var(--primary);">${(req.cost || 12000).toLocaleString('vi-VN')} đ</strong></span>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex justify-end gap-2">
              <a href="account/messages-chat.html?userId=${encodeURIComponent(req.riderId || "")}" class="btn btn-outline btn-sm"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> Nhắn tin</a>
              ${req.status === 'pending' ? `
                <button class="btn btn-outline text-danger btn-sm" onclick="handleRejectRequest('${req.id}')">
                  <i class='fa-solid fa-xmark' aria-hidden='true'></i> Từ Chối
                </button>
                <button class="btn btn-primary btn-sm" onclick="handleAcceptRequest('${req.id}')">
                  <i class='fa-solid fa-check' aria-hidden='true'></i> Phê Duyệt Ghép Chuyến
                </button>
              ` : ""}
            </div>
          </div>
        </div>
      `).join('');
    }

    function switchRequestTab(tab, btn) {
      activeReqTab = tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderRequests();
    }

    function handleAcceptRequest(reqId) {
      const all = window.Storage.get("joinRequests");
      const req = all.find(r => r.id === reqId);
      if (!req || req.status !== "pending") return;

      const trip = window.Storage.getById("trips", req.tripId);
      const user = window.Storage.getCurrentUser();
      const isOwnTrip = trip && window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username).some((item) => item.id === trip.id);
      if (!trip || !isOwnTrip || trip.status !== "scheduled" || trip.registrationClosed) {
        window.Toast.show("Chuyến này hiện không nhận thêm hành khách.", "warning");
        return;
      }
      const acceptedSeats = window.DriverTripUtils.getRequests(trip.id)
        .filter(r => r.status === "accepted")
        .reduce((sum, r) => sum + Math.max(1, Number(r.seatsRequested) || 1), 0);
      const requestedSeats = Math.max(1, Number(req.seatsRequested) || 1);
      if (acceptedSeats + requestedSeats > Number(trip.totalSeats || 0)) {
        window.DriverTripUtils.syncSeats(trip.id);
        window.Toast.show("Chuyến đã đủ chỗ. Không thể duyệt thêm yêu cầu.", "warning");
        renderRequests();
        return;
      }

      window.Storage.update("joinRequests", reqId, { status: "accepted", reviewedAt: new Date().toISOString() });
      window.DriverTripUtils.syncSeats(trip.id);

      // Gửi notification cho rider
      window.Storage.insert("notifications", {
        userId: req.riderId,
        title: "Yêu cầu ghép chuyến đã được duyệt",
        message: `Tài xế đã chấp nhận yêu cầu của bạn trên chuyến ${trip.origin} → ${trip.destination}, khởi hành ${trip.departureDate} lúc ${trip.departureTime}. Điểm đón: ${req.pickupPoint}.`,
        time: "Vừa xong",
        createdAt: new Date().toISOString(),
        type: "trip_approved",
        tripId: trip.id,
        unread: true,
        link: "rider-my-trips.html"
      });

      window.Toast.show(`Đã phê duyệt yêu cầu của ${req.riderName}!`, "success");
      renderRequests();
    }

    function handleRejectRequest(reqId) {
      if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;
      const req = window.Storage.getById("joinRequests", reqId);
      if (!req || req.status !== "pending") return;
      const trip = window.Storage.getById("trips", req.tripId);
      const user = window.Storage.getCurrentUser();
      const isOwnTrip = trip && window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username).some((item) => item.id === trip.id);
      if (!trip || !isOwnTrip) {
        window.Toast.show("Bạn không có quyền xử lý yêu cầu của chuyến này.", "error");
        return;
      }
      window.Storage.update("joinRequests", reqId, { status: "rejected", reviewedAt: new Date().toISOString() });
      window.DriverTripUtils.syncSeats(req.tripId);
      window.DriverTripUtils.notifyUsers([req.riderId], {
        tripId: req.tripId,
        title: "Yêu cầu tham gia chuyến chưa được duyệt",
        message: "Tài xế chưa thể nhận bạn vào chuyến này. Bạn có thể tìm chuyến khác phù hợp.",
        type: "trip_request_rejected"
      });
      window.Toast.show("Đã từ chối yêu cầu ghép chuyến.", "info");
      renderRequests();
    }
