document.addEventListener("DOMContentLoaded", () => {
      loadProfileData();
    });

    function loadProfileData() {
      const currentUser = window.Auth.getCurrentUser();
      if (!currentUser) return;
      const requestedUserId = new URLSearchParams(window.location.search).get("userId");
      const viewingOwnProfile = !requestedUserId || requestedUserId === currentUser.id;
      const u = viewingOwnProfile
        ? currentUser
        : window.Storage.getById("users", requestedUserId);
      if (!u) {
        window.location.href = "404.html";
        return;
      }

      document.title = `${viewingOwnProfile ? "Hồ sơ cá nhân" : "Hồ sơ thành viên"} – CommuteMatch`;
      document.getElementById("profileBreadcrumb").innerHTML = viewingOwnProfile ? "Hồ sơ cá nhân" : "Hồ sơ thành viên";
      document.getElementById("btnEditProfile").style.display = viewingOwnProfile ? "" : "none";
      document.getElementById("btnManageVehicle").style.display = viewingOwnProfile ? "" : "none";
      document.getElementById("studentKycCard").style.display = viewingOwnProfile ? "" : "none";
      document.getElementById("moneyStatCard").style.display = viewingOwnProfile ? "" : "none";
      document.getElementById("communityBadges").style.display = viewingOwnProfile ? "" : "none";
      document.getElementById("btnMessageProfile").style.display = viewingOwnProfile ? "none" : "";
      document.getElementById("btnMessageProfile").href = `account/messages-chat.html?userId=${encodeURIComponent(u.id)}`;
      const targetRoles = Array.isArray(u.roles) ? u.roles : [u.role || "rider"];
      const canViewDetails = viewingOwnProfile ||
        ["admin", "superadmin"].includes(currentUser.role) ||
        (currentUser.role === "coordinator" &&
          !targetRoles.some((role) => ["admin", "superadmin"].includes(role)) &&
          (targetRoles.includes("driver") ||
            (targetRoles.includes("rider") && !targetRoles.includes("coordinator"))));
      if (canViewDetails) renderSubmittedDetails(u);
      document.getElementById("contactCardTitle").innerHTML = canViewDetails
        ? "Thông Tin Liên Hệ"
        : "Thông Tin Cơ Bản";
      document.getElementById("emailContact").style.display = canViewDetails ? "" : "none";
      document.getElementById("phoneContact").style.display = canViewDetails ? "" : "none";

      document.getElementById("userName").innerHTML = u.name;
      document.getElementById("userAvatar").innerHTML = u.avatar || "U";
      document.getElementById("userAvatar").style.backgroundColor = u.avatarColor || "var(--primary)";
      const roleLabels = window.Auth.ROLE_LABELS;
      const roles = Array.isArray(u.roles) ? u.roles : [u.role || "rider"];
      document.getElementById("userRoleBadge").innerHTML = roles.map((role) => roleLabels[role] || role).join(" · ");
      document.getElementById("userBio").innerHTML = u.bio || "Thành viên cộng đồng CommuteMatch.";
      document.getElementById("trustScoreVal").innerHTML = (u.trustScore || 95) + " / 100";
      document.getElementById("trustBar").style.width = (u.trustScore || 95) + "%";
      document.getElementById("ratingVal").innerHTML = (u.rating || 4.9) + " / 5.0";

      document.getElementById("univVal").innerHTML = u.university || u.department || "ĐHQG-HCM";
      document.getElementById("idVal").innerHTML = viewingOwnProfile ? u.studentId || "N/A" : "Ẩn";
      document.getElementById("emailVal").innerHTML = viewingOwnProfile ? u.email || "Chưa cập nhật" : "Ẩn";
      document.getElementById("phoneVal").innerHTML = viewingOwnProfile ? u.phone || "Chưa cập nhật" : "Ẩn";
      document.getElementById("joinedVal").innerHTML = u.joinedDate || "10/2023";
      document.getElementById("tripsCountVal").innerHTML = u.tripsCount || 0;
      document.getElementById("co2Val").innerHTML = u.co2Saved || "12.0 kg";

      if (u.vehicle) {
        document.getElementById("moneyLabel").innerHTML = "Bù đắp chi phí xăng";
        document.getElementById("moneyVal").innerHTML = u.earnings || "1.250.000 đ";
        document.getElementById("vehicleSummary").innerHTML = u.vehicle.type;
      } else {
        document.getElementById("moneyLabel").innerHTML = "Tiền tiết kiệm được";
        document.getElementById("moneyVal").innerHTML = u.moneySaved || "350.000 đ";
        document.getElementById("vehicleSummary").innerHTML = "Không có (Đi xe nhờ)";
      }

      // Render ratings
      const allRatings = window.Storage.get("ratings");
      const myRatings = allRatings.filter(r => r.toUserId === u.id || r.fromUserId === u.id);
      const container = document.getElementById("ratingsContainer");

      if (myRatings.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="padding: 1.5rem;">
            <div class="empty-desc">Chưa có đánh giá nào cho chuyến đi gần nhất.</div>
          </div>
        `;
      } else {
        container.innerHTML = myRatings.map(r => `
          <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
            <div class="d-flex justify-between items-center mb-1">
              <span class="font-bold">${escapeHtml(r.fromUserName)}</span>
              <span style="color: var(--warning); font-size: 0.9rem;">${'<i class='fa-solid fa-star' aria-hidden='true'></i>'.repeat(r.stars)} (${r.stars}/5)</span>
            </div>
            <div class="d-flex gap-1 mb-1">
              ${(r.tags || []).map(t => `<span class="badge badge-primary" style="font-size: 0.72rem;">${escapeHtml(t)}</span>`).join('')}
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted);">${escapeHtml(r.comment)}</p>
            <div style="font-size: 0.75rem; color: var(--text-light);">${escapeHtml(r.date)}</div>
          </div>
        `).join('');
      }
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[character]);
    }

    function renderSubmittedDetails(user) {
      const currentUser = window.Auth.getCurrentUser();
      const viewingOwnProfile = currentUser.id === user.id;
      const canReviewAllApplications = viewingOwnProfile ||
        ["admin", "superadmin"].includes(currentUser.role);
      const applications = window.Storage.get("roleApplications").filter((application) =>
        application.userId === user.id &&
        (canReviewAllApplications || application.role === "driver")
      );
      const requests = window.Storage.get("joinRequests")
        .filter((request) => request.riderId === user.id);
      const detailsHost = document.getElementById("applicationDetails");
      const roleNames = { driver: "Tài xế", coordinator: "Điều phối viên" };
      const statusNames = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };
      const applicationCards = applications.map((application) => {
        const details = application.details || {};
        const fields = application.role === "driver"
          ? [["Loại xe", details.vehicleType], ["Biển số", details.vehiclePlate], ["Thông tin GPLX", details.driverLicense]]
          : [["Đơn vị / tổ chức", details.affiliation], ["Kinh nghiệm / lý do ứng tuyển", details.motivation]];
        const photos = application.role === "driver"
          ? [["Ảnh phương tiện", details.vehiclePhoto], ["Ảnh GPLX", details.driverLicensePhoto], ["Ảnh CCCD", details.citizenIdPhoto]]
          : [["Ảnh CCCD", details.citizenIdPhoto]];
        return `
          <article class="card mb-2">
            <div class="card-body">
              <div class="d-flex justify-between items-center flex-wrap gap-2">
                <strong>Đơn ứng tuyển ${roleNames[application.role] || escapeHtml(application.role)}</strong>
                <span class="badge ${application.status === "approved" ? "badge-success" : application.status === "rejected" ? "badge-danger" : "badge-warning"}">${statusNames[application.status] || escapeHtml(application.status)}</span>
              </div>
              <dl class="mt-2">
                ${fields.map(([label, value]) => `<div class="mb-1"><dt style="font-weight:700;">${label}</dt><dd>${escapeHtml(value || "—")}</dd></div>`).join("")}
              </dl>
              <div class="d-grid grid-cols-2 gap-2 mt-2">${photos.map(([label, photo]) => renderSubmittedPhoto(label, photo)).join("")}</div>
            </div>
          </article>
        `;
      });
      const riderDetails = `
        <article class="card mb-2">
          <div class="card-body">
            <strong>Thông tin hành khách</strong>
            <dl class="mt-2">
              <div class="mb-1"><dt style="font-weight:700;">Email</dt><dd>${escapeHtml(user.email || "—")}</dd></div>
              <div class="mb-1"><dt style="font-weight:700;">Số điện thoại</dt><dd>${escapeHtml(user.phone || "—")}</dd></div>
              <div class="mb-1"><dt style="font-weight:700;">Nghề nghiệp</dt><dd>${escapeHtml(user.occupation || "—")}</dd></div>
              <div class="mb-1"><dt style="font-weight:700;">Trường / đơn vị</dt><dd>${escapeHtml(user.university || user.department || "—")}</dd></div>
              <div class="mb-1"><dt style="font-weight:700;">MSSV / Mã nhân viên</dt><dd>${escapeHtml(user.studentId || "—")}</dd></div>
            </dl>
            ${user.kycPhoto ? renderSubmittedPhoto("Ảnh giấy tờ xác minh", user.kycPhoto) : ""}
          </div>
        </article>
      `;
      const requestCards = requests.map((request) => `
        <article class="card mb-2">
          <div class="card-body">
            <strong>Thông tin yêu cầu chuyến đi</strong>
            <dl class="mt-2">
              <div class="mb-1"><dt style="font-weight:700;">Điểm đón</dt><dd>${escapeHtml(request.pickupPoint || "—")}</dd></div>
              <div class="mb-1"><dt style="font-weight:700;">Điểm xuống</dt><dd>${escapeHtml(request.dropoffPoint || "—")}</dd></div>
              <div class="mb-1"><dt style="font-weight:700;">Lời nhắn</dt><dd>${escapeHtml(request.note || "—")}</dd></div>
            </dl>
          </div>
        </article>
      `);
      const hasRiderRole = (Array.isArray(user.roles) ? user.roles : [user.role || "rider"]).includes("rider");
      detailsHost.innerHTML = [
        hasRiderRole ? riderDetails : "",
        ...applicationCards,
        ...requestCards
      ].join("") || '<p style="color:var(--text-muted);">Chưa có thông tin chi tiết đã nộp.</p>';
      document.getElementById("applicationDetailsCard").style.display = "";
    }

    function renderSubmittedPhoto(label, photo) {
      if (!photo || !/^data:image\/jpeg;base64,/.test(photo.dataUrl || "")) return "";
      return `<div><strong>${label}</strong><br><img src="${photo.dataUrl}" alt="${label}" loading="lazy" style="display:block;max-width:100%;max-height:260px;object-fit:contain;margin-top:.4rem;border:1px solid var(--border-color);border-radius:var(--radius-md);"><small>${escapeHtml(photo.fileName || "Ảnh đã tải lên")}</small></div>`;
    }
