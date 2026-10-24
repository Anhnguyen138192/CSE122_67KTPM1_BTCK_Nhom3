document.addEventListener("DOMContentLoaded", () => {
      initTripWizard();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById("tripDate").min = toLocalDateInput(new Date());
      document.getElementById("tripDate").value = toLocalDateInput(tomorrow);

      // Nạp danh mục trạm đón
      const zones = window.Storage.get("pickupZones");
      document.getElementById("tripZoneSelect").innerHTML = zones.map(z => `
        <option value="${z.id}">${z.name} - ${z.area}</option>
      `).join('');

      document.getElementById("tripVehicleType").addEventListener("change", updateTripCostDescription);
      updateTripCostDescription();

      triggerAiZoneRecommendation();
    });

    let activeWizardStep = 0;
    function toLocalDateInput(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    function initTripWizard() {
      const panels = [...document.querySelectorAll("[data-wizard-panel]")];
      const next = document.getElementById("tripWizardNext");
      const back = document.getElementById("tripWizardBack");
      const showStep = (step) => {
        activeWizardStep = step;
        panels.forEach((panel, index) => {
          const isActive = index === step;
          panel.hidden = !isActive;
          panel.querySelectorAll("input, select, textarea").forEach((field) => { field.disabled = !isActive; });
        });
        document.querySelectorAll("[data-wizard-label]").forEach((label, index) => {
          label.classList.toggle("badge-primary", index === step);
          label.classList.toggle("badge-info", index !== step);
        });
        back.disabled = step === 0;
        next.hidden = step === panels.length - 1;
        document.getElementById("tripWizardSubmit").hidden = step !== panels.length - 1;
      };
      next.addEventListener("click", () => {
        const panel = panels[activeWizardStep];
        const invalid = panel.querySelector(":invalid");
        if (invalid) { invalid.reportValidity(); return; }
        showStep(Math.min(activeWizardStep + 1, panels.length - 1));
      });
      back.addEventListener("click", () => showStep(Math.max(0, activeWizardStep - 1)));
      showStep(0);
    }

    async function triggerAiZoneRecommendation() {
      const origin = document.getElementById("tripOrigin").value;
      const res = await window.AIEngine.recommendPickupZone("Trạm xuất phát", origin);
      if (res.success) {
        document.getElementById("aiRecZoneTitle").innerText = res.zone.name;
        document.getElementById("aiRecZoneReason").innerText = `Điểm đón ${res.zone.name} có vỉa hè an toàn, ánh sáng tốt và nằm ngay trục đường xuất phát của bạn.`;
        document.getElementById("tripZoneSelect").value = res.zone.id;
      }
    }

    function updateTripCostDescription() {
      const type = document.getElementById("tripVehicleType").value;
      document.getElementById("tripCostDescription").textContent = window.DriverTripUtils.costDescription(type) + " Mức đóng góp tối đa 35.000 đ/người cho chặng nội khu và liên quận.";
    }

    function handleCreateTrip(e) {
      e.preventDefault();
      const currentUser = window.Storage.getCurrentUser();
      const activePanel = document.querySelector(`[data-wizard-panel="${activeWizardStep}"]`);
      const invalid = activePanel?.querySelector(":invalid");
      if (invalid) { invalid.reportValidity(); return; }
      if (!currentUser) {
        window.Toast.show("Vui lòng đăng nhập với tài khoản tài xế để đăng chuyến.", "error");
        return;
      }

      const origin = document.getElementById("tripOrigin").value.trim();
      const destination = document.getElementById("tripDestination").value.trim();
      const date = document.getElementById("tripDate").value;
      const time = document.getElementById("tripTime").value;
      const seats = parseInt(document.getElementById("tripSeats").value) || 1;
      const vehicle = document.getElementById("tripVehicle").value.trim();
      const fare = parseInt(document.getElementById("tripFare").value) || 12000;
      const notes = document.getElementById("tripNotes").value.trim();
      const points = document.getElementById("tripRoutePoints").value.split(",").map(p => p.trim());
      const zoneId = document.getElementById("tripZoneSelect").value;
      const zone = window.Storage.getById("pickupZones", zoneId);
      const departureAt = new Date(`${date}T${time}`);
      if (!Number.isFinite(departureAt.getTime()) || departureAt.getTime() <= Date.now()) {
        window.Toast.show("Ngày và giờ khởi hành phải ở thời điểm trong tương lai.", "error");
        document.getElementById("tripDate").focus();
        return;
      }
      if (origin.toLocaleLowerCase() === destination.toLocaleLowerCase()) {
        window.Toast.show("Điểm đi và điểm đến phải khác nhau.", "error");
        document.getElementById("tripDestination").focus();
        return;
      }
      if (seats < 1 || seats > 4 || fare < 5000 || fare > 35000 || fare % 1000 !== 0) {
        window.Toast.show("Số ghế phải từ 1–4 và mức chia sẻ từ 5.000–35.000 đ, theo bậc 1.000 đ.", "error");
        return;
      }

      const newTrip = {
        id: "trip_" + Date.now(),
        driverId: currentUser.id,
        driverUsername: currentUser.username || "",
        driverName: currentUser.name,
        driverAvatar: currentUser.avatar || "TX",
        driverRating: currentUser.rating || 4.9,
        driverPhone: currentUser.phone,
        vehicleInfo: vehicle,
        vehicleType: document.getElementById("tripVehicleType").value,
        origin: origin,
        destination: destination,
        departureTime: time,
        departureDate: date,
        totalSeats: seats,
        availableSeats: seats,
        costSharing: fare,
        costType: document.getElementById("tripVehicleType").value === "electric" ? "charging" : "fuel",
        status: "scheduled",
        pickupZoneId: zoneId,
        pickupZoneName: zone ? zone.name : "Trạm đón KTX Khu B",
        routePoints: points.filter(Boolean).length ? points.filter(Boolean) : [origin, destination],
        notes: notes || "Ưu tiên sinh viên, xe sạch sẽ và điều hòa hoạt động tốt.",
        aiMatchScore: 95
      };

      window.Storage.insert("trips", newTrip);
      window.Toast.show("Đăng tạo chuyến đi thành công! Chuyến xe đã sẵn sàng nhận khách.", "success");

      setTimeout(() => {
        window.location.href = "driver/driver-schedule.html";
      }, 700);
    }
