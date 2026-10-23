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
  initDefaults: function (forceReset = false) {
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
      if (forceReset || !localStorage.getItem(key)) {
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

    if (forceReset) {
      localStorage.removeItem(STORAGE_PREFIX + "current_user_id");
    }

    window.dispatchEvent(new CustomEvent("commute_storage_synced"));
    console.log("CommuteMatch Storage đã sẵn sàng!");
  },

  /**
   * Khôi phục toàn bộ dữ liệu về trạng thái mẫu ban đầu
   */
  resetDefaults: function () {
    this.initDefaults(true);
    if (window.Toast) {
      window.Toast.show("Đã khôi phục dữ liệu mẫu ban đầu thành công! Hãy đăng nhập để tiếp tục.", "success");
    }
    setTimeout(() => {
      window.location.href = "login.html";
    }, 700);
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
