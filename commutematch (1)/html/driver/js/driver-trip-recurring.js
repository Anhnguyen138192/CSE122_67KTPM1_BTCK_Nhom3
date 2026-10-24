let recurringTemplate = null;
const recurringDayButtons = [...document.querySelectorAll("#daysSelector [data-day]")];

document.addEventListener("DOMContentLoaded", () => {
  window.DriverApi.ready.then(() => {
    const user = window.Storage.getCurrentUser();
    recurringTemplate = window.Storage.get("driverRecurring").find((item) =>
      item.driverId === user?.id || (user?.username && String(item.driverUsername || "").toLowerCase() === String(user.username).toLowerCase())
    ) || null;
    if (recurringTemplate) populateRecurringForm(recurringTemplate);
    document.getElementById("toggleRecurring").addEventListener("change", updateRecurringStatusLabel);
    document.getElementById("recurringFare").addEventListener("input", updateRecurringSummary);
    document.getElementById("recurringVehicleType").addEventListener("change", updateRecurringSummary);
    document.getElementById("recurringReturnRoute").addEventListener("input", updateRecurringSummary);
    recurringDayButtons.forEach((button) => button.addEventListener("click", () => {
      const active = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("btn-primary", active);
      button.classList.toggle("btn-outline", !active);
      updateRecurringSummary();
    }));
    updateRecurringSummary();
  });
});

function populateRecurringForm(template) {
  document.getElementById("toggleRecurring").checked = Boolean(template.active);
  document.getElementById("recurringOutboundRoute").value = template.outboundRoute || "";
  document.getElementById("recurringOutboundTime").value = template.outboundTime || "07:15";
  document.getElementById("recurringReturnRoute").value = template.returnRoute || "";
  document.getElementById("recurringReturnTime").value = template.returnTime || "17:15";
  document.getElementById("recurringVehicleType").value = template.vehicleType || "electric";
  document.getElementById("recurringVehicle").value = template.vehicleInfo || "";
  document.getElementById("recurringSeats").value = template.totalSeats || 3;
  document.getElementById("recurringFare").value = template.costSharing || 12000;
  recurringDayButtons.forEach((button) => {
    const active = (template.days || []).includes(Number(button.dataset.day));
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("btn-primary", active);
    button.classList.toggle("btn-outline", !active);
  });
}

function updateRecurringStatusLabel() {
  const active = document.getElementById("toggleRecurring").checked;
  const label = document.getElementById("toggleStatusLabel");
  label.textContent = active ? "Đang kích hoạt" : "Đã tạm dừng";
  label.classList.toggle("text-success", active);
  label.classList.toggle("text-muted", !active);
}

function updateRecurringSummary() {
  const days = recurringDayButtons.filter((button) => button.getAttribute("aria-pressed") === "true").length;
  const tripsPerDay = 1 + (splitRecurringRoute(document.getElementById("recurringReturnRoute").value).length === 2 ? 1 : 0);
  document.getElementById("recurringForecast").innerHTML = `Chuyến trong 14 ngày tới: <strong>${days * tripsPerDay}</strong>`;
  document.getElementById("recurringFareSummary").textContent = `${(Number(document.getElementById("recurringFare").value) || 0).toLocaleString("vi-VN")} đ/người`;
  document.getElementById("recurringCostSummary").textContent = `Chi phí ${document.getElementById("recurringVehicleType").value === "electric" ? "sạc điện" : "nhiên liệu"}`;
  updateRecurringStatusLabel();
}

function splitRecurringRoute(route) {
  const parts = route.split(/\s*(?:→|->|–|—)\s*/).map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? parts : [];
}

function generateRecurringTrips(template) {
  if (!template.active) return 0;
  const user = window.Storage.getCurrentUser();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let created = 0;
  for (let offset = 1; offset <= 14; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const day = date.getDay() === 0 ? 7 : date.getDay();
    if (!template.days.includes(day)) continue;
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const generated = template.generatedDates || [];
    if (generated.includes(dateKey)) continue;
    const tripsForDay = [];
    const outbound = splitRecurringRoute(template.outboundRoute);
    const returning = splitRecurringRoute(template.returnRoute || "");
    if (outbound.length === 2) tripsForDay.push({ direction: "out", route: outbound, time: template.outboundTime });
    if (returning.length === 2 && template.returnTime) tripsForDay.push({ direction: "return", route: returning, time: template.returnTime });
    tripsForDay.forEach((entry) => {
      const id = `recurring_${template.id}_${dateKey}_${entry.direction}`;
      if (window.Storage.getById("trips", id)) return;
      window.Storage.insert("trips", {
        id, recurringId: template.id, driverId: user.id, driverName: user.name,
        driverAvatar: user.avatar || "TX", driverRating: user.rating || 0, driverPhone: user.phone,
        origin: entry.route[0], destination: entry.route[1], departureDate: dateKey, departureTime: entry.time,
        vehicleInfo: template.vehicleInfo, vehicleType: template.vehicleType,
        totalSeats: Number(template.totalSeats), availableSeats: Number(template.totalSeats), acceptedSeats: 0,
        costSharing: Number(template.costSharing), costType: template.vehicleType === "electric" ? "charging" : "fuel",
        status: "scheduled", registrationClosed: false, pickupZoneId: "", pickupZoneName: entry.route[0],
        routePoints: entry.route, notes: "Chuyến được tạo từ lịch trình lặp lại."
      });
      created += 1;
    });
    template.generatedDates = [...generated, dateKey];
  }
  if (created) window.Storage.update("driverRecurring", template.id, { generatedDates: template.generatedDates });
  return created;
}

function saveRecurring(e) {
  e.preventDefault();
  const user = window.Storage.getCurrentUser();
  const days = recurringDayButtons.filter((button) => button.getAttribute("aria-pressed") === "true").map((button) => Number(button.dataset.day));
  const outboundRoute = document.getElementById("recurringOutboundRoute").value.trim();
  const returnRoute = document.getElementById("recurringReturnRoute").value.trim();
  if (!user || !days.length || splitRecurringRoute(outboundRoute).length !== 2 || (returnRoute && splitRecurringRoute(returnRoute).length !== 2)) {
    window.Toast.show("Hãy chọn ít nhất một ngày và nhập tuyến theo dạng Điểm đi → Điểm đến.", "error");
    return;
  }
  const data = {
    driverId: user.id, driverUsername: user.username || "", active: document.getElementById("toggleRecurring").checked, days,
    outboundRoute, outboundTime: document.getElementById("recurringOutboundTime").value,
    returnRoute, returnTime: document.getElementById("recurringReturnTime").value,
    vehicleType: document.getElementById("recurringVehicleType").value,
    vehicleInfo: document.getElementById("recurringVehicle").value.trim(),
    totalSeats: Number(document.getElementById("recurringSeats").value),
    costSharing: Number(document.getElementById("recurringFare").value),
    generatedDates: recurringTemplate?.generatedDates || [], updatedAt: new Date().toISOString()
  };
  if (recurringTemplate) {
    recurringTemplate = window.Storage.update("driverRecurring", recurringTemplate.id, data);
  } else {
    data.id = `recurring_${user.id}`;
    recurringTemplate = window.Storage.insert("driverRecurring", data);
  }
  const created = generateRecurringTrips(recurringTemplate);
  window.Toast.show(data.active ? `Đã lưu lịch và tạo ${created} chuyến trong 14 ngày tới.` : "Đã lưu lịch định kỳ ở trạng thái tạm dừng.", "success");
  setTimeout(() => { window.location.href = "driver/driver-schedule.html"; }, 700);
}
