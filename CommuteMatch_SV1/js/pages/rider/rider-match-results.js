let currentCriteria = null;

    document.addEventListener("DOMContentLoaded", () => {
      const stored = sessionStorage.getItem("commute_search_criteria");
      if (stored) {
        currentCriteria = JSON.parse(stored);
      } else {
        currentCriteria = {
          origin: "KTX Khu B",
          destination: "ĐH Bách Khoa Cơ Sở 2",
          time: "07:15",
          seats: 1
        };
      }

      document.getElementById("lblRoute").innerHTML = `${currentCriteria.origin} → ${currentCriteria.destination}`;
      document.getElementById("lblTime").innerHTML = currentCriteria.time;
      document.getElementById("lblSeats").innerHTML = `${currentCriteria.seats} người`;

      runMatching();
    });

    async function runMatching() {
      // 1. Hiển thị Loading State
      document.getElementById("aiLoadingState").style.display = "block";
      document.getElementById("aiResultsContainer").style.display = "none";
      document.getElementById("aiEmptyState").style.display = "none";
      document.getElementById("lblAiStatus").innerHTML = "AI Đang Tính Toán...";

      // 2. Chạy hàm AI Engine
      const res = await window.AIEngine.matchTrips(currentCriteria);

      document.getElementById("aiLoadingState").style.display = "none";

      if (res.status === "empty" || res.trips.length === 0) {
        document.getElementById("aiEmptyState").style.display = "block";
        document.getElementById("lblAiStatus").innerHTML = "Không Có Kết Quả";
        return;
      }

      // 3. Hiển thị kết quả AI
      document.getElementById("aiResultsContainer").style.display = "block";
      document.getElementById("lblAiStatus").innerHTML = `Tìm thấy ${res.trips.length} chuyến xe`;
      document.getElementById("aiSummaryText").innerHTML = res.aiSummary;

      renderTripCards(res.trips);
    }

    function renderTripCards(trips) {
      const container = document.getElementById("tripsList");
      container.innerHTML = trips.map(t => `
        <div class="card" style="border-left: 5px solid ${t.matchScore >= 85 ? 'var(--primary)' : 'var(--secondary)'};">
          <div class="card-body">
            <div class="d-grid grid-cols-12 gap-3 items-center">
              <!-- Cột 1: Thông tin lộ trình & Tài xế -->
              <div style="grid-column: span 7;" class="col-12 col-md-7">
                <div class="d-flex items-center gap-2 mb-2">
                  <span class="badge ${t.vehicleType === 'electric' ? 'badge-success' : 'badge-warning'}">
                    ${t.vehicleType === 'electric' ? '<i class="fa-solid fa-bolt" aria-hidden="true"></i> Ô tô điện' : '<i class="fa-solid fa-gas-pump" aria-hidden="true"></i> Ô tô xăng'}
                  </span>
                  <span style="font-size: 0.82rem; color: var(--text-muted);">Khởi hành: <strong>${t.departureTime}</strong> (${t.departureDate})</span>
                </div>

                <div class="font-bold mb-1" style="font-size: 1.15rem; color: var(--text-main);">
                  ${t.origin} <span style="color: var(--primary);">→</span> ${t.destination}
                </div>

                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                  <i class="fa-solid fa-bus-simple" aria-hidden="true"></i> Điểm đón an toàn: <strong>${t.pickupZoneName}</strong>
                </div>

                <!-- Driver snippet -->
                <div class="d-flex items-center gap-2">
                  <div class="avatar" style="width: 32px; height: 32px; background-color: #0d9488; color: white; font-size: 0.8rem;">
                    ${t.driverAvatar || 'TX'}
                  </div>
                  <div style="font-size: 0.88rem;">
                    <a href="account/profile-overview.html?userId=${encodeURIComponent(t.driverId || "")}" style="font-weight:700;">${t.driverName}</a>
                    <span style="color: var(--warning); font-size: 0.8rem;"><i class='fa-solid fa-star' aria-hidden='true'></i> ${t.driverRating}</span>
                  </div>
                  <a href="account/messages-chat.html?userId=${encodeURIComponent(t.driverId || "")}" class="btn btn-outline btn-sm"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> Nhắn tin</a>
                  <span class="text-muted" style="font-size: 0.8rem;">• Còn ${t.availableSeats} chỗ trống</span>
                </div>
              </div>

              <!-- Cột 2: Explainable AI Score & Breakdown -->
              <div style="grid-column: span 5; border-left: 1px solid var(--border-color); padding-left: 1.5rem;" class="col-12 col-md-5">
                <div class="ai-score-box mb-2">
                  <div class="ai-score-number">${t.matchScore}%</div>
                  <div>
                    <div class="font-bold" style="font-size: 0.95rem; color: var(--primary);">${t.matchCategory}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Độ tương thích AI</div>
                  </div>
                  <div style="margin-left: auto; text-align: right;">
                    <div class="font-bold" style="font-size: 1.25rem; color: var(--text-main);">
                      ${(t.costSharing || 12000).toLocaleString('vi-VN')} đ
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">Bù tiền xăng</div>
                  </div>
                </div>

                <!-- Explainability Details Panel -->
                <div style="background-color: var(--bg-muted); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; margin-bottom: 0.75rem;">
                  <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">
                    <i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Vì sao có điểm số này?
                  </div>
                  <ul class="ai-reasons-list" style="margin-top: 0; gap: 0.25rem;">
                    ${t.aiReasons.map(r => `
                      <li class="ai-reason-item" style="font-size: 0.78rem;">
                        <span class="icon">${r.icon}</span>
                        <span>${r.text}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <!-- Actions: User in the loop -->
                <div class="d-flex gap-2">
                  <a href="rider/rider-trip-detail.html?id=${t.id}" class="btn btn-outline btn-sm flex-1">Xem Chi Tiết</a>
                  <a href="rider/rider-booking-confirm.html?tripId=${t.id}" class="btn btn-primary btn-sm flex-1">
                    <i class="fa-solid fa-check" aria-hidden="true"></i> Đặt Chỗ Ngay
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    function relaxSearch() {
      window.Toast.show("Đang mở rộng bán kính tìm kiếm và khung giờ...", "info");
      currentCriteria.origin = "";
      currentCriteria.destination = "";
      runMatching();
    }
