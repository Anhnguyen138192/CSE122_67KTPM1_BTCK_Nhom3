(function () {
  const pageGroups = {
    "about.html": "common",
    "login.html": "common",
    "register.html": "common",
    "forgot-password.html": "common",
    "safety-guidelines.html": "common",
    "terms-and-privacy.html": "common",
    "messages-chat.html": "account",
    "notifications-center.html": "account",
    "notifications.html": "account",
    "profile.html": "account",
    "profile-edit.html": "account",
    "profile-overview.html": "account",
    "profile-vehicles.html": "account",
    "role-applications.html": "account",
    "rider-booking-confirm.html": "rider",
    "rider-dashboard.html": "rider",
    "rider-match-results.html": "rider",
    "rider-my-trips.html": "rider",
    "rider-trip-detail.html": "rider",
    "rider-trip-review.html": "rider",
    "rider-trip-search.html": "rider",
    "rider-trip-tracking.html": "rider",
    "driver-dashboard.html": "driver",
    "driver-earnings-history.html": "driver",
    "driver-join-requests.html": "driver",
    "driver-schedule.html": "driver",
    "driver-trip-create.html": "driver",
    "driver-trip-detail.html": "driver",
    "driver-trip-execution.html": "driver",
    "driver-trip-recurring.html": "driver",
    "coordinator-demand-heatmap.html": "coordinator",
    "coordinator-driver-applications.html": "coordinator",
    "coordinator-mobility-dashboard.html": "coordinator",
    "coordinator-pickup-zone-editor.html": "coordinator",
    "coordinator-pickup-zone-management.html": "coordinator",
    "coordinator-report-center.html": "coordinator",
    "coordinator-report-detail.html": "coordinator",
    "coordinator-trip-management.html": "coordinator",
    "coordinator-vehicle-inspection.html": "coordinator",
    "admin-dashboard.html": "admin",
    "admin-platform-settings.html": "admin",
    "admin-role-applications.html": "admin",
    "admin-system-logs.html": "admin",
    "admin-trip-audit.html": "admin",
    "admin-user-detail.html": "admin",
    "admin-user-management.html": "admin",
    "403.html": "system",
    "404.html": "system",
    "superadmin-auth.html": "system"
  };

  function projectRoot() {
    const path = window.location.pathname;
    const marker = path.indexOf("/pages/");
    if (marker >= 0) return path.slice(0, marker + 1);
    return path.slice(0, path.lastIndexOf("/") + 1);
  }

  function page(target) {
    const value = String(target || "index.html");
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(value)) return value;
    const splitAt = value.search(/[?#]/);
    const suffix = splitAt >= 0 ? value.slice(splitAt) : "";
    const path = splitAt >= 0 ? value.slice(0, splitAt) : value;
    if (path === "index.html" || path === "" || path === "./") return projectRoot() + "index.html" + suffix;
    if (path.indexOf("pages/") === 0) return projectRoot() + path + suffix;
    const filename = path.split("/").pop();
    const group = pageGroups[filename];
    return group ? projectRoot() + "pages/" + group + "/" + filename + suffix : value;
  }

  window.CommuteMatchRoutes = { page };
})();
