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
      window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    if (user.role === "superadmin" && currentPath !== "superadmin-auth.html" &&
        !window.Auth.isSuperAdminVerified(user)) {
      window.location.href = `superadmin-auth.html?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    // Kiểm tra phân quyền role tương ứng
    if (currentPath.startsWith("admin-") && currentPath !== "admin-user-management.html" &&
        !["admin", "superadmin"].includes(user.role)) {
      window.location.href = "403.html";
      return;
    }
    if (currentPath === "admin-user-management.html" &&
        !["coordinator", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "403.html";
      return;
    }
    if (currentPath.startsWith("coordinator-") && !["coordinator", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "403.html";
      return;
    }
    if (currentPath.startsWith("driver-") && !["driver", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "403.html";
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
          <a href="index.html" class="navbar-brand">
            <div class="brand-icon">🚗</div>
            <span>Commute<span style="color: var(--primary);">Match</span></span>
          </a>
        </div>

        <ul class="navbar-nav d-none d-md-flex">
          <li><a href="index.html" class="nav-link ${currentPath === 'index.html' ? 'active' : ''}">Trang chủ</a></li>
          <li><a href="about.html" class="nav-link ${currentPath === 'about.html' ? 'active' : ''}">Giới thiệu</a></li>
          <li><a href="safety-guidelines.html" class="nav-link ${currentPath === 'safety-guidelines.html' ? 'active' : ''}">Cẩm nang an toàn</a></li>
        </ul>

        <div class="d-flex items-center gap-2">
          <!-- Chuyển theme -->
          <button class="btn btn-outline btn-sm" onclick="toggleTheme()" title="Chuyển chế độ Sáng/Tối">🌓</button>
          <!-- Nút Đăng nhập / Đăng ký chuẩn chỉ -->
          <a href="login.html" class="btn btn-outline btn-sm">Đăng Nhập</a>
          <a href="register.html" class="btn btn-primary btn-sm">Đăng Ký Tham Gia</a>
        </div>
      </nav>
    `;
    return;
  }

  // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP
  const unreadNotifs = window.Storage.get("notifications").filter((n) => n.unread).length;
  const grantedRoles = Array.isArray(currentUser.roles) ? currentUser.roles : [currentUser.role];
  const roleLabels = {
    rider: "🟢 Hành khách",
    driver: "🔵 Tài xế",
    coordinator: "🟣 Điều phối viên",
    admin: "🔴 Quản trị viên",
    superadmin: "🟣 Super Admin"
  };
  const roleSwitcher = grantedRoles.length >= 2 ? `
    <div class="role-switcher-box">
      <span class="role-switcher-label">🎭 Đổi vai trò:</span>
      <select class="role-select" id="globalRoleSelect" onchange="window.Auth.switchRole(this.value)">
        ${grantedRoles.map((role) => `<option value="${role}" ${currentUser.role === role ? "selected" : ""}>${roleLabels[role] || role}</option>`).join("")}
      </select>
    </div>
  ` : "";

  headerContainer.innerHTML = `
    <nav class="navbar">
      <div class="d-flex items-center gap-2">
        <button class="menu-toggle-btn" id="menuToggleBtn" title="Mở danh mục menu">☰</button>
        <a href="index.html" class="navbar-brand">
          <div class="brand-icon">🚗</div>
          <span>Commute<span style="color: var(--primary);">Match</span></span>
        </a>
      </div>

      ${roleSwitcher}

      <div class="d-flex items-center gap-2">
        <a href="role-applications.html" class="btn btn-outline btn-sm">Ứng tuyển vai trò</a>
        <!-- Chuyển theme -->
        <button class="btn btn-outline btn-sm" onclick="toggleTheme()" title="Chuyển chế độ Sáng/Tối">🌓</button>

        <!-- Thông báo -->
        <a href="notifications-center.html" class="btn btn-outline btn-sm" style="position: relative;" title="Trung tâm thông báo">
          🔔
          ${unreadNotifs > 0 ? `<span class="badge badge-danger" style="position: absolute; top: -5px; right: -5px; font-size: 0.65rem; padding: 2px 5px;">${unreadNotifs}</span>` : ""}
        </a>

        <!-- Tin nhắn -->
        <a href="messages-chat.html" class="btn btn-outline btn-sm" title="Tin nhắn">💬</a>

        <!-- User profile avatar & Logout dropdown trigger -->
        <div class="d-flex items-center gap-2" style="position: relative;">
          <a href="profile-overview.html" class="user-menu" title="Xem hồ sơ cá nhân">
            <div class="avatar" style="background-color: ${currentUser.avatarColor || "var(--primary-light)"}; color: white;">
              ${currentUser.avatar || "U"}
            </div>
            <div style="line-height: 1.2;" class="d-none d-md-block">
              <div style="font-weight: 700; font-size: 0.88rem;">${currentUser.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${currentUser.roleLabel}</div>
            </div>
          </a>
          <button class="btn btn-outline btn-sm text-danger" onclick="window.Auth.logout()" title="Đăng xuất khỏi tài khoản" style="font-size: 0.8rem; padding: 0.35rem 0.6rem;">
            🚪 Thoát
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
      { label: "Bảng điều khiển", icon: "📊", url: "rider-dashboard.html" },
      { label: "Tìm chuyến đi", icon: "🔍", url: "rider-trip-search.html" },
      { label: "Kết quả AI Match", icon: "✨", url: "rider-match-results.html", ai: true },
      { label: "Chuyến đi của tôi", icon: "🎫", url: "rider-my-trips.html" },
      { label: "Theo dõi chuyến xe", icon: "📍", url: "rider-trip-tracking.html" },
      { label: "Đánh giá chuyến đi", icon: "⭐", url: "rider-trip-review.html" },
      { header: "Tài khoản & Giao tiếp" },
      { label: "Tin nhắn chuyến đi", icon: "💬", url: "messages-chat.html" },
      { label: "Hồ sơ & Điểm uy tín", icon: "👤", url: "profile-overview.html" },
      { label: "Ứng tuyển vai trò", icon: "📝", url: "role-applications.html" },
      { label: "Cẩm nang an toàn", icon: "🛡️", url: "safety-guidelines.html" }
    ],
    driver: [
      { header: "Nghiệp vụ Tài xế" },
      { label: "Bảng điều khiển", icon: "📊", url: "driver-dashboard.html" },
      { label: "Đăng chuyến đi mới", icon: "➕", url: "driver-trip-create.html", ai: true },
      { label: "Lịch trình lặp lại", icon: "🔄", url: "driver-trip-recurring.html" },
      { label: "Lịch chạy của tôi", icon: "📅", url: "driver-schedule.html" },
      { label: "Yêu cầu ghép chuyến", icon: "👥", url: "driver-join-requests.html" },
      { label: "Điều hành chuyến đi", icon: "🚦", url: "driver-trip-execution.html" },
      { label: "Lịch sử bù xăng", icon: "💰", url: "driver-earnings-history.html" },
      { header: "Tài khoản & Xe" },
      { label: "Phương tiện cá nhân", icon: "🛵", url: "profile-vehicles.html" },
      { label: "Tin nhắn khách", icon: "💬", url: "messages-chat.html" },
      { label: "Hồ sơ tài xế", icon: "👤", url: "profile-overview.html" },
      { label: "Ứng tuyển vai trò", icon: "📝", url: "role-applications.html" }
    ],
    coordinator: [
      { header: "Điều phối & Lưu lượng" },
      { label: "Dashboard lưu lượng", icon: "📈", url: "coordinator-mobility-dashboard.html" },
      { label: "Bản đồ nhiệt AI", icon: "🔥", url: "coordinator-demand-heatmap.html", ai: true },
      { label: "Quản lý trạm đón", icon: "🚏", url: "coordinator-pickup-zone-management.html" },
      { label: "Thêm / Sửa trạm đón", icon: "✏️", url: "coordinator-pickup-zone-editor.html" },
      { header: "Sự cố & Hòa giải" },
      { label: "Trung tâm báo cáo", icon: "⚠️", url: "coordinator-report-center.html" },
      { label: "Cấp / tước quyền", icon: "🔐", url: "admin-user-management.html" },
      { label: "Ứng tuyển vai trò", icon: "📝", url: "role-applications.html" },
      { label: "Cẩm nang an toàn", icon: "🛡️", url: "safety-guidelines.html" }
    ],
    admin: [
      { header: "Quản trị hệ thống" },
      { label: "Bảng điều hành Admin", icon: "⚡", url: "admin-dashboard.html" },
      { label: "Cấp / tước quyền", icon: "🔐", url: "admin-user-management.html" },
      { label: "Duyệt đơn ứng tuyển", icon: "📝", url: "admin-role-applications.html" },
      { label: "Kiểm toán chuyến đi", icon: "🔍", url: "admin-trip-audit.html" },
      { label: "Cấu hình nền tảng", icon: "⚙️", url: "admin-platform-settings.html" },
      { label: "Nhật ký hệ thống", icon: "📜", url: "admin-system-logs.html" },
      { header: "Liên kết nhanh" },
      { label: "Quản lý trạm đón", icon: "🚏", url: "coordinator-pickup-zone-management.html" }
    ],
    superadmin: [
      { header: "SUPER ADMIN" },
      { label: "Bảng điều hành", icon: "🟣", url: "admin-dashboard.html" },
      { label: "Cấp / tước mọi quyền", icon: "🔐", url: "admin-user-management.html" },
      { label: "Duyệt đơn ứng tuyển", icon: "📝", url: "admin-role-applications.html" },
      { label: "Kiểm toán chuyến đi", icon: "🔍", url: "admin-trip-audit.html" },
      { label: "Cấu hình nền tảng", icon: "⚙️", url: "admin-platform-settings.html" },
      { label: "Nhật ký hệ thống", icon: "📜", url: "admin-system-logs.html" }
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
          <a href="${item.url}">
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
          🚪 Đăng Xuất Khỏi Tài Khoản
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
          <a href="about.html">Về chúng tôi</a>
          <a href="safety-guidelines.html">An toàn</a>
          <a href="terms-and-privacy.html">Điều khoản</a>
          <button class="btn btn-outline btn-sm" onclick="window.Storage.resetDefaults()">Reset dữ liệu mẫu</button>
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
