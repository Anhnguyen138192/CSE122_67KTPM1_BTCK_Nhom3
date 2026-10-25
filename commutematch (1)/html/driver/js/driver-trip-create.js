document.addEventListener("DOMContentLoaded", () => {
      initTripWizard();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById("tripDate").min = toLocalDateInput(new Date());
      document.getElementById("tripDate").value = toLocalDateInput(tomorrow);

      // Nạp danh mục trạm đón
      const zones = window.Storage.get("pickupZones").filter((zone) => zone.status === "active");
      const zoneSelect = document.getElementById("tripZoneSelect");
      zoneSelect.replaceChildren(new Option("Chọn trạm đón an toàn…", "", true, true));
      zones.forEach((zone) => {
        const option = document.createElement("option");
        option.value = String(zone.id);
        option.textContent = `${zone.name} - ${zone.area}`;
        zoneSelect.appendChild(option);
      });

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
      const origin = document.getElementById("tripOrigin").value.trim();
      const destination = document.getElementById("tripDestination").value.trim();
      const box = document.getElementById("driverAiZoneBox");
      const status = document.getElementById("driverAiStatus");
      const result = document.getElementById("driverAiResult");
      const title = document.getElementById("aiRecZoneTitle");
      const reason = document.getElementById("aiRecZoneReason");
      const reasons = document.getElementById("aiRecZoneReasons");
      const confidenceBadge = document.getElementById("driverAiConfidence");
      const applyButton = box.querySelector('[data-cm-action="apply-ai-zone"]');
      const supplementButton = box.querySelector('[data-cm-action="focus-trip-destination"]');
      const originButton = box.querySelector('[data-cm-action="focus-trip-origin"]');
      const zoneSelectGroup = document.getElementById("zoneSelectGroup");
      const zoneSelect = document.getElementById("tripZoneSelect");
      pendingAiZoneRecommendation = null;
      applyButton.disabled = true;
      result.hidden = true;

      if (!origin || !destination) {
        const missingFields = [];
        if (!origin) missingFields.push("điểm xuất phát");
        if (!destination) missingFields.push("điểm đến");
        const message = `Vui lòng nhập ${missingFields.join(" và ")} trước khi yêu cầu AI gợi ý.`;

        confidenceBadge.textContent = "Thiếu dữ liệu";
        status.setAttribute("role", "alert");
        status.textContent = message;
        title.textContent = "Chưa thể phân tích lộ trình";
        reason.textContent = message;
        reasons.replaceChildren();
        originButton.hidden = Boolean(origin);
        supplementButton.hidden = Boolean(destination);
        result.hidden = false;
        zoneSelectGroup.hidden = true;
        box.setAttribute("aria-busy", "false");
        return;
      }

      status.setAttribute("role", "status");
      originButton.hidden = true;
      supplementButton.hidden = true;
      box.setAttribute("aria-busy", "true");
      status.textContent = "AI đang phân tích lộ trình và các trạm đón an toàn…";
      confidenceBadge.textContent = "Đang phân tích";
      try {
        const recommendation = await window.AIEngine.recommendPickupZone(origin, destination);
        if (!recommendation.success || !recommendation.zone) {
          confidenceBadge.textContent = "Chưa có kết quả";
          status.textContent = recommendation.message || "AI chưa tìm thấy trạm phù hợp. Hãy thử lại hoặc chọn trạm thủ công.";
          title.textContent = "Chưa có gợi ý phù hợp";
          reason.textContent = status.textContent;
          reasons.replaceChildren();
          result.hidden = false;
          zoneSelectGroup.hidden = false;
          return;
        }

        pendingAiZoneRecommendation = recommendation.zone;
        const confidence = Number(recommendation.confidence) || 0;
        supplementButton.hidden = Boolean(destination);
        confidenceBadge.textContent = `Độ tin cậy ${confidence}%`;
        title.textContent = recommendation.zone.name;
        reason.textContent = confidence < 70
          ? "Chưa có điểm đến nên AI chưa thể đánh giá toàn tuyến. Hãy bổ sung điểm đến, thử lại hoặc tự chọn trạm."
          : `Gợi ý cho lộ trình: ${origin} → ${destination || "chưa nhập điểm đến"}.`;
        reasons.replaceChildren();
        (Array.isArray(recommendation.aiExplanation) ? recommendation.aiExplanation : []).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          reasons.appendChild(li);
        });
        result.hidden = false;
        if (confidence >= 70) {
          status.textContent = "Đã có gợi ý. Hãy xem lý do rồi chọn “Áp dụng gợi ý” hoặc tự chọn trạm.";
          applyButton.disabled = false;
        } else {
          status.textContent = "Độ tin cậy thấp; gợi ý chưa được áp dụng. Bổ sung điểm đến, thử lại hoặc tự chọn trạm.";
          zoneSelectGroup.hidden = false;
        }
      } catch (error) {
        console.error("Không thể lấy gợi ý điểm đón:", error);
        confidenceBadge.textContent = "Có lỗi";
        status.textContent = "Không tải được gợi ý lúc này. Hãy thử lại hoặc chọn trạm thủ công.";
        title.textContent = "Tạm thời không có gợi ý";
        reason.textContent = status.textContent;
        reasons.replaceChildren();
        result.hidden = false;
        zoneSelectGroup.hidden = false;
      } finally {
        box.setAttribute("aria-busy", "false");
      }
    }

    let pendingAiZoneRecommendation = null;

    function applyAiZoneRecommendation() {
      const status = document.getElementById("driverAiStatus");
      const select = document.getElementById("tripZoneSelect");
      const group = document.getElementById("zoneSelectGroup");
      if (!pendingAiZoneRecommendation) {
        status.textContent = "Không có gợi ý đủ tin cậy để áp dụng. Hãy tự chọn trạm.";
        group.hidden = false;
        select.focus();
        return;
      }

      const recommendedId = String(pendingAiZoneRecommendation.id);
      const matchingOption = [...select.options].find((option) => option.value === recommendedId);
      if (!matchingOption) {
        status.textContent = "Trạm AI gợi ý không còn trong danh mục. Hãy chọn trạm khác.";
        group.hidden = false;
        select.focus();
        return;
      }

      select.value = recommendedId;
      group.hidden = false;
      status.textContent = `Đã áp dụng gợi ý “${matchingOption.textContent}”. Khi đăng chuyến, trạm này sẽ được lưu cùng lộ trình.`;
      window.Toast?.show("Đã áp dụng gợi ý điểm đón.", "success");
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
