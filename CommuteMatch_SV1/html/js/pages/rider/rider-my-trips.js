let activeTab = 'pending';
    let targetCancelRequestId = null;

    document.addEventListener("DOMContentLoaded", renderMyTrips);

    function renderMyTrips() {
      const allRequests = window.Storage.get("joinRequests");
      const currentUser = window.Storage.getCurrentUser();

      // Lọc các request của user này
      const userRequests = allRequests.filter(r => r.riderId === currentUser.id || r.riderName === currentUser.name);

      const pending = userRequests.filter(r => r.status === 'pending');
      const accepted = userRequests.filter(r => r.status === 'accepted');
      const completed = userRequests.filter(r => r.status === 'completed');
      const cancelled = userRequests.filter(r => r.status === 'cancelled' || r.status === 'rejected');

      document.getElementById("countPending").innerHTML = pending.length;
      document.getElementById("countAccepted").innerHTML = accepted.length;
      document.getElementById("countCompleted").innerHTML = completed.length;
      document.getElementById("countCancelled").innerHTML = cancelled.length;

      let currentList = [];
      if (activeTab === 'pending') currentList = pending;
      else if (activeTab === 'accepted') currentList = accepted;
      else if (activeTab === 'completed') currentList = completed;
      else if (activeTab === 'cancelled') currentList = cancelled;

      const container = document.getElementById("myTripsList");

      if (currentList.length === 0) {
        container.innerHTML = `
          <div class="card">
            <div class="empty-state">
              <div class="empty-icon"><i class="fa-solid fa-ticket" aria-hidden="true"></i></div>
              <div class="empty-title">Không có chuyến đi nào trong mục này</div>
              <div class="empty-desc">Bạn chưa có chuyến xe nào ở trạng thái này. Khám phá các chuyến đi cùng hướng ngay!</div>
              <a href="rider/rider-trip-search.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Tìm Chuyến Đi Ngay</a>
            </div>
          </div>
        `;
        return;
      }

      const allTrips = window.Storage.get("trips");

      container.innerHTML = currentList.map(req => {
        const trip = allTrips.find(t => t.id === req.tripId) || {
          origin: "KTX Khu B", destination: "ĐH Bách Khoa CS2",
          departureTime: "07:15", departureDate: "2026-10-20",
          driverName: "Trần Minh Quân", vehicleInfo: "VinFast VF 8 (51H-888.99)"
        };

        return `
          <div class="card" style="border-left: 4px solid ${
            req.status === 'accepted' ? 'var(--primary)' :
            req.status === 'completed' ? 'var(--success)' :
            req.status === 'cancelled' ? 'var(--danger)' : 'var(--warning)'
          };">
            <div class="card-body">
              <div class="d-flex justify-between items-start flex-wrap gap-2 mb-2">
                <div>
                  <span class="badge ${
                    req.status === 'accepted' ? 'badge-primary' :
                    req.status === 'completed' ? 'badge-success' :
                    req.status === 'cancelled' ? 'badge-danger' : 'badge-warning'
                  } mb-1">
                    ${
                      req.status === 'accepted' ? 'Đã duyệt • Sắp khởi hành' :
                      req.status === 'completed' ? 'Đã hoàn thành' :
                      req.status === 'cancelled' ? 'Đã hủy' : 'Đang chờ tài xế duyệt'
                    }
                  </span>
                  <h3 style="font-size: 1.15rem; margin: 0.2rem 0;">
                    ${trip.origin} → ${trip.destination}
                  </h3>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">
                    Khởi hành: <strong>${trip.departureTime}</strong> (${trip.departureDate})
                  </div>
                </div>

                <div class="text-right">
                  <div class="font-bold" style="font-size: 1.2rem; color: var(--text-main);">
                    ${(req.cost || 12000).toLocaleString('vi-VN')} đ
                  </div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Chia sẻ chi phí xăng</div>
                </div>
              </div>

              <!-- Pickup info -->
              <div style="background-color: var(--bg-muted); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1rem;">
                <div class="d-flex justify-between mb-1">
                  <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Trạm đón: <strong>${req.pickupPoint || 'Trạm đón KTX Khu B'}</strong></span>
                  <span>Tài xế: <strong>${trip.driverName}</strong></span>
                </div>
                <div class="d-flex justify-between text-muted" style="font-size: 0.8rem;">
                  <span>Phương tiện: ${trip.vehicleInfo}</span>
                  <span>Ghi chú: ${req.note || 'Không có'}</span>
                </div>
              </div>

              <!-- Actions based on Status -->
              <div class="d-flex justify-end gap-2">
                ${req.status === 'accepted' ? `
                  <a href="rider/rider-trip-tracking.html?tripId=${trip.id}" class="btn btn-primary btn-sm"><i class='fa-solid fa-location-dot' aria-hidden='true'></i> Theo Dõi Trực Tiếp</a>
                  <a href="account/messages-chat.html" class="btn btn-outline btn-sm"><i class='fa-solid fa-comment-dots' aria-hidden='true'></i> Nhắn Tin</a>
                  <button class="btn btn-outline btn-sm text-danger" onclick="promptCancelTrip('${req.id}')">Hủy Chuyến</button>
                ` : req.status === 'pending' ? `
                  <button class="btn btn-outline btn-sm text-danger" onclick="promptCancelTrip('${req.id}')">Rút Yêu Cầu</button>
                  <a href="account/messages-chat.html" class="btn btn-outline btn-sm"><i class='fa-solid fa-comment-dots' aria-hidden='true'></i> Nhắc Tài Xế</a>
                ` : req.status === 'completed' ? `
                  <a href="rider/rider-trip-review.html?tripId=${trip.id}&driverId=${trip.driverId}" class="btn btn-primary btn-sm"><i class='fa-solid fa-star' aria-hidden='true'></i> Đánh Giá Chuyến Đi</a>
                  <a href="rider/rider-trip-detail.html?id=${trip.id}" class="btn btn-outline btn-sm">Xem Lại Lộ Trình</a>
                ` : `
                  <a href="rider/rider-trip-search.html" class="btn btn-outline btn-sm">Tìm Chuyến Khác</a>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function switchTripTab(tab, btn) {
      activeTab = tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMyTrips();
    }

    function promptCancelTrip(requestId) {
      targetCancelRequestId = requestId;
      window.Modal.open("cancelModal");
    }

    function confirmCancelTrip() {
      if (!targetCancelRequestId) return;
      const reason = document.getElementById("cancelReason").value;

      window.Storage.update("joinRequests", targetCancelRequestId, {
        status: "cancelled",
        cancelReason: reason
      });

      window.Modal.close("cancelModal");
      window.Toast.show("Đã hủy yêu cầu ghép chuyến.", "info");
      renderMyTrips();
    }