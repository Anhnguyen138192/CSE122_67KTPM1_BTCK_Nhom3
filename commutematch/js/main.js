/**
 * COMMUTEMATCH MASTER APPLICATION LOGIC & UI SHELL
 * Học phần: CSE122 - BTL-06 CommuteMatch
 * Tự động đồng bộ Header, Sidebar theo Role, Chuyển đổi giao diện sáng/tối, Route Guard
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  handlePageAuthGuard();
  renderAppHeader();
  renderAppSidebar();
  renderAppFooter();
  initMobileNav();
});

function cmRoute(target) {
  return window.CommuteMatchRoutes ? window.CommuteMatchRoutes.page(target) : target;
}

/**
 * Kiểm tra quyền truy cập trang tự động (Page Auth Guard)
 */
function handlePageAuthGuard() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const publicPages = [
    "index.html",
    "about.html",
    "safety-guidelines.html",
    "terms-and-privacy.html",
    "login.html",
    "register.html",
    "forgot-password.html",
    "superadmin-auth.html",
    "403.html",
    "404.html"
  ];

  // Nếu là trang nội bộ yêu cầu đăng nhập
  if (!publicPages.includes(currentPath)) {
    const user = window.Auth.getCurrentUser();
    if (!user) {
      window.location.href = cmRoute(`login.html?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (user.role === "superadmin" && currentPath !== "superadmin-auth.html" &&
        !window.Auth.isSuperAdminVerified(user)) {
      window.location.href = cmRoute(`superadmin-auth.html?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Kiểm tra phân quyền role tương ứng
    if (currentPath.startsWith("admin-") && currentPath !== "admin-user-management.html" &&
        !["admin", "superadmin"].includes(user.role)) {
      window.location.href = cmRoute("403.html");
      return;
    }
    if (currentPath === "admin-user-management.html" &&
        !["coordinator", "admin", "superadmin"].includes(user.role)) {
      window.location.href = cmRoute("403.html");
      return;
    }
    if (currentPath.startsWith("coordinator-") && !["coordinator", "admin", "superadmin"].includes(user.role)) {
      window.location.href = cmRoute("403.html");
      return;
    }
    if (currentPath.startsWith("driver-") && !["driver", "admin", "superadmin"].includes(user.role)) {
      window.location.href = cmRoute("403.html");
      return;
    }
  }
}

/**
 * Khởi tạo chế độ Sáng / Tối
 */
function initTheme() {
  const savedTheme = localStorage.getItem("commutematch_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("commutematch_theme", next);
  if (window.Toast) {
    window.Toast.show(`Đã chuyển sang chế độ ${next === "dark" ? "Tối (Dark Mode)" : "Sáng (Light Mode)"}`, "info");
  }
}

/**
 * Tự động tạo Navbar Header trên mọi trang
 * (Phân định rõ ràng: Chưa đăng nhập = Khách vãng lai | Đã đăng nhập = Hồ sơ & Vai trò)
 */
function renderAppHeader() {
  const headerContainer = document.getElementById("app-header");
  if (!headerContainer) return;

  const currentUser = window.Auth.getCurrentUser();
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.documentElement.setAttribute("data-role", currentUser ? currentUser.role : "");

  // TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP (KHÁCH VÃNG LAI)
  if (!currentUser) {
    headerContainer.innerHTML = `
      <nav class="navbar">
        <div class="d-flex items-center gap-2">
          <a href="${cmRoute("index.html")}" class="navbar-brand">
            <div class="brand-icon"><i class='fas fa-car fa-ui-icon' aria-hidden='true'></i></div>
            <span>Commute<span style="color: var(--primary);">Match</span></span>
          </a>
        </div>

        <ul class="navbar-nav d-none d-md-flex">
          <li><a href="${cmRoute("index.html")}" class="nav-link ${currentPath === 'index.html' ? 'active' : ''}">Trang chủ</a></li>
          <li><a href="${cmRoute("about.html")}" class="nav-link ${currentPath === 'about.html' ? 'active' : ''}">Giới thiệu</a></li>
          <li><a href="${cmRoute("safety-guidelines.html")}" class="nav-link ${currentPath === 'safety-guidelines.html' ? 'active' : ''}">Cẩm nang an toàn</a></li>
        </ul>

        <div class="d-flex items-center gap-2">
          <!-- Chuyển theme -->
          <button class="btn btn-outline btn-sm" onclick="toggleTheme()" title="Chuyển chế độ Sáng/Tối"><i class='fas fa-moon fa-ui-icon' aria-hidden='true'></i></button>
          <!-- Nút Đăng nhập / Đăng ký chuẩn chỉ -->
          <a href="${cmRoute("login.html")}" class="btn btn-outline btn-sm">Đăng Nhập</a>
          <a href="${cmRoute("register.html")}" class="btn btn-primary btn-sm">Đăng Ký Tham Gia</a>
        </div>
      </nav>
    `;
    return;
  }

  // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP
  const unreadNotifs = window.Storage.getNotificationsForUser(currentUser.id).filter((n) => n.unread).length;
  const grantedRoles = Array.isArray(currentUser.roles) ? currentUser.roles : [currentUser.role];
  const roleLabels = {
    rider: "Hành khách",
    driver: "Tài xế",
    coordinator: "Điều phối viên",
    admin: "Quản trị viên",
    superadmin: "Super Admin"
  };
  const roleSwitcher = grantedRoles.length >= 2 ? `
    <div class="role-switcher-box">
      <span class="role-switcher-label"><i class='fas fa-theater-masks fa-ui-icon' aria-hidden='true'></i> Đổi vai trò:</span>
      <select class="role-select" id="globalRoleSelect" onchange="window.Auth.switchRole(this.value)">
        ${grantedRoles.map((role) => `<option value="${role}" ${currentUser.role === role ? "selected" : ""}>${roleLabels[role] || role}</option>`).join("")}
      </select>
    </div>
  ` : "";

  headerContainer.innerHTML = `
    <nav class="navbar">
      <div class="d-flex items-center gap-2">
        <button class="menu-toggle-btn" id="menuToggleBtn" title="Mở danh mục menu"><i class='fas fa-bars fa-ui-icon' aria-hidden='true'></i></button>
        <a href="${cmRoute("index.html")}" class="navbar-brand">
          <div class="brand-icon"><i class='fas fa-car fa-ui-icon' aria-hidden='true'></i></div>
          <span>Commute<span style="color: var(--primary);">Match</span></span>
        </a>
      </div>

      ${roleSwitcher}

      <div class="d-flex items-center gap-2">
        <a href="${cmRoute("role-applications.html")}" class="btn btn-outline btn-sm">Ứng tuyển vai trò</a>
        <!-- Chuyển theme -->
        <button class="btn btn-outline btn-sm" onclick="toggleTheme()" title="Chuyển chế độ Sáng/Tối"><i class='fas fa-moon fa-ui-icon' aria-hidden='true'></i></button>

        <!-- Thông báo -->
        <a href="${cmRoute("notifications-center.html")}" class="btn btn-outline btn-sm" style="position: relative;" title="Trung tâm thông báo">
          <i class='fas fa-bell fa-ui-icon' aria-hidden='true'></i>
          ${unreadNotifs > 0 ? `<span class="badge badge-danger" style="position: absolute; top: -5px; right: -5px; font-size: 0.65rem; padding: 2px 5px;">${unreadNotifs}</span>` : ""}
        </a>

        <!-- Tin nhắn -->
        <a href="${cmRoute("messages-chat.html")}" class="btn btn-outline btn-sm" title="Tin nhắn"><i class='fas fa-comment-dots fa-ui-icon' aria-hidden='true'></i></a>

        <!-- User profile avatar & Logout dropdown trigger -->
        <div class="d-flex items-center gap-2" style="position: relative;">
          <a href="${cmRoute("profile-overview.html")}" class="user-menu" title="Xem hồ sơ cá nhân">
            <div class="avatar" style="background-color: ${currentUser.avatarColor || "var(--primary-light)"}; color: white;">
              ${currentUser.avatarImage
                ? `<img src="${window.Storage.escapeHtml(currentUser.avatarImage)}" alt="Ảnh đại diện" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
                : currentUser.avatar || "U"}
            </div>
            <div style="line-height: 1.2;" class="d-none d-md-block">
              <div style="font-weight: 700; font-size: 0.88rem;">${currentUser.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${currentUser.roleLabel}</div>
            </div>
          </a>
          <button class="btn btn-outline btn-sm text-danger" onclick="window.Auth.logout()" title="Đăng xuất khỏi tài khoản" style="font-size: 0.8rem; padding: 0.35rem 0.6rem;">
            <i class='fas fa-sign-out-alt fa-ui-icon' aria-hidden='true'></i> Thoát
          </button>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Tự động tạo Menu Sidebar theo từng Vai trò
 */
function renderAppSidebar() {
  const sidebarContainer = document.getElementById("app-sidebar");
  if (!sidebarContainer) return;

  const user = window.Auth.getCurrentUser();
  if (!user) {
    sidebarContainer.innerHTML = "";
    return;
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const menusByRole = {
    rider: [
      { header: "Nghiệp vụ Hành khách" },
      { label: "Bảng điều khiển", icon: "<i class='fas fa-chart-bar fa-ui-icon' aria-hidden='true'></i>", url: "rider-dashboard.html" },
      { label: "Tìm chuyến đi", icon: "<i class='fas fa-search fa-ui-icon' aria-hidden='true'></i>", url: "rider-trip-search.html" },
      { label: "Kết quả AI Match", icon: "<i class='fas fa-magic fa-ui-icon' aria-hidden='true'></i>", url: "rider-match-results.html", ai: true },
      { label: "Chuyến đi của tôi", icon: "<i class='fas fa-ticket-alt fa-ui-icon' aria-hidden='true'></i>", url: "rider-my-trips.html" },
      { label: "Theo dõi chuyến xe", icon: "<i class='fas fa-map-marker-alt fa-ui-icon' aria-hidden='true'></i>", url: "rider-trip-tracking.html" },
      { label: "Đánh giá chuyến đi", icon: "<i class='fas fa-star fa-ui-icon' aria-hidden='true'></i>", url: "rider-trip-review.html" },
      { header: "Tài khoản & Giao tiếp" },
      { label: "Tin nhắn chuyến đi", icon: "<i class='fas fa-comment-dots fa-ui-icon' aria-hidden='true'></i>", url: "messages-chat.html" },
      { label: "Hồ sơ & Điểm uy tín", icon: "<i class='fas fa-user fa-ui-icon' aria-hidden='true'></i>", url: "profile-overview.html" },
      { label: "Ứng tuyển vai trò", icon: "<i class='fas fa-edit fa-ui-icon' aria-hidden='true'></i>", url: "role-applications.html" },
      { label: "Cẩm nang an toàn", icon: "<i class='fas fa-shield-alt fa-ui-icon' aria-hidden='true'></i>", url: "safety-guidelines.html" }
    ],
    driver: [
      { header: "Nghiệp vụ Tài xế" },
      { label: "Bảng điều khiển", icon: "<i class='fas fa-chart-bar fa-ui-icon' aria-hidden='true'></i>", url: "driver-dashboard.html" },
      { label: "Lịch chạy của tôi", icon: "<i class='fas fa-calendar-alt fa-ui-icon' aria-hidden='true'></i>", url: "driver-schedule.html" },
      { label: "Yêu cầu ghép chuyến", icon: "<i class='fas fa-users fa-ui-icon' aria-hidden='true'></i>", url: "driver-join-requests.html" },
      { label: "Điều hành chuyến đi", icon: "<i class='fas fa-traffic-light fa-ui-icon' aria-hidden='true'></i>", url: "driver-trip-execution.html" },
      { label: "Lịch sử bù xăng", icon: "<i class='fas fa-money-bill-wave fa-ui-icon' aria-hidden='true'></i>", url: "driver-earnings-history.html" },
      { header: "Tài khoản & Xe" },
      { label: "Phương tiện cá nhân", icon: "<i class='fas fa-car fa-ui-icon' aria-hidden='true'></i>", url: "profile-vehicles.html" },
      { label: "Tin nhắn khách", icon: "<i class='fas fa-comment-dots fa-ui-icon' aria-hidden='true'></i>", url: "messages-chat.html" },
      { label: "Hồ sơ tài xế", icon: "<i class='fas fa-user fa-ui-icon' aria-hidden='true'></i>", url: "profile-overview.html" },
      { label: "Ứng tuyển vai trò", icon: "<i class='fas fa-edit fa-ui-icon' aria-hidden='true'></i>", url: "role-applications.html" }
    ],
    coordinator: [
      { header: "Điều phối & Lưu lượng" },
      { label: "Dashboard lưu lượng", icon: "<i class='fas fa-chart-line fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-mobility-dashboard.html" },
      { label: "Lập & phân công chuyến", icon: "<i class='fas fa-map-marked-alt fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-trip-management.html" },
      { label: "Bản đồ nhiệt AI", icon: "<i class='fas fa-fire fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-demand-heatmap.html", ai: true },
      { label: "Quản lý trạm đón", icon: "<i class='fas fa-map-signs fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-pickup-zone-management.html" },
      { label: "Kiểm định ô tô", icon: "<i class='fas fa-car-side fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-vehicle-inspection.html" },
      { label: "Duyệt hồ sơ tài xế", icon: "<i class='fas fa-edit fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-driver-applications.html" },
      { label: "Thêm / Sửa trạm đón", icon: "<i class='fas fa-edit fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-pickup-zone-editor.html" },
      { header: "Sự cố & Hòa giải" },
      { label: "Trung tâm báo cáo", icon: "<i class='fas fa-exclamation-triangle fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-report-center.html" },
      { label: "Cấp / tước quyền", icon: "<i class='fas fa-lock fa-ui-icon' aria-hidden='true'></i>", url: "admin-user-management.html" },
      { label: "Cẩm nang an toàn", icon: "<i class='fas fa-shield-alt fa-ui-icon' aria-hidden='true'></i>", url: "safety-guidelines.html" }
    ],
    admin: [
      { header: "Quản trị hệ thống" },
      { label: "Bảng điều hành Admin", icon: "<i class='fas fa-bolt fa-ui-icon' aria-hidden='true'></i>", url: "admin-dashboard.html" },
      { label: "Cấp / tước quyền", icon: "<i class='fas fa-lock fa-ui-icon' aria-hidden='true'></i>", url: "admin-user-management.html" },
      { label: "Duyệt đơn ứng tuyển", icon: "<i class='fas fa-edit fa-ui-icon' aria-hidden='true'></i>", url: "admin-role-applications.html" },
      { label: "Kiểm toán chuyến đi", icon: "<i class='fas fa-search fa-ui-icon' aria-hidden='true'></i>", url: "admin-trip-audit.html" },
      { label: "Cấu hình nền tảng", icon: "<i class='fas fa-cogs fa-ui-icon' aria-hidden='true'></i>", url: "admin-platform-settings.html" },
      { label: "Nhật ký hệ thống", icon: "<i class='fas fa-scroll fa-ui-icon' aria-hidden='true'></i>", url: "admin-system-logs.html" },
      { header: "Liên kết nhanh" },
      { label: "Quản lý trạm đón", icon: "<i class='fas fa-map-signs fa-ui-icon' aria-hidden='true'></i>", url: "coordinator-pickup-zone-management.html" }
    ],
    superadmin: [
      { header: "SUPER ADMIN" },
      { label: "Bảng điều hành", icon: "<i class='fas fa-circle fa-ui-icon' aria-hidden='true'></i>", url: "admin-dashboard.html" },
      { label: "Cấp / tước mọi quyền", icon: "<i class='fas fa-lock fa-ui-icon' aria-hidden='true'></i>", url: "admin-user-management.html" },
      { label: "Duyệt đơn ứng tuyển", icon: "<i class='fas fa-edit fa-ui-icon' aria-hidden='true'></i>", url: "admin-role-applications.html" },
      { label: "Kiểm toán chuyến đi", icon: "<i class='fas fa-search fa-ui-icon' aria-hidden='true'></i>", url: "admin-trip-audit.html" },
      { label: "Cấu hình nền tảng", icon: "<i class='fas fa-cogs fa-ui-icon' aria-hidden='true'></i>", url: "admin-platform-settings.html" },
      { label: "Nhật ký hệ thống", icon: "<i class='fas fa-scroll fa-ui-icon' aria-hidden='true'></i>", url: "admin-system-logs.html" }
    ]
  };

  const navItems = menusByRole[user.role] || menusByRole.rider;

  let html = `
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>
    <aside class="app-sidebar" id="appSidebar">
      <div style="padding: 1rem 1.25rem 0.5rem; display: flex; align-items: center; justify-content: space-between;">
        <span class="badge ${user.role === "superadmin" ? "badge-superadmin" : user.role === "rider" ? "badge-primary" : user.role === "driver" ? "badge-info" : user.role === "coordinator" ? "badge-ai" : "badge-danger"}">
          Vai trò: ${user.roleLabel}
        </span>
      </div>
      <ul class="sidebar-nav">
  `;

  navItems.forEach((item) => {
    if (item.header) {
      html += `<li class="sidebar-header">${item.header}</li>`;
    } else {
      const isActive = currentPath === item.url;
      html += `
        <li class="sidebar-item ${isActive ? "active" : ""}">
          <a href="${cmRoute(item.url)}">
            <span>${item.icon}</span>
            <span>${item.label}</span>
            ${item.ai ? `<span class="badge badge-ai" style="font-size: 0.65rem; margin-left: auto;">AI</span>` : ""}
          </a>
        </li>
      `;
    }
  });

  html += `
      </ul>
      <div class="sidebar-footer">
        <button class="btn btn-outline btn-sm btn-block text-danger" onclick="window.Auth.logout()">
          <i class='fas fa-sign-out-alt fa-ui-icon' aria-hidden='true'></i> Đăng Xuất Khỏi Tài Khoản
        </button>
      </div>
    </aside>
  `;

  sidebarContainer.innerHTML = html;
}

/**
 * Tự động tạo Footer ở cuối trang
 */
function renderAppFooter() {
  const footerContainer = document.getElementById("app-footer");
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer style="background-color: var(--bg-surface); border-top: 1px solid var(--border-color); padding: 2rem 0; margin-top: auto; font-size: 0.88rem;">
      <div class="container d-flex justify-between items-center flex-wrap gap-2">
        <div>
          <div style="font-weight: 700; color: var(--text-main); font-size: 1rem;">CommuteMatch – Ghép chuyến đi chung cho cộng đồng</div>
          <div style="color: var(--text-muted); font-size: 0.82rem; margin-top: 0.2rem;">Học phần: Phát triển ứng dụng Web cơ bản – CSE122 (BTL-06)</div>
        </div>
        <div class="d-flex items-center gap-3">
          <a href="${cmRoute("about.html")}">Về chúng tôi</a>
          <a href="${cmRoute("safety-guidelines.html")}">An toàn</a>
          <a href="${cmRoute("terms-and-privacy.html")}">Điều khoản</a>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Điều khiển mở/đóng Sidebar trên di động
 */
function initMobileNav() {
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("#menuToggleBtn");
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (toggleBtn && sidebar && backdrop) {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show");
    }

    if (e.target.id === "sidebarBackdrop") {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    }
  });
}
