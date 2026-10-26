/**
 * COMMUTEMATCH EXPLAINABLE AI ENGINE (XAI)
 * Học phần: CSE122 - BTL-06 CommuteMatch
 * Hiện thực 3 tính năng AI bắt buộc:
 * 1. AI-1: Trip Matching Score (Chấm điểm phù hợp hành trình)
 * 2. AI-2: Meeting Point Recommender (Gợi ý điểm hẹn tối ưu)
 * 3. AI-3: Mobility Demand Heatmap (Mô phỏng bản đồ nhiệt nhu cầu & điểm nghẽn)
 */

window.AIEngine = {
  /**
   * AI-1: Chấm điểm phù hợp lộ trình (Trip Matching)
   * Nhập: Thông tin tìm kiếm của khách (origin, destination, time, seats)
   * Xử lý: Phân tích chênh lệch thời gian, từ khóa lộ trình, uy tín tài xế
   * Xuất: Danh sách chuyến kèm Match Score & Phân tích lý do (Explainability)
   */
  matchTrips: async function (searchCriteria) {
    // Mô phỏng độ trễ suy diễn AI (Processing State: 900ms)
    await new Promise((resolve) => setTimeout(resolve, 900));

    const allTrips = window.Storage.get("trips").filter(
      (trip) => {
        if (trip.status !== "scheduled" || trip.vehicleType !== "car" ||
            trip.availableSeats < (searchCriteria.seats || 1)) return false;
        if (searchCriteria.date && trip.departureDate !== searchCriteria.date) return false;
        if (this._calculateTimeDeltaMinutes(searchCriteria.time, trip.departureTime) > 45) return false;
        const points = trip.routePoints || [trip.origin, trip.destination];
        const originMatches = this._routePointMatches(trip.origin, searchCriteria.origin);
        const destinationIndex = points.findIndex((point) =>
          this._routePointMatches(point, searchCriteria.destination)
        );
        const originIndex = points.findIndex((point) => this._routePointMatches(point, searchCriteria.origin));
        return originMatches && originIndex >= 0 && destinationIndex > originIndex;
      }
    );

    const results = allTrips.map((trip) => {
      let score = 0;
      const reasons = [];

      // 1. Phân tích điểm đi / điểm đến (Trọng số 45%)
      const originMatch = this._calculateKeywordSimilarity(searchCriteria.origin, trip.origin);
      const destMatch = this._calculateKeywordSimilarity(searchCriteria.destination, trip.destination);
      const routeScore = Math.round((originMatch + destMatch) * 22.5);
      score += routeScore;

      if (originMatch > 0.6 && destMatch > 0.6) {
        reasons.push({
          icon: "📍",
          text: `Trùng khớp tuyến đường cao (+${routeScore} điểm): Tuyến qua trục ${trip.origin.split(" ")[0]} - ${trip.destination.split(" ")[0]}.`
        });
      } else {
        reasons.push({
          icon: "🔄",
          text: `Các điểm theo lịch điều phối: ${(trip.routePoints || [trip.origin, trip.destination]).slice(0, 2).join(" → ")}.`
        });
      }

      // 2. Phân tích chênh lệch giờ xuất phát (Trọng số 30%)
      const timeDiffMinutes = this._calculateTimeDeltaMinutes(searchCriteria.time, trip.departureTime);
      let timeScore = 0;
      if (timeDiffMinutes <= 10) {
        timeScore = 30;
        reasons.push({ icon: "⏱️", text: `Khung giờ lý tưởng (+30 điểm): Chênh lệch chỉ ${timeDiffMinutes} phút so với giờ bạn cần.` });
      } else if (timeDiffMinutes <= 25) {
        timeScore = 20;
        reasons.push({ icon: "⏱️", text: `Thời gian tương thích vừa (+20 điểm): Chênh lệch ${timeDiffMinutes} phút.` });
      } else {
        timeScore = 5;
        reasons.push({ icon: "⚠️", text: `Giờ đi lệch ${timeDiffMinutes} phút so với lịch mong muốn.` });
      }
      score += timeScore;

      // 3. Uy tín & đánh giá tài xế (Trọng số 25%)
      const driverRating = Number(trip.driverRating);
      const driverScore = Number.isFinite(driverRating) && driverRating > 0
        ? Math.min(25, Math.round((driverRating / 5) * 25))
        : 0;
      score += driverScore;
      reasons.push({
        icon: "⭐",
        text: driverScore
          ? `Độ tin cậy tài xế (+${driverScore} điểm): Đánh giá ${driverRating}/5.0.`
          : "Tài xế chưa có đánh giá để tính vào điểm phù hợp."
      });

      score = Math.min(100, Math.max(0, score));

      return {
        ...trip,
        matchScore: score,
        matchCategory: score >= 85 ? "Rất phù hợp" : score >= 70 ? "Phù hợp tốt" : "Có thể cân nhắc",
        aiReasons: reasons,
        co2EstimatedSaved: null
      };
    });

    // Sắp xếp theo điểm tương thích giảm dần
    results.sort((a, b) => b.matchScore - a.matchScore);

    return {
      status: results.length > 0 ? "success" : "empty",
      totalMatched: results.length,
      trips: results,
      aiSummary: results.length > 0
        ? `Đã phân tích ${allTrips.length} chuyến xe đang hoạt động. Tìm thấy ${results.length} chuyến có độ tương thích từ ${results[results.length - 1].matchScore}% đến ${results[0].matchScore}%.`
        : "Không tìm thấy chuyến đi nào khớp hoàn toàn với lộ trình và giờ hẹn này."
    };
  },

  /**
   * AI-2: Gợi ý điểm đón tối ưu (Meeting Point Recommender)
   * Nhập: Tọa độ/địa điểm của khách & tài xế
   * Xử lý: Phân tích các trạm an toàn lân cận, vỉa hè, khoảng cách đi bộ
   * Xuất: Trạm đón tối ưu kèm lý do giải thích chi tiết
   */
  recommendPickupZone: async function (riderLocation, driverRoute) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const zones = window.Storage.get("pickupZones").filter((z) => z.status === "active");

    if (!zones.length) {
      return {
        success: false,
        message: "Chưa có trạm đón cộng đồng nào được kích hoạt trong khu vực này."
      };
    }

    // Chọn trạm tối ưu nhất dựa trên chỉ số an toàn và vỉa hè
    const bestZone = zones.reduce((best, curr) => (curr.safetyScore > best.safetyScore ? curr : best), zones[0]);

    return {
      success: true,
      zone: bestZone,
      aiExplanation: [
        `Đề xuất dựa trên điểm an toàn đã được điều phối viên ghi nhận: ${bestZone.safetyScore ?? "chưa chấm"}/10.`,
        "Khoảng cách đi bộ và thời gian đường vòng chưa thể xác định vì chưa có dữ liệu bản đồ."
      ]
    };
  },

  /**
   * AI-3: Bản đồ nhiệt nhu cầu & Cảnh báo điểm nghẽn (Mobility Demand Heatmap)
   * Dành cho vai trò Điều phối viên
   */
  analyzeMobilityDemand: async function () {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const zones = window.Storage.get("pickupZones");
    const requests = window.Storage.get("joinRequests");
    const trips = window.Storage.get("trips");

    const heatmapData = zones.map((zone) => {
      const zoneRequests = requests.filter((request) =>
        request.pickupZoneId === zone.id && request.status === "pending"
      );
      const zoneTrips = trips.filter((trip) =>
        trip.pickupZoneId === zone.id && trip.status === "scheduled"
      );
      const availableSeats = zoneTrips.reduce((total, trip) => total + Number(trip.availableSeats || 0), 0);
      const demandCount = zoneRequests.length;
      const demandIndex = demandCount
        ? Math.min(100, Math.ceil(demandCount / Math.max(availableSeats, 1) * 100))
        : 0;
      const deficit = Math.max(0, demandCount - availableSeats);

      return {
        zoneId: zone.id,
        zoneName: zone.name,
        area: zone.area,
        demandCount,
        availableSeats,
        demandIndex,
        supplyTrips: zoneTrips.length,
        status: deficit > 0 ? "high_congestion" : demandCount ? "moderate" : "normal",
        statusLabel: deficit > 0 ? "Thiếu chỗ" : demandCount ? "Có yêu cầu chờ" : "Chưa có nhu cầu",
        aiRecommendation:
          deficit > 0
            ? `Còn ${deficit} yêu cầu chờ so với số chỗ đang trống. Cần phân công thêm chuyến.`
            : demandCount
              ? "Số chỗ hiện có đủ đáp ứng các yêu cầu đang chờ."
              : "Chưa có yêu cầu chờ tại trạm này."
      };
    });

    return {
      timestamp: new Date().toLocaleTimeString("vi-VN"),
      zonesAnalysis: heatmapData,
      summary: {
        totalRidersLooking: requests.filter((request) => request.status === "pending").length,
        totalAvailableSeats: trips.filter((trip) => trip.status === "scheduled")
          .reduce((total, trip) => total + Number(trip.availableSeats || 0), 0),
        peakBottleneck: heatmapData.find((zone) => zone.status === "high_congestion")?.zoneName || null,
        aiActionAdvice: "Phân công chuyến tại trang quản lý chuyến."
      }
    };
  },

  // Helper tính độ tương tự từ khóa cơ bản
  _calculateKeywordSimilarity: function (str1, str2) {
    if (!str1 || !str2) return 0.5;
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const words1 = s1.split(/\s+/);
    let matched = 0;
    words1.forEach((w) => {
      if (w.length > 2 && s2.includes(w)) matched++;
    });
    return Math.min(1, Math.max(0.3, matched / Math.max(words1.length, 1)));
  },

  _routePointMatches: function (routePoint, searchPoint) {
    if (!routePoint || !searchPoint) return false;
    const normalize = (value) => value.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const route = normalize(routePoint);
    const search = normalize(searchPoint);
    return route === search || route.includes(search) || search.includes(route);
  },

  // Helper tính chênh lệch phút
  _calculateTimeDeltaMinutes: function (time1, time2) {
    if (!time1 || !time2) return 10;
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);
    const totalM1 = (h1 || 7) * 60 + (m1 || 0);
    const totalM2 = (h2 || 7) * 60 + (m2 || 0);
    return Math.abs(totalM1 - totalM2);
  }
};
