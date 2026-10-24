document.addEventListener("DOMContentLoaded", () => window.DriverApi.ready.then(loadDriverDashboard));

function loadDriverDashboard() {
  const user = window.Storage.getCurrentUser();
  if (!user) return;
  const trips = window.DriverTripUtils.getDriverTrips(user.id, user.name, user.username);
  const tripIds = new Set(trips.map((trip) => String(trip.id)));
  const requests = window.Storage.get("joinRequests").filter((request) => tripIds.has(String(request.tripId)));
  const completed = trips.filter((trip) => trip.status === "completed");
  const accepted = requests.filter((request) => request.status === "accepted" && request.paymentStatus === "received" && completed.some((trip) => trip.id === request.tripId));
  const amount = accepted.reduce((sum, request) => {
    const trip = trips.find((item) => item.id === request.tripId);
    return sum + (Number(trip?.costSharing) || Number(request.cost) || 0) * Math.max(1, Number(request.seatsRequested) || 1);
  }, 0);
  const scheduled = trips.filter((trip) => trip.status === "scheduled");
  const seatTotal = scheduled.reduce((sum, trip) => sum + Math.max(0, Number(trip.totalSeats) || 0), 0);
  const seatFilled = requests.filter((request) => request.status === "accepted" && scheduled.some((trip) => trip.id === request.tripId))
    .reduce((sum, request) => sum + Math.max(1, Number(request.seatsRequested) || 1), 0);
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  document.getElementById("dashDriverName").textContent = user.name;
  document.getElementById("statEarnings").textContent = `${amount.toLocaleString("vi-VN")} đ`;
  document.getElementById("statDriverTrips").textContent = trips.length;
  document.getElementById("statDriverRating").textContent = user.rating ? `${Number(user.rating).toFixed(2)} / 5.0` : "Chưa có đánh giá";
  document.getElementById("statSeatFill").textContent = `${seatTotal ? Math.round(seatFilled / seatTotal * 100) : 0}%`;

  const receivedRequests = requests.filter((request) => request.status === "accepted" && request.paymentStatus === "received");
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
  const chartValues = weekDays.map((date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return receivedRequests.filter((request) => {
      const trip = trips.find((item) => item.id === request.tripId);
      const paidDate = request.paymentReceivedAt || trip?.completedAt || "";
      return paidDate.slice(0, 10) === key;
    }).reduce((sum, request) => {
      const trip = trips.find((item) => item.id === request.tripId);
      return sum + (Number(trip?.costSharing) || Number(request.cost) || 0) * Math.max(1, Number(request.seatsRequested) || 1);
    }, 0);
  });
  const chartMax = Math.max(1, ...chartValues);
  document.getElementById("driverWeeklyChart").innerHTML = weekDays.map((date, index) => {
    const amount = chartValues[index];
    const height = amount ? Math.max(8, Math.round(amount / chartMax * 100)) : 3;
    return `<div title="${date.toLocaleDateString("vi-VN")}: ${amount.toLocaleString("vi-VN")} đ" style="display:flex;flex:1;min-width:0;flex-direction:column;justify-content:flex-end;align-items:center;gap:.45rem;height:180px">
      <span style="font-size:.7rem;color:var(--text-muted);white-space:nowrap">${amount ? `${(amount / 1000).toLocaleString("vi-VN")}k` : "—"}</span>
      <div style="height:130px;width:100%;display:flex;align-items:flex-end;justify-content:center"><span style="display:block;width:min(34px,75%);height:${height}%;min-height:3px;border-radius:8px 8px 3px 3px;background:linear-gradient(180deg,var(--secondary),var(--primary));opacity:${amount ? 1 : 0.2}"></span></div>
      <small style="font-size:.72rem;color:var(--text-muted)">${date.toLocaleDateString("vi-VN", { weekday: "short" })}</small>
    </div>`;
  }).join("");

  const pending = requests.filter((request) => request.status === "pending");
  document.getElementById("requestsSnippet").innerHTML = pending.length ? pending.slice(0, 4).map((request) => `
    <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;gap:.75rem">
      <div class="d-flex items-center gap-2"><div class="avatar">${escape(request.riderAvatar || "KH")}</div><div><div class="font-bold">${escape(request.riderName || "Hành khách")}</div><div style="font-size:.78rem;color:var(--text-muted)">Đón tại: ${escape(request.pickupPoint || "Chưa chọn")}</div></div></div>
      <a href="driver/driver-join-requests.html" class="btn btn-primary btn-sm">Xem &amp; Duyệt</a>
    </div>`).join("") : '<div class="empty-state" style="padding:1.5rem"><div style="font-size:.88rem;color:var(--text-muted)">Không có yêu cầu nào đang chờ duyệt.</div></div>';

  const now = new Date();
  const localNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const upcoming = scheduled.filter((trip) => `${trip.departureDate || ""}T${trip.departureTime || "00:00"}` >= localNow).sort((a, b) => `${a.departureDate}T${a.departureTime}`.localeCompare(`${b.departureDate}T${b.departureTime}`));
  const next = upcoming[0];
  const nextCard = document.querySelector("#nextTripRoute")?.closest(".card");
  if (!next) {
    if (nextCard) nextCard.innerHTML = '<div class="card-body"><div class="empty-title">Chưa có chuyến sắp chạy</div><p class="empty-desc">Tạo chuyến mới hoặc lưu lịch trình lặp lại để bắt đầu.</p></div>';
  } else {
    const date = new Date(`${next.departureDate}T${next.departureTime || "00:00"}`).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
    const tripRequests = requests.filter((request) => request.tripId === next.id);
    document.getElementById("nextTripRoute").textContent = `${next.origin} → ${next.destination}`;
    document.getElementById("nextTripDeparture").innerHTML = `Khởi hành: <strong>${escape(date)}</strong>`;
    document.getElementById("nextTripPickup").textContent = next.pickupZoneName || next.origin;
    document.getElementById("nextTripSeats").textContent = `Còn ${Number(next.availableSeats) || 0} / ${Number(next.totalSeats) || 0} chỗ`;
    document.getElementById("nextTripCost").textContent = `${window.DriverTripUtils.costLabel(next.vehicleType)}: ${(Number(next.costSharing) || 0).toLocaleString("vi-VN")} đ`;
    document.getElementById("nextTripRequests").textContent = `${tripRequests.filter((request) => request.status === "pending").length} yêu cầu chờ duyệt`;
    document.getElementById("nextTripExecution").href = `driver/driver-trip-execution.html?id=${encodeURIComponent(next.id)}`;
    document.getElementById("nextTripReview").href = `driver/driver-join-requests.html?tripId=${encodeURIComponent(next.id)}`;
    document.getElementById("nextTripReview").innerHTML = `<i class="fa-solid fa-users" aria-hidden="true"></i> Duyệt khách (${tripRequests.filter((request) => request.status === "pending").length})`;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekTrips = scheduled.filter((trip) => {
    const departure = new Date(`${trip.departureDate}T00:00:00`);
    const difference = (departure - today) / 86400000;
    return Number.isFinite(difference) && difference >= 0 && difference < 7;
  }).sort((a, b) => `${a.departureDate}T${a.departureTime}`.localeCompare(`${b.departureDate}T${b.departureTime}`));
  const scheduleBox = document.getElementById("scheduleSnippet");
  scheduleBox.innerHTML = weekTrips.slice(0, 7).map((trip) => `
    <div style="padding:1rem 1.25rem;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;gap:.75rem">
      <div><div class="font-bold" style="font-size:.9rem">${escape(trip.origin)} → ${escape(trip.destination)}</div><div style="font-size:.78rem;color:var(--text-muted)"><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> ${escape(trip.departureDate)} lúc <strong>${escape(trip.departureTime)}</strong> • Còn ${Number(trip.availableSeats) || 0} chỗ</div></div>
      <a href="driver/driver-trip-detail.html?id=${encodeURIComponent(trip.id)}" class="btn btn-outline btn-sm">Quản lý</a>
    </div>`).join("") || '<div class="empty-state" style="padding:1.5rem"><div style="font-size:.88rem;color:var(--text-muted)">Không có chuyến nào trong 7 ngày tới.</div></div>';
}
