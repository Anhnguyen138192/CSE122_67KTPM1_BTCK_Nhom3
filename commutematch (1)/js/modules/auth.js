/**
 * COMMUTEMATCH AUTH & ROLE MANAGEMENT MODULE
 * Học phần: CSE122 - BTL-06 CommuteMatch
 * Quản lý phiên đăng nhập, phân quyền vai trò và bảo vệ trang
 */

window.Auth = {
  // Bản đồ vai trò sang trang đích mặc định
  ROLE_DASHBOARDS: {
    rider: "rider-dashboard.html",
    driver: "driver-dashboard.html",
    coordinator: "coordinator-mobility-dashboard.html",
    admin: "admin-dashboard.html",
    superadmin: "admin-dashboard.html"
  },

  ROLE_LABELS: {
    rider: "Hành khách",
    driver: "Tài xế",
    coordinator: "Điều phối viên",
    admin: "Quản trị viên",
    superadmin: "Super Admin"
  },

  SUPERADMIN_VERIFICATION_KEY: "commutematch_superadmin_verified_user",

  isSuperAdminVerified: function (user) {
    const currentUser = user || this.getCurrentUser();
    if (!currentUser) return false;
    const verification = sessionStorage.getItem(this.SUPERADMIN_VERIFICATION_KEY) || "";
    const [userId, verifiedAt] = verification.split("|");
    return userId === currentUser.id &&
      Number.isFinite(Number(verifiedAt)) &&
      Date.now() - Number(verifiedAt) < 15 * 60 * 1000;
  },

  verifySuperAdmin: function (identifier, password, securityAnswer) {
    const currentUser = this.getCurrentUser();
    const cleanId = (identifier || "").trim().toLowerCase();
    const rootAccount = window.Storage.getById("users", "u_longchieusigma");
    const roles = rootAccount && Array.isArray(rootAccount.roles) ? rootAccount.roles : [];
    if (!currentUser || currentUser.role !== "superadmin" || !rootAccount || currentUser.id !== rootAccount.id ||
        !roles.includes("superadmin") || !roles.includes("admin") ||
        cleanId !== "longchieusigma" || password !== rootAccount.password || rootAccount.isSuspended ||
        (securityAnswer || "").trim().toLowerCase() !== "longchill") {
      return { success: false, message: "Xin lỗi đó khp ng đẹp zai nhất thế giới!" };
    }

    sessionStorage.setItem(this.SUPERADMIN_VERIFICATION_KEY, `${currentUser.id}|${Date.now()}`);
    window.Storage.addAuditLog("XÁC THỰC SUPER ADMIN", `${currentUser.name} xác thực lại thành công`);
    return { success: true, message: "Xác thực thành công." };
  },

  canManageRoles: function (user) {
    return Boolean(user && ["coordinator", "admin", "superadmin"].includes(user.role));
  },

  manageableRoles: function (user) {
    if (!user) return [];
    if (user.role === "superadmin") return ["rider", "driver", "coordinator", "admin"];
    if (user.role === "admin") return ["rider", "driver", "coordinator"];
    if (user.role === "coordinator") return ["rider", "driver"];
    return [];
  },

  canManageUserRoles: function (actor, target) {
    if (!actor || !target || actor.id === target.id) return false;
    if (actor.role === "superadmin") return true;

    const targetRoles = Array.isArray(target.roles) ? target.roles : [target.role || "rider"];
    if (targetRoles.some((role) => ["admin", "superadmin"].includes(role))) return false;
    if (actor.role === "admin") return true;
    if (actor.role === "coordinator") {
      return !targetRoles.includes("coordinator") &&
        targetRoles.some((role) => ["rider", "driver"].includes(role));
    }
    return false;
  },

  getCurrentUser: function () {
    const user = window.Storage.getCurrentUser();
    if (!user) return null;
    if (user.isSuspended) {
      sessionStorage.removeItem(this.SUPERADMIN_VERIFICATION_KEY);
      window.Storage.setCurrentUser(null);
      return null;
    }

    if (!Array.isArray(user.roles)) {
      user.roles = [user.role || "rider"];
      window.Storage.update("users", user.id, { roles: user.roles });
    }
    if (!user.roles.includes(user.role)) {
      user.role = user.roles[0] || "rider";
      window.Storage.update("users", user.id, { role: user.role });
    }
    if (user.roles.includes("superadmin") && !user.roles.includes("admin")) {
      user.roles.push("admin");
      window.Storage.update("users", user.id, { roles: user.roles });
    }
    return user;
  },

  isLoggedIn: function () {
    return this.getCurrentUser() !== null;
  },

  /**
   * Đăng nhập bằng tên đăng nhập hoặc Email
   */
  login: function (identifier, password) {
    const users = window.Storage.get("users");
    const cleanId = (identifier || "").trim().toLowerCase();

    // Tìm kiếm theo tên đăng nhập hoặc Email
    const user = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === cleanId) ||
        (u.email && u.email.toLowerCase() === cleanId)
    );

    if (!user) {
      return { success: false, message: "Tài khoản không tồn tại trong hệ thống!" };
    }

    if (user.isSuspended) {
      return { success: false, message: "Tài khoản này đã bị khóa do vi phạm quy tắc an toàn!" };
    }
    const accountRoles = Array.isArray(user.roles) ? user.roles : [user.role || "rider"];
    if (accountRoles.includes("superadmin") && !accountRoles.includes("admin")) {
      return { success: false, message: "Tài khoản Super Admin phải giữ quyền Quản trị viên để đăng nhập." };
    }

    // So khớp mật khẩu được lưu cho tài khoản.
    const validPassword = user.password;
    if (password !== validPassword) {
      return { success: false, message: "Mật khẩu không chính xác! Vui lòng thử lại." };
    }

    // Đăng nhập thành công
    sessionStorage.removeItem(this.SUPERADMIN_VERIFICATION_KEY);
    window.Storage.setCurrentUser(user.id);
    window.Storage.addAuditLog("ĐĂNG NHẬP", `Người dùng ${user.name} đăng nhập thành công`);
    return { success: true, user: user };
  },

  /**
   * Chỉ chuyển được sang vai trò đã được cấp cho chính tài khoản hiện tại.
   */
  switchRole: function (role) {
    const user = this.getCurrentUser();
    const roleLabels = {
      rider: "Hành khách",
      driver: "Tài xế",
      coordinator: "Điều phối viên",
      admin: "Quản trị viên",
      superadmin: "Super Admin"
    };

    if (!user || !Array.isArray(user.roles) || user.roles.length < 2 || !user.roles.includes(role) ||
        (role === "superadmin" && !user.roles.includes("admin"))) {
      if (window.Toast) {
        window.Toast.show("Bạn chỉ có thể chuyển sang vai trò đã được cấp. Hãy ứng tuyển để nhận thêm vai trò.", "warning");
      }
      return false;
    }

    window.Storage.update("users", user.id, { role, roleLabel: roleLabels[role] });
    sessionStorage.removeItem(this.SUPERADMIN_VERIFICATION_KEY);
    if (window.Toast) window.Toast.show(`Đã chuyển sang vai trò: ${roleLabels[role]}`, "success");
    setTimeout(() => {
      window.location.href = role === "superadmin" ? "superadmin-auth.html" : this.ROLE_DASHBOARDS[role] || "index.html";
    }, 350);
    return true;
  },

  setManagedRole: function (targetUserId, role, enabled) {
    const actor = this.getCurrentUser();
    const target = window.Storage.getById("users", targetUserId);
    const allowedRoles = this.manageableRoles(actor);

    if (!this.canManageRoles(actor) || !target || !allowedRoles.includes(role) ||
        !this.canManageUserRoles(actor, target)) {
      if (this.canManageRoles(actor) && target && !this.canManageUserRoles(actor, target)) {
        const message = actor.role === "admin"
          ? "Admin không thể thay đổi vai trò của tài khoản Admin hoặc Super Admin."
          : actor.role === "coordinator"
            ? "Điều phối viên chỉ có thể thay đổi vai trò của tài khoản Hành khách hoặc Tài xế."
            : "Bạn không thể thay đổi vai trò của chính mình.";
        return { success: false, message };
      }
      return { success: false, message: "Bạn không có quyền thay đổi vai trò này." };
    }
    if (role === "superadmin") {
      return { success: false, message: "Quyền Super Admin chỉ được giữ sẵn cho tài khoản gốc, không thể cấp hoặc tước." };
    }
    if (role === "rider" && !enabled) {
      return { success: false, message: "Không thể tước vai trò Hành khách khỏi tài khoản." };
    }

    const roles = Array.isArray(target.roles) ? [...target.roles] : [target.role || "rider"];
    const hasRole = roles.includes(role);
    if (hasRole === enabled) {
      return { success: true, message: enabled ? "Tài khoản đã có vai trò này." : "Tài khoản không có vai trò này." };
    }
    const nextRoles = enabled ? [...roles, role] : roles.filter((item) => item !== role);
    if (!nextRoles.length) {
      return { success: false, message: "Tài khoản phải có ít nhất một vai trò." };
    }
    const activeRole = nextRoles.includes(target.role) ? target.role : nextRoles[0];
    window.Storage.update("users", target.id, {
      roles: nextRoles,
      role: activeRole,
      roleLabel: this.ROLE_LABELS[activeRole]
    });
    window.Storage.addAuditLog(
      enabled ? "CẤP VAI TRÒ" : "TƯỚC VAI TRÒ",
      `${actor.name} ${enabled ? "cấp" : "tước"} ${this.ROLE_LABELS[role]} cho ${target.name}`
    );
    return { success: true, message: `${enabled ? "Đã cấp" : "Đã tước"} quyền ${this.ROLE_LABELS[role]} cho ${target.name}.` };
  },

  setAccountSuspended: function (targetUserId, suspended) {
    const actor = this.getCurrentUser();
    const target = window.Storage.getById("users", targetUserId);
    const targetRoles = target && (Array.isArray(target.roles) ? target.roles : [target.role || "rider"]);
    const isRootAccount = target && (target.id === "u_longchieusigma" || target.username === "longchieusigma");

    if (!actor || !["admin", "superadmin"].includes(actor.role) || !target) {
      return { success: false, message: "Bạn không có quyền khóa hoặc mở khóa tài khoản này." };
    }
    if (actor.id === target.id) {
      return { success: false, message: "Bạn không thể khóa tài khoản đang sử dụng." };
    }
    if (isRootAccount) {
      return { success: false, message: "Không thể khóa tài khoản Super Admin gốc." };
    }
    if (actor.role !== "superadmin" && targetRoles.some((role) => ["admin", "superadmin"].includes(role))) {
      return { success: false, message: "Admin chỉ có thể khóa hoặc mở khóa tài khoản không phải Admin." };
    }
    if (target.isSuspended === suspended) {
      return {
        success: false,
        message: suspended ? "Tài khoản này đã bị khóa." : "Tài khoản này hiện đang hoạt động."
      };
    }

    window.Storage.update("users", target.id, { isSuspended: suspended });
    window.Storage.addAuditLog(
      suspended ? "KHÓA TÀI KHOẢN" : "MỞ KHÓA TÀI KHOẢN",
      `${actor.name} ${suspended ? "khóa" : "mở khóa"} tài khoản ${target.name}`
    );
    return {
      success: true,
      message: `Đã ${suspended ? "khóa" : "mở khóa"} tài khoản ${target.name}.`
    };
  },

  submitRoleApplication: function (role, details) {
    const user = this.getCurrentUser();
    if (!user || !["driver", "coordinator"].includes(role)) {
      return { success: false, message: "Bạn cần đăng nhập để gửi đơn ứng tuyển hợp lệ." };
    }
    if ((user.roles || [user.role]).includes(role)) {
      return { success: false, message: "Tài khoản đã có vai trò này." };
    }

    const applications = window.Storage.get("roleApplications");
    const existing = applications.find((application) =>
      application.userId === user.id &&
      application.role === role &&
      application.status === "pending"
    );
    if (existing) {
      return { success: false, message: "Đơn ứng tuyển vai trò này đang chờ duyệt." };
    }

    window.Storage.insert("roleApplications", {
      userId: user.id,
      userName: user.name,
      role,
      details,
      status: "pending"
    });
    return { success: true, message: "Đã gửi đơn ứng tuyển. Quản trị viên sẽ xem xét và phản hồi." };
  },

  reviewRoleApplication: function (applicationId, approved) {
    const user = this.getCurrentUser();
    if (!user || !["admin", "superadmin"].includes(user.role)) {
      return { success: false, message: "Chỉ quản trị viên hoặc Super Admin mới được xử lý đơn ứng tuyển." };
    }

    const application = window.Storage.getById("roleApplications", applicationId);
    if (!application || application.status !== "pending") {
      return { success: false, message: "Đơn ứng tuyển không còn ở trạng thái chờ duyệt." };
    }

    const applicant = window.Storage.getById("users", application.userId);
    if (!applicant) {
      return { success: false, message: "Không tìm thấy tài khoản ứng viên." };
    }

    const status = approved ? "approved" : "rejected";
    if (approved) {
      const roles = Array.isArray(applicant.roles) ? applicant.roles : [applicant.role || "rider"];
      if (!roles.includes(application.role)) roles.push(application.role);
      window.Storage.update("users", applicant.id, { roles });
    }
    window.Storage.update("roleApplications", applicationId, {
      status,
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString()
    });
    return { success: true, message: approved ? "Đã duyệt và cấp vai trò mới." : "Đã từ chối đơn ứng tuyển." };
  },

  /**
   * Đăng xuất khỏi hệ thống
   */
  logout: function () {
    sessionStorage.removeItem(this.SUPERADMIN_VERIFICATION_KEY);
    window.Storage.setCurrentUser(null);
    if (window.Toast) {
      window.Toast.show("Đã đăng xuất khỏi tài khoản.", "info");
    }
    setTimeout(() => {
      window.location.href = "index.html";
    }, 400);
  },

  /**
   * Bộ lọc bảo vệ trang (Auth Route Guard):
   * Tự động chuyển hướng về login.html nếu chưa đăng nhập,
   * hoặc 403.html nếu không đủ quyền.
   */
  requireAuth: function (allowedRoles = []) {
    const user = this.getCurrentUser();
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    if (!user) {
      console.warn(`Chưa đăng nhập! Chuyển hướng từ ${currentPage} về login.html`);
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
      return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      console.warn(`Truy cập bị từ chối: [${user.role}] không thuộc [${allowedRoles.join(", ")}]`);
      window.location.href = "403.html";
      return false;
    }

    return true;
  }
};
