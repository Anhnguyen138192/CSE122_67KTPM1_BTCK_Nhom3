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
  const currentRoute = window.location.pathname.includes("/pages/") ? window.location.pathname.split("/pages/").pop() : currentPath;
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
      window.location.href = `common/login.html?redirect=${encodeURIComponent(currentRoute)}`;
      return;
    }

    if (user.role === "superadmin" && currentPath !== "superadmin-auth.html" &&
        !window.Auth.isSuperAdminVerified(user)) {
      window.location.href = `common/superadmin-auth.html?redirect=${encodeURIComponent(currentRoute)}`;
      return;
    }

    // Kiểm tra phân quyền role tương ứng
    if (currentPath.startsWith("admin-") && currentPath !== "admin-user-management.html" &&
        !["admin", "superadmin"].includes(user.role)) {
      window.location.href = "system/403.html";
      return;
    }
    if (currentPath === "admin-user-management.html" &&
        !["coordinator", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "system/403.html";
      return;
    }
    if (currentPath.startsWith("coordinator-") && !["coordinator", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "system/403.html";
      return;
    }
    if (currentPath.startsWith("driver-") && !["driver", "admin", "superadmin"].includes(user.role)) {
      window.location.href = "system/403.html";
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
  const currentRoute = window.location.pathname.includes("/pages/") ? window.location.pathname.split("/pages/").pop() : currentPath;
  document.documentElement.setAttribute("data-role", currentUser ? currentUser.role : "");

  // TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP (KHÁCH VÃNG LAI)
  if (!currentUser) {
    headerContainer.innerHTML = `
      <nav class="navbar">
        <div class="d-flex items-center gap-2">
          <a href="index.html" class="navbar-brand">
            <div class="brand-icon"><i class="fa-solid fa-car" aria-hidden="true"></i></div>
            <span>Commute<span style="color: var(--primary);">Match</span></span>
          </a>
        </div>

        <ul class="navbar-nav d-none d-md-flex">
          <li><a href="index.html" class="nav-link ${currentPath === 'index.html' ? 'active' : ''}">Trang chủ</a></li>
          <li><a href="common/about.html" class="nav-link ${currentPath === 'about.html' ? 'active' : ''}">Giới thiệu</a></li>
          <li><a href="common/safety-guidelines.html" class="nav-link ${currentPath === 'safety-guidelines.html' ? 'active' : ''}">Cẩm nang an toàn</a></li>
        </ul>

        <div class="d-flex items-center gap-2">
          <!-- Chuyển theme -->
          <button class="btn btn-outline btn-sm" onclick="toggleTheme()" title="Chuyển chế độ Sáng/Tối"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>
          <!-- Nút Đăng nhập / Đăng ký chuẩn chỉ -->
          <a href="common/login.html" class="btn btn-outline btn-sm">Đăng Nhập</a>
          <a href="common/register.html" class="btn btn-primary btn-sm">Đăng Ký Tham Gia</a>
        </div>
      </nav>
    `;
    return;
  }

  // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP
  const unreadNotifs = window.Storage.get("notifications").filter((n) => n.unread).length;
  headerContainer.innerHTML = `
    <nav class="navbar">
      <div class="d-flex items-center gap-2">
        <button class="menu-toggle-btn" id="menuToggleBtn" title="Mở danh mục menu"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
        <a href="index.html" class="navbar-brand">
          <div class="brand-icon"><i class="fa-solid fa-car" aria-hidden="true"></i></div>
          <span>Commute<span style="color: var(--primary);">Match</span></span>
        </a>
      </div>

      <div class="d-flex items-center gap-2">
        <!-- Chuyển theme -->
        <button class="btn btn-outline btn-sm" onclick="toggleTheme()" title="Chuyển chế độ Sáng/Tối"><i class="fa-solid fa-moon" aria-hidden="true"></i></button>

        <!-- Thông báo -->
        <a href="account/notifications-center.html" class="btn btn-outline btn-sm" style="position: relative;" title="Trung tâm thông báo">
          <i class="fa-solid fa-bell" aria-hidden="true"></i>
          ${unreadNotifs > 0 ? `<span class="badge badge-danger" style="position: absolute; top: -5px; right: -5px; font-size: 0.65rem; padding: 2px 5px;">${unreadNotifs}</span>` : ""}
        </a>

        <!-- Tin nhắn -->
        <a href="account/messages-chat.html" class="btn btn-outline btn-sm" title="Tin nhắn"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i></a>

        <!-- User profile avatar & Logout dropdown trigger -->
        <div class="d-flex items-center gap-2" style="position: relative;">
          <a href="account/profile-overview.html" class="user-menu" title="Xem hồ sơ cá nhân">
            <div class="avatar" style="background-color: ${currentUser.avatarColor || "var(--primary-light)"}; color: white;">
              ${currentUser.avatar || "U"}
            </div>
            <div style="line-height: 1.2;" class="d-none d-md-block">
              <div style="font-weight: 700; font-size: 0.88rem;">${currentUser.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${currentUser.roleLabel}</div>
            </div>
          </a>
          <button class="btn btn-outline btn-sm text-danger" onclick="window.Auth.logout()" title="Đăng xuất khỏi tài khoản" style="font-size: 0.8rem; padding: 0.35rem 0.6rem;">
            <i class="fa-solid fa-door-open" aria-hidden="true"></i> Thoát
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
  const currentRoute = window.location.pathname.includes("/pages/") ? window.location.pathname.split("/pages/").pop() : currentPath;

  const menusByRole = {
    driver: [
      { header: "Nghiệp vụ Tài xế" },
      { label: "Bảng điều khiển", icon: "<i class='fa-solid fa-chart-column' aria-hidden='true'></i>", url: "driver/driver-dashboard.html" },
      { label: "Đăng chuyến đi mới", icon: "<i class='fa-solid fa-plus' aria-hidden='true'></i>", url: "driver/driver-trip-create.html", ai: true },
      { label: "Lịch trình lặp lại", icon: "<i class='fa-solid fa-rotate' aria-hidden='true'></i>", url: "driver/driver-trip-recurring.html" },
      { label: "Lịch chạy của tôi", icon: "<i class='fa-solid fa-calendar-days' aria-hidden='true'></i>", url: "driver/driver-schedule.html" },
      { label: "Yêu cầu ghép chuyến", icon: "<i class='fa-solid fa-users' aria-hidden='true'></i>", url: "driver/driver-join-requests.html" },
      { label: "Điều hành chuyến đi", icon: "<i class='fa-solid fa-traffic-light' aria-hidden='true'></i>", url: "driver/driver-trip-execution.html" },
      { label: "Lịch sử bù xăng", icon: "<i class='fa-solid fa-wallet' aria-hidden='true'></i>", url: "driver/driver-earnings-history.html" },
      { header: "Tài khoản & Xe" },
      { label: "Phương tiện cá nhân", icon: "<i class='fa-solid fa-car-side' aria-hidden='true'></i>", url: "account/profile-vehicles.html" },
      { label: "Tin nhắn khách", icon: "<i class='fa-solid fa-comment-dots' aria-hidden='true'></i>", url: "account/messages-chat.html" },
      { label: "Hồ sơ tài xế", icon: "<i class='fa-solid fa-user' aria-hidden='true'></i>", url: "account/profile-overview.html" }
    ]
  };

  const navItems = menusByRole[user.role] || [];

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
      const isActive = currentPath === item.url.split("/").pop();
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
          <i class="fa-solid fa-door-open" aria-hidden="true"></i> Đăng Xuất Khỏi Tài Khoản
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
          <a href="common/about.html">Về chúng tôi</a>
          <a href="common/safety-guidelines.html">An toàn</a>
          <a href="common/terms-and-privacy.html">Điều khoản</a>
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
