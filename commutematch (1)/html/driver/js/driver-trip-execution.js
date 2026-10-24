let execPhase = "ready";
let executionTrip = null;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

document.addEventListener("DOMContentLoaded", () => window.DriverApi.ready.then(loadExecutionTrip));

function loadExecutionTrip() {
  const tripId = new URLSearchParams(window.location.search).get("id");
  const user = window.Storage.getCurrentUser();
  executionTrip = tripId && window.Storage.getById("trips", tripId);
  const ownTrip = executionTrip && window.DriverTripUtils.getDriverTrips(user?.id, user?.name, user?.username).some((trip) => trip.id === executionTrip.id);
  if (!executionTrip || !ownTrip) {
    window.Toast.show("Không tìm thấy chuyến xe thuộc tài khoản tài xế này.", "error");
    document.getElementById("btnMainAction").disabled = true;
    return;
  }
  if (["completed", "cancelled"].includes(executionTrip.status)) {
    window.Toast.show(executionTrip.status === "completed" ? "Chuyến này đã hoàn thành." : "Chuyến này đã bị hủy.", "info");
  }
  execPhase = executionTrip.status === "cancelled" ? "cancelled" : executionTrip.tripPhase || (executionTrip.status === "completed" ? "completed" : "ready");
  document.getElementById("executionRouteTitle").textContent = `${executionTrip.origin} → ${executionTrip.destination}`;
  document.getElementById("executionCostLabel").textContent = `${window.DriverTripUtils.costLabel(executionTrip.vehicleType)}:`;
  document.getElementById("executionCostValue").textContent = `${(Number(executionTrip.costSharing) || 0).toLocaleString("vi-VN")} đ`;
  renderExecutionState();
  renderExecutionPassengers();
}

function getAcceptedPassengers() {
  return window.DriverTripUtils.getRequests(executionTrip.id).filter((request) => request.status === "accepted");
}

function renderExecutionPassengers() {
  const container = document.getElementById("executionPassengers");
  const requests = getAcceptedPassengers();
  if (!requests.length) {
    container.innerHTML = '<div class="empty-state" style="padding:1rem"><div class="empty-title">Chưa có khách được duyệt</div><div class="empty-desc">Duyệt yêu cầu ghép chuyến trước khi bắt đầu đón khách.</div><a class="btn btn-outline btn-sm" href="driver/driver-join-requests.html">Mở yêu cầu ghép chuyến</a></div>';
    return;
  }
  container.innerHTML = requests.map((request) => {
    const boarded = request.boardingStatus === "boarded";
    const canBoard = execPhase === "at_pickup" && !boarded;
    const status = boarded ? "Đã lên xe" : execPhase === "at_pickup" ? "Chờ xác nhận lên xe" : execPhase === "in_progress" || execPhase === "completed" ? "Đã lên xe" : "Đã duyệt";
    return `<article style="border:1px solid var(--border-color);border-radius:var(--radius-md);padding:1rem;background:var(--bg-surface)">
      <div class="d-flex items-center justify-between gap-2 flex-wrap mb-2"><div class="d-flex items-center gap-2"><div class="avatar">${escapeHtml(request.riderAvatar || "KH")}</div><div><strong>${escapeHtml(request.riderName || "Hành khách")}</strong><div class="text-muted" style="font-size:.8rem">${escapeHtml(request.riderPhone || "Chưa cung cấp")}</div></div></div><span class="badge ${boarded ? "badge-success" : "badge-info"}">${status}</span></div>
      <div class="text-muted" style="font-size:.85rem;margin-bottom:.7rem"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Đón: <strong>${escapeHtml(request.pickupPoint || executionTrip.pickupZoneName || executionTrip.origin)}</strong><br><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i> Xuống: <strong>${escapeHtml(request.dropoffPoint || executionTrip.destination)}</strong><br><i class="fa-solid fa-chair" aria-hidden="true"></i> Ghế: ${Math.max(1, Number(request.seatsRequested) || 1)}</div>
      ${request.riderPhone ? `<a href="tel:${escapeHtml(request.riderPhone)}" class="btn btn-outline btn-sm"><i class="fa-solid fa-phone" aria-hidden="true"></i> Gọi khách</a>` : ""}
      ${canBoard ? `<button type="button" class="btn btn-primary btn-sm" onclick="confirmPassengerBoarded('${escapeHtml(request.id)}')"><i class="fa-solid fa-check" aria-hidden="true"></i> Xác nhận đã lên xe</button>` : ""}
    </article>`;
  }).join("");
}

