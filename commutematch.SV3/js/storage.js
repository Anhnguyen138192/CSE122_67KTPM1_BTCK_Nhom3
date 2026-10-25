/**
 * COMMUTEMATCH LOCALSTORAGE CRUD ENGINE
 * Học phần: CSE122 - BTL-06 CommuteMatch
 * Đảm nhiệm toàn bộ việc đọc, ghi, cập nhật, xóa dữ liệu trong LocalStorage
 */

const STORAGE_PREFIX = "commutematch_";

window.Storage = {
  /**
   * Khởi tạo dữ liệu mẫu vào LocalStorage nếu chưa có
   */
  initDefaults: function () {
    if (!window.COMMUTE_MOCK_DATA) {
      console.error("COMMUTE_MOCK_DATA chưa được tải.");
      return;
    }

    const entities = [
      "users",
      "trips",
      "joinRequests",
      "roleApplications",
      "pickupZones",
      "reports",
      "ratings",
      "settings",
      "notifications",
      "messages",
      "auditLogs"
    ];

    entities.forEach((entity) => {
      const key = STORAGE_PREFIX + entity;
      const shouldInitialize = entity === "users"
        ? !localStorage.getItem(key)
        : !localStorage.getItem(key);
      if (shouldInitialize) {
        localStorage.setItem(key, JSON.stringify(window.COMMUTE_MOCK_DATA[entity]));
      }
    });

    const users = this.get("users");
    const seedUser = window.COMMUTE_MOCK_DATA.users.find((user) => user.username === "longchieusigma");
    if (seedUser && !users.some((user) => user.username === seedUser.username)) {
      users.push(seedUser);
      localStorage.setItem(STORAGE_PREFIX + "users", JSON.stringify(users));
    }

    const rolesVersionKey = STORAGE_PREFIX + "roles_v2_initialized";
    if (!localStorage.getItem(rolesVersionKey)) {
      const seedUserIds = new Set(window.COMMUTE_MOCK_DATA.users
        .filter((user) => user.id !== "u_longchieusigma")
        .map((user) => user.id));
      const migratedUsers = this.get("users").map((user) => seedUserIds.has(user.id)
        ? { ...user, role: "rider", roles: ["rider"], roleLabel: "Hành khách" }
        : user);
      localStorage.setItem(STORAGE_PREFIX + "users", JSON.stringify(migratedUsers));
      localStorage.setItem(rolesVersionKey, "true");
    }

    const permissionVersionKey = STORAGE_PREFIX + "permissions_v4_initialized";
    if (!localStorage.getItem(permissionVersionKey)) {
      const currentUsers = this.get("users");
      const rootAccount = currentUsers.find((user) => user.username === "longchieusigma");
      if (rootAccount) {
        Object.assign(rootAccount, {
          role: "superadmin",
          roles: ["rider", "driver", "coordinator", "admin", "superadmin"],
          roleLabel: "Super Admin",
          avatarColor: "#4c1d95"
        });
      }
      const migratedUsers = currentUsers.map((user) => {
        if (user.username === "longchieusigma") return user;
        const roles = (Array.isArray(user.roles) ? user.roles : [user.role || "rider"])
          .filter((role) => role !== "superadmin");
        const nextRoles = roles.length ? roles : ["rider"];
        const role = nextRoles.includes(user.role) ? user.role : nextRoles[0];
        const labels = {
          rider: "Hành khách",
          driver: "Tài xế",
          coordinator: "Điều phối viên",
          admin: "Quản trị viên"
        };
        return { ...user, roles: nextRoles, role, roleLabel: labels[role] };
      });
      localStorage.setItem(STORAGE_PREFIX + "users", JSON.stringify(migratedUsers));
      localStorage.setItem(permissionVersionKey, "true");
    }

    const demoProfileCleanupKey = STORAGE_PREFIX + "demo_profiles_v1_removed";
    if (!localStorage.getItem(demoProfileCleanupKey)) {
      const seededUserIds = new Set(window.COMMUTE_MOCK_DATA.users
        .filter((user) => user.id !== "u_longchieusigma")
        .map((user) => user.id));
      const demoProfileFields = [
        "university", "studentId", "trustScore", "rating", "tripsCount", "co2Saved",
        "moneySaved", "earnings", "kycStatus", "kycDocument", "bio", "joinedDate",
        "reportsResolved", "vehicle", "department"
      ];
      const cleanedUsers = this.get("users").map((user) => {
        if (!seededUserIds.has(user.id)) return user;
        const cleanedUser = { ...user };
        demoProfileFields.forEach((field) => delete cleanedUser[field]);
        return cleanedUser;
      });
      localStorage.setItem(STORAGE_PREFIX + "users", JSON.stringify(cleanedUsers));
      localStorage.setItem(demoProfileCleanupKey, "true");
    }

    const demoCleanupKey = STORAGE_PREFIX + "demo_records_v1_removed";
    if (!localStorage.getItem(demoCleanupKey)) {
      const demoRecordIds = {
        trips: ["trip_101", "trip_102", "trip_103", "trip_104", "trip_105"],
        joinRequests: ["req_201", "req_202", "req_203"],
        pickupZones: ["zone_01", "zone_02", "zone_03", "zone_04", "zone_05"],
        reports: ["rep_301", "rep_302"],
        ratings: ["rate_401", "rate_402"],
        notifications: ["notif_01", "notif_02", "notif_03"],
        messages: ["msg_01", "msg_02", "msg_03"],
        auditLogs: ["log_01", "log_02", "log_03", "log_04"]
      };
      const demoRecordIdPatterns = {
        trips: /^trip_10[1-5]$/,
        joinRequests: /^req_2\d{2}$/,
        pickupZones: /^zone_0[1-5]$/,
        reports: /^rep_3\d{2}$/,
        ratings: /^rate_4\d{2}$/,
        notifications: /^notif_\d{2}$/,
        messages: /^msg_\d{1,4}$/,
        auditLogs: /^log_\d{1,4}$/
      };
      Object.entries(demoRecordIds).forEach(([entity, ids]) => {
        const seededIds = new Set(ids);
        const seededPattern = demoRecordIdPatterns[entity];
        const records = this.get(entity).filter((record) =>
          !seededIds.has(record.id) && !(seededPattern && seededPattern.test(record.id || ""))
        );
        localStorage.setItem(STORAGE_PREFIX + entity, JSON.stringify(records));
      });
      localStorage.setItem(demoCleanupKey, "true");
    }

    const demoScenarioKey = STORAGE_PREFIX + "demo_scenario_v1_initialized";
    if (!localStorage.getItem(demoScenarioKey)) {
      const users = this.get("users");
      const operator = users.find((user) => user.id === "u_longchieusigma");
      const applicant = users.find((user) => user.id === "u_rider1") || users[0];
      if (operator && applicant) {
      const dateForOffset = (offset) => {
        const date = new Date();
        date.setDate(date.getDate() + offset);
        return [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0")
        ].join("-");
      };
      const demoDriver = users.find((user) => {
        if (!user || user.isSuspended) return false;
        const roles = Array.isArray(user.roles) ? user.roles : [user.role || "rider"];
        const vehicle = user.vehicle || (Array.isArray(user.vehiclesList) ? user.vehiclesList[0] : null);
        const vehicleType = String(vehicle && (vehicle.vehicleType || vehicle.type) || "");
        const totalSeats = Number(vehicle && (vehicle.seatsTotal || vehicle.seats));
        return user.id !== operator.id && roles.includes("driver") &&
          /\bcar\b|ô\s*tô|suv|mpv|minibus|xe khách/i.test(vehicleType) &&
          Number.isInteger(totalSeats) && totalSeats >= 7 && totalSeats <= 45;
      });
      const demoDriverVehicle = demoDriver &&
        (demoDriver.vehicle || (Array.isArray(demoDriver.vehiclesList) ? demoDriver.vehiclesList[0] : null));
      const demoTrips = demoDriver ? [
        {
          id: "trip_demo_01",
          createdBy: operator.id,
          coordinatorId: operator.id,
          driverId: demoDriver.id,
          driverName: demoDriver.name,
          driverAvatar: demoDriver.avatar || "TX",
          driverRating: demoDriver.rating || null,
          driverPhone: demoDriver.phone || "",
          vehicleInfo: demoDriverVehicle.type || "Ô tô",
          vehiclePlate: demoDriverVehicle.plate || "",
          vehicleType: "car",
          origin: "KTX Khu B, ĐHQG TP.HCM",
          destination: "Khu Công nghệ cao TP.HCM",
          departureDate: dateForOffset(1),
          departureTime: "07:30",
          totalSeats: Number(demoDriverVehicle.seatsTotal || demoDriverVehicle.seats) - 1,
          availableSeats: Number(demoDriverVehicle.seatsTotal || demoDriverVehicle.seats) - 1,
          costSharing: 12000,
          status: "scheduled",
          isDemoRecord: true,
          pickupZoneId: "zone_demo_dhqg",
          pickupZoneName: "Trạm KTX Khu B (Mô phỏng)",
          routePoints: ["KTX Khu B, ĐHQG TP.HCM", "Xa lộ Hà Nội", "Khu Công nghệ cao TP.HCM"],
          notes: "Chuyến dữ liệu mô phỏng, được phân công bởi điều phối viên."
        },
        {
          id: "trip_demo_02",
          createdBy: operator.id,
          coordinatorId: operator.id,
          driverId: demoDriver.id,
          driverName: demoDriver.name,
          driverAvatar: demoDriver.avatar || "TX",
          driverRating: demoDriver.rating || null,
          driverPhone: demoDriver.phone || "",
          vehicleInfo: demoDriverVehicle.type || "Ô tô",
          vehiclePlate: demoDriverVehicle.plate || "",
          vehicleType: "car",
          origin: "Khu Công nghệ cao TP.HCM",
          destination: "KTX Khu B, ĐHQG TP.HCM",
          departureDate: dateForOffset(2),
          departureTime: "17:30",
          totalSeats: Number(demoDriverVehicle.seatsTotal || demoDriverVehicle.seats) - 1,
          availableSeats: Number(demoDriverVehicle.seatsTotal || demoDriverVehicle.seats) - 1,
          costSharing: 12000,
          status: "scheduled",
          isDemoRecord: true,
          pickupZoneId: "zone_demo_shtp",
          pickupZoneName: "Trạm cổng Khu Công nghệ cao (Mô phỏng)",
          routePoints: ["Khu Công nghệ cao TP.HCM", "Xa lộ Hà Nội", "KTX Khu B, ĐHQG TP.HCM"],
          notes: "Chuyến dữ liệu mô phỏng, được phân công bởi điều phối viên."
        }
      ] : [];

      const timestamp = new Date().toLocaleString("vi-VN");
      const demoScenario = {
        pickupZones: [
          {
            id: "zone_demo_dhqg",
            name: "Trạm KTX Khu B (Mô phỏng)",
            area: "ĐHQG TP.HCM",
            coordinates: "10.8786, 106.8024",
            address: "Sảnh đón phía trước KTX Khu B, TP. Thủ Đức",
            capacity: 20,
            safetyScore: 8.5,
            hasSidewalk: true,
            hasLighting: true,
            hasCCTV: false,
            hasShelter: true,
            status: "active",
            isDemoRecord: true,
            notes: "Dữ liệu mô phỏng. Dừng sát lề, không chắn lối xe buýt."
          },
          {
            id: "zone_demo_shtp",
            name: "Trạm cổng Khu Công nghệ cao (Mô phỏng)",
            area: "Khu Công Nghệ Cao Thủ Đức",
            coordinates: "10.8551, 106.7898",
            address: "Khu vực đón khách bên trong cổng chính, TP. Thủ Đức",
            capacity: 15,
            safetyScore: 8,
            hasSidewalk: true,
            hasLighting: true,
            hasCCTV: true,
            hasShelter: false,
            status: "active",
            isDemoRecord: true,
            notes: "Dữ liệu mô phỏng. Chỉ đón tại khu vực được phép dừng."
          }
        ],
        trips: demoTrips,
        roleApplications: [
          {
            id: "application_demo_driver",
            userId: applicant.id,
            userName: applicant.name,
            role: "driver",
            details: {
              vehicleType: "SUV/MPV 7 chỗ",
              vehicleModel: "Ô tô mô phỏng",
              vehicleSeats: 7,
              vehiclePlate: "51A-DEMO",
              driverLicense: "Hồ sơ minh họa để thử quy trình duyệt; không phải giấy tờ thật."
            },
            status: "pending",
            isDemoRecord: true,
            createdAt: new Date().toISOString()
          }
        ],
        auditLogs: [
          {
            id: "log_demo_zone",
            timestamp,
            user: `${operator.name} (Tài khoản hiện có)`,
            action: "TẠO MỚI PICKUPZONES",
            details: "Dữ liệu mô phỏng: thiết lập hai trạm đón trong khu ĐHQG TP.HCM và Khu Công nghệ cao.",
            status: "SUCCESS",
            isDemoRecord: true
          },
          ...(demoTrips.length ? [{
            id: "log_demo_trip",
            timestamp,
            user: `${operator.name} (Tài khoản hiện có)`,
            action: "TẠO MỚI TRIPS",
            details: "Dữ liệu mô phỏng: lập hai chuyến và phân công cho tài khoản hiện có.",
            status: "SUCCESS",
            isDemoRecord: true
          }] : []),
          {
            id: "log_demo_application",
            timestamp,
            user: `${applicant.name} (Tài khoản hiện có)`,
            action: "TẠO MỚI ROLEAPPLICATIONS",
            details: "Dữ liệu mô phỏng: gửi hồ sơ ứng tuyển tài xế đang chờ duyệt.",
            status: "SUCCESS",
            isDemoRecord: true
          }
        ]
      };

      Object.entries(demoScenario).forEach(([entity, additions]) => {
        const records = this.get(entity);
        const existingIds = new Set(records.map((record) => record.id));
        const newRecords = additions.filter((record) => !existingIds.has(record.id));
        if (newRecords.length) {
          localStorage.setItem(STORAGE_PREFIX + entity, JSON.stringify([...newRecords, ...records]));
        }
      });
      localStorage.setItem(demoScenarioKey, "true");
      }
    }

    const largeCarScenarioKey = STORAGE_PREFIX + "large_car_scenario_v1_migrated";
    if (!localStorage.getItem(largeCarScenarioKey)) {
      const users = this.get("users");
      const isEligibleCarDriver = (user) => {
        if (!user || user.isSuspended) return false;
        const roles = Array.isArray(user.roles) ? user.roles : [user.role || "rider"];
        const vehicle = user.vehicle || (Array.isArray(user.vehiclesList) ? user.vehiclesList[0] : null);
        const vehicleType = String(vehicle && (vehicle.vehicleType || vehicle.type) || "");
        const totalSeats = Number(vehicle && (vehicle.seatsTotal || vehicle.seats));
        return roles.includes("driver") && /\bcar\b|ô\s*tô|suv|mpv|minibus|xe khách/i.test(vehicleType) &&
          Number.isInteger(totalSeats) && totalSeats >= 7 && totalSeats <= 45;
      };
      const trips = this.get("trips").filter((trip) =>
        !trip.isDemoRecord || isEligibleCarDriver(users.find((user) => user.id === trip.driverId))
      ).map((trip) => {
        if (!trip.isDemoRecord) return trip;
        const driver = users.find((user) => user.id === trip.driverId);
        const vehicle = driver.vehicle || (Array.isArray(driver.vehiclesList) ? driver.vehiclesList[0] : null);
        const occupiedSeats = Math.max(0, Number(trip.totalSeats || 0) - Number(trip.availableSeats || 0));
        const passengerCapacity = Number(vehicle.seatsTotal || vehicle.seats) - 1;
        const totalSeats = Math.min(passengerCapacity, Math.max(occupiedSeats, Number(trip.totalSeats || passengerCapacity)));
        return {
          ...trip,
          driverName: driver.name,
          driverAvatar: driver.avatar || "TX",
          driverPhone: driver.phone || "",
          vehicleType: "car",
          vehicleInfo: vehicle.type || "Ô tô",
          vehiclePlate: vehicle.plate || "",
          totalSeats,
          availableSeats: totalSeats - Math.min(occupiedSeats, totalSeats)
        };
      });
      localStorage.setItem(STORAGE_PREFIX + "trips", JSON.stringify(trips));
      const applications = this.get("roleApplications").map((application) =>
        application.id === "application_demo_driver"
          ? {
            ...application,
            details: {
              ...application.details,
              vehicleType: "SUV/MPV 7 chỗ",
              vehicleModel: "Ô tô mô phỏng",
              vehicleSeats: 7,
              vehiclePlate: "51A-DEMO"
            }
          }
          : application
      );
      localStorage.setItem(STORAGE_PREFIX + "roleApplications", JSON.stringify(applications));
      localStorage.setItem(largeCarScenarioKey, "true");
    }

    window.dispatchEvent(new CustomEvent("commute_storage_synced"));
    console.log("CommuteMatch Storage đã sẵn sàng!");
  },

  /**
   * Lấy toàn bộ danh sách thực thể
   */
  get: function (entity) {
    const raw = localStorage.getItem(STORAGE_PREFIX + entity);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Lỗi đọc dữ liệu:", entity, e);
      return [];
    }
  },

  /**
   * Lấy một bản ghi theo ID
   */
  getById: function (entity, id) {
    const items = this.get(entity);
    return items.find((item) => item.id === id) || null;
  },

  escapeHtml: function (value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  },

  /**
   * Thêm mới một bản ghi
   */
  insert: function (entity, record) {
    const items = this.get(entity);
    if (!record.id) {
      record.id = entity.substring(0, 3) + "_" + Date.now();
    }
    if (!record.createdAt) {
      record.createdAt = new Date().toISOString();
    }
    items.unshift(record);
    localStorage.setItem(STORAGE_PREFIX + entity, JSON.stringify(items));

    this.addAuditLog("TẠO MỚI " + entity.toUpperCase(), "ID: " + record.id);
    window.dispatchEvent(new CustomEvent("commute_storage_updated", { detail: { entity, record, action: "insert" } }));
    return record;
  },

  /**
   * Cập nhật một bản ghi theo ID
   */
  update: function (entity, id, data) {
    const items = this.get(entity);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_PREFIX + entity, JSON.stringify(items));

    this.addAuditLog("CẬP NHẬT " + entity.toUpperCase(), "ID: " + id);
    window.dispatchEvent(new CustomEvent("commute_storage_updated", { detail: { entity, id, action: "update" } }));
    return items[index];
  },

  /**
   * Xóa hoặc Lưu trữ một bản ghi
   */
  delete: function (entity, id) {
    const items = this.get(entity);
    const filtered = items.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_PREFIX + entity, JSON.stringify(filtered));

    this.addAuditLog("XÓA " + entity.toUpperCase(), "ID: " + id);
    window.dispatchEvent(new CustomEvent("commute_storage_updated", { detail: { entity, id, action: "delete" } }));
    return true;
  },

  /**
   * Lấy cấu hình hệ thống
   */
  getSettings: function () {
    const raw = localStorage.getItem(STORAGE_PREFIX + "settings");
    return raw ? JSON.parse(raw) : window.COMMUTE_MOCK_DATA.settings;
  },

  /**
   * Cập nhật cấu hình hệ thống
   */
  saveSettings: function (newSettings) {
    localStorage.setItem(STORAGE_PREFIX + "settings", JSON.stringify(newSettings));
    this.addAuditLog("CẤU HÌNH HỆ THỐNG", "Cập nhật tham số nền tảng");
    window.dispatchEvent(new CustomEvent("commute_storage_updated", { detail: { entity: "settings" } }));
  },

  /**
   * Lấy thông tin tài khoản đang đăng nhập hiện tại (null nếu là khách vãng lai)
   */
  getCurrentUser: function () {
    const userId = localStorage.getItem(STORAGE_PREFIX + "current_user_id");
    if (!userId) return null;
    return this.getById("users", userId) || null;
  },

  getNotificationsForUser: function (userId) {
    const currentUserId = userId || (this.getCurrentUser() || {}).id;
    if (!currentUserId) return [];
    return this.get("notifications").filter((notification) => notification.userId === currentUserId);
  },

  getChatParticipantIds: function (userId) {
    const currentUserId = userId || (this.getCurrentUser() || {}).id;
    if (!currentUserId) return [];

    const trips = this.get("trips");
    const requests = this.get("joinRequests");
    const participants = new Set();
    trips.forEach((trip) => {
      const tripRequests = requests.filter((request) =>
        request.tripId === trip.id &&
        !["rejected", "declined", "cancelled"].includes(request.status)
      );
      const isDriver = trip.driverId === currentUserId;
      const isCoordinator = trip.createdBy === currentUserId || trip.coordinatorId === currentUserId;
      const isRider = tripRequests.some((request) => request.riderId === currentUserId);

      if (isDriver || isCoordinator || isRider) {
        if (trip.driverId !== currentUserId && trip.driverId) participants.add(trip.driverId);
        if (trip.createdBy !== currentUserId && trip.createdBy) participants.add(trip.createdBy);
        if (trip.coordinatorId !== currentUserId && trip.coordinatorId) participants.add(trip.coordinatorId);
        tripRequests.forEach((request) => {
          if (request.riderId !== currentUserId && request.riderId) participants.add(request.riderId);
        });
      }
    });
    this.get("messages").forEach((message) => {
      if (message.senderId !== currentUserId && message.receiverId !== currentUserId) return;
      if (!message.tripId) return;
      const trip = trips.find((item) => item.id === message.tripId);
      if (!trip || !["scheduled", "completed"].includes(trip.status)) return;
      const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      if (trip.driverId === currentUserId || trip.driverId === otherUserId) {
        participants.add(otherUserId);
      }
    });
    participants.delete(currentUserId);
    return Array.from(participants);
  },

  canChatWith: function (userId, recipientId, tripId) {
    if (!recipientId || recipientId === userId) return false;
    if (this.getChatParticipantIds(userId).includes(recipientId)) return true;
    if (!tripId) return false;

    const trip = this.getById("trips", tripId);
    const rider = this.getById("users", userId);
    const driver = this.getById("users", recipientId);
    const riderRoles = rider && (Array.isArray(rider.roles) ? rider.roles : [rider.role || "rider"]);
    const driverRoles = driver && (Array.isArray(driver.roles) ? driver.roles : [driver.role || "rider"]);
    return Boolean(
      trip &&
      trip.status === "scheduled" &&
      trip.driverId === recipientId &&
      rider &&
      driver &&
      riderRoles.includes("rider") &&
      driverRoles.includes("driver")
    );
  },

  /**
   * Thiết lập tài khoản đang đăng nhập
   */
  setCurrentUser: function (userId) {
    if (userId) {
      localStorage.setItem(STORAGE_PREFIX + "current_user_id", userId);
    } else {
      localStorage.removeItem(STORAGE_PREFIX + "current_user_id");
    }
    window.dispatchEvent(new CustomEvent("commute_user_changed", { detail: { userId } }));
  },

  /**
   * Ghi log kiểm toán tự động
   */
  addAuditLog: function (action, details) {
    try {
      const logs = this.get("auditLogs");
      const user = this.getCurrentUser();
      const newLog = {
        id: "log_" + Date.now(),
        timestamp: new Date().toLocaleString("vi-VN"),
        user: user ? `${user.name} (${user.roleLabel})` : "Khách vãng lai",
        action: action,
        details: details,
        status: "SUCCESS"
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_PREFIX + "auditLogs", JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.warn("Không thể ghi log:", e);
    }
  }
};

// Tự động khởi tạo ngay khi nạp file
window.Storage.initDefaults();
