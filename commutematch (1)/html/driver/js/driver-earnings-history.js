let currentEarnings = [];
const escapeEarnings = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

document.addEventListener("DOMContentLoaded", () => window.DriverApi.ready.then(renderEarnings));

function getDriverEarnings() {
  const user = window.Storage.getCurrentUser();
  const trips = window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username).filter((trip) => trip.status === "completed");
  const tripById = new Map(trips.map((trip) => [String(trip.id), trip]));
  return window.Storage.get("joinRequests")
    .filter((request) => request.status === "accepted" && tripById.has(String(request.tripId)))
    .map((request) => {
      const trip = tripById.get(String(request.tripId));
      const date = trip.completedAt || `${trip.departureDate || ""}T${trip.departureTime || "00:00"}:00`;
      return {
        request,
        trip,
        date: new Date(date),
        amount: (Number(trip.costSharing) || Number(request.cost) || 0) * Math.max(1, Number(request.seatsRequested) || 1)
      };
    }).sort((a, b) => b.date - a.date);
}

function renderEarnings() {
  const entries = getDriverEarnings();
  const filter = document.getElementById("earningsMonthFilter").value;
  const months = [...new Set(entries.filter((entry) => Number.isFinite(entry.date.getTime())).map((entry) => `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, "0")}`))];
  const select = document.getElementById("earningsMonthFilter");
  const previous = select.value;
  select.innerHTML = '<option value="all">Tất cả thời gian</option>' + months.map((month) => {
    const [year, number] = month.split("-");
    return `<option value="${month}">Tháng ${number}/${year}</option>`;
  }).join("");
  select.value = months.includes(previous) || previous === "all" ? previous : "all";
  currentEarnings = entries.filter((entry) => select.value === "all" || `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, "0")}` === select.value);

  const received = entries.filter((entry) => entry.request.paymentStatus === "received").reduce((sum, entry) => sum + entry.amount, 0);
  document.getElementById("totalEarned").textContent = `${received.toLocaleString("vi-VN")} đ`;
  document.getElementById("tripCount").textContent = new Set(entries.map((entry) => entry.trip.id)).size;
  document.getElementById("passengerCount").textContent = entries.length;
  const rows = document.getElementById("earningsRows");
  if (!currentEarnings.length) {
    rows.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-title">Chưa có khoản chia sẻ chi phí</div><div class="empty-desc">Các chuyến đã hoàn thành và yêu cầu được duyệt sẽ hiển thị tại đây.</div></div></td></tr>';
    return;
  }
  rows.innerHTML = currentEarnings.map(({ request, trip, date, amount }) => {
    const receivedPayment = request.paymentStatus === "received";
    return `<tr>
      <td>${Number.isFinite(date.getTime()) ? date.toLocaleString("vi-VN") : escapeEarnings(trip.departureDate || "—")}</td>
      <td>${escapeEarnings(trip.origin)} → ${escapeEarnings(trip.destination)}<br><small class="text-muted">${window.DriverTripUtils.costLabel(trip.vehicleType)}</small></td>
      <td>${escapeEarnings(request.riderName || "Hành khách")} × ${Math.max(1, Number(request.seatsRequested) || 1)}</td>
      <td>${receivedPayment ? escapeEarnings(request.paymentMethod || "Đã xác nhận") : "Chưa ghi nhận"}</td>
      <td><strong style="color:var(--primary)">${amount.toLocaleString("vi-VN")} đ</strong></td>
      <td>${receivedPayment ? '<span class="badge badge-success">Đã nhận</span>' : `<button class="btn btn-outline btn-sm" onclick="markContributionReceived('${escapeEarnings(request.id)}')">Xác nhận đã nhận</button>`}</td>
    </tr>`;
  }).join("");
}

function markContributionReceived(requestId) {
  if (!currentEarnings.some((entry) => entry.request.id === requestId)) return;
  const request = window.Storage.getById("joinRequests", requestId);
  if (!request || request.paymentStatus === "received") return;
  const method = window.prompt("Chọn hình thức nhận: nhập 1 cho Tiền mặt hoặc 2 cho Chuyển khoản/QR.", "1");
  if (method === null) return;
  const paymentMethod = method.trim() === "1" ? "Tiền mặt" : method.trim() === "2" ? "Chuyển khoản/QR" : null;
  if (!paymentMethod) {
    window.Toast.show("Hãy nhập 1 hoặc 2 để chọn hình thức nhận.", "warning");
    return;
  }
  window.Storage.update("joinRequests", requestId, { paymentStatus: "received", paymentMethod, paymentReceivedAt: new Date().toISOString() });
  window.Toast.show("Đã ghi nhận khoản chia sẻ chi phí.", "success");
  renderEarnings();
}

function exportReport() {
  const headings = ["Thời gian", "Chuyến đi", "Hành khách", "Hình thức", "Số tiền (VND)", "Trạng thái"];
  const rows = currentEarnings.map(({ request, trip, date, amount }) => [
    Number.isFinite(date.getTime()) ? date.toLocaleString("vi-VN") : trip.departureDate,
    `${trip.origin} → ${trip.destination}`,
    `${request.riderName || "Hành khách"} (${Math.max(1, Number(request.seatsRequested) || 1)} ghế)`,
    request.paymentMethod || "Chưa ghi nhận",
    amount,
    request.paymentStatus === "received" ? "Đã nhận" : "Chờ xác nhận"
  ]);
  const csv = [headings, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `commutematch-bao-cao-chia-se-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  window.Toast.show("Đã tải báo cáo CSV theo bộ lọc hiện tại.", "success");
}