function renderExecutionState() {
  const phaseLabels = {
    ready: ["CHỜ KHỞI HÀNH", "Chuẩn bị xuất phát đến điểm đón", "Bắt Đầu Đi Đón Khách", "fa-car-side", "btn-primary"],
    at_pickup: ["ĐANG ĐÓN KHÁCH", "Xác nhận từng hành khách đã lên xe", "Khách Đã Lên Xe & Xuất Phát", "fa-location-dot", "btn-secondary"],
    in_progress: ["ĐANG DI CHUYỂN", `Đang di chuyển đến ${executionTrip.destination}`, "Kết Thúc Chuyến Đi An Toàn", "fa-car-side", "btn-success"],
    completed: ["ĐÃ HOÀN THÀNH", "Chuyến đi đã hoàn thành an toàn!", "Xem Lịch Sử Chi Phí", "fa-circle-check", "btn-outline"],
    cancelled: ["ĐÃ HỦY", "Chuyến này đã bị hủy", "Chuyến đã hủy", "fa-circle-xmark", "btn-outline"]
  };
  const current = phaseLabels[execPhase] || phaseLabels.ready;
  const badge = document.getElementById("cockpitBadge");
  badge.textContent = current[0];
  badge.className = `badge ${execPhase === "completed" ? "badge-success" : execPhase === "cancelled" ? "badge-danger" : execPhase === "at_pickup" ? "badge-warning" : "badge-primary"}`;
  document.getElementById("execTitle").textContent = current[1];
  document.getElementById("execIcon").innerHTML = `<i class="fa-solid ${current[3]}" aria-hidden="true"></i>`;
  document.getElementById("execSub").textContent = `Điểm hẹn: ${executionTrip.pickupZoneName || executionTrip.origin}. Tuyến: ${executionTrip.origin} → ${executionTrip.destination}.`;
  const button = document.getElementById("btnMainAction");
  button.className = `btn ${current[4]} btn-lg`;
  button.innerHTML = `<i class="fa-solid ${execPhase === "completed" ? "fa-wallet" : "fa-arrow-right"}" aria-hidden="true"></i> ${current[2]}`;
  button.disabled = execPhase === "cancelled";
  button.onclick = execPhase === "completed" ? () => { window.location.href = "driver/driver-earnings-history.html"; } : handleExecAction;
  const checklist = document.querySelectorAll("#chkSeatbelt, #chkGas, #chkBrakes");
  checklist.forEach((item) => { item.disabled = execPhase !== "ready"; });
}

function confirmPassengerBoarded(requestId) {
  if (!executionTrip || execPhase !== "at_pickup") return;
  const request = window.DriverTripUtils.getRequests(executionTrip.id).find((item) => item.id === requestId && item.status === "accepted");
  if (!request) return;
  window.Storage.update("joinRequests", request.id, { boardingStatus: "boarded", boardedAt: new Date().toISOString() });
  window.DriverTripUtils.notifyUsers([request.riderId], {
    tripId: executionTrip.id, title: "Tài xế xác nhận bạn đã lên xe",
    message: `Tài xế đã xác nhận bạn lên xe cho chuyến ${executionTrip.origin} → ${executionTrip.destination}.`,
    type: "trip_passenger_boarded", link: "rider-my-trips.html"
  });
  renderExecutionPassengers();
  window.Toast.show(`Đã xác nhận ${request.riderName || "hành khách"} lên xe.`, "success");
}

function handleExecAction() {
  if (!executionTrip || ["completed", "cancelled"].includes(executionTrip.status)) return;
  if (execPhase === "ready") {
    if (["chkSeatbelt", "chkGas", "chkBrakes"].some((id) => !document.getElementById(id).checked)) {
      window.Toast.show("Hãy xác nhận đủ các mục kiểm tra an toàn trước khi xuất phát.", "warning");
      return;
    }
    execPhase = "at_pickup";
    window.Storage.update("trips", executionTrip.id, { tripPhase: execPhase });
    window.DriverTripUtils.notifyTripPassengers(executionTrip, {
      title: "Tài xế đã đến điểm đón",
      message: `Tài xế đã có mặt tại ${executionTrip.pickupZoneName || executionTrip.origin} cho chuyến ${executionTrip.origin} → ${executionTrip.destination}.`,
      type: "trip_driver_arrived"
    });
  } else if (execPhase === "at_pickup") {
    const unboarded = getAcceptedPassengers().filter((request) => request.boardingStatus !== "boarded");
    if (unboarded.length) {
      window.Toast.show(`Cần xác nhận ${unboarded.length} hành khách đã lên xe trước khi khởi hành.`, "warning");
      return;
    }
    execPhase = "in_progress";
    window.Storage.update("trips", executionTrip.id, { tripPhase: execPhase, startedAt: new Date().toISOString() });
    window.DriverTripUtils.notifyTripPassengers(executionTrip, {
      title: "Chuyến đi đã bắt đầu",
      message: `Chuyến ${executionTrip.origin} → ${executionTrip.destination} đã khởi hành.`,
      type: "trip_started"
    });
  } else if (execPhase === "in_progress") {
    execPhase = "completed";
    executionTrip = window.Storage.update("trips", executionTrip.id, { status: "completed", tripPhase: execPhase, completedAt: new Date().toISOString() });
    window.DriverTripUtils.notifyTripPassengers(executionTrip, {
      title: "Chuyến đi đã hoàn thành",
      message: `Chuyến ${executionTrip.origin} → ${executionTrip.destination} đã hoàn thành. Cảm ơn bạn đã đồng hành!`,
      type: "trip_completed"
    });
  }
  executionTrip = window.Storage.getById("trips", executionTrip.id);
  renderExecutionState();
  renderExecutionPassengers();
}
