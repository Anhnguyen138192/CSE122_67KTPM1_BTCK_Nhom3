let currentFilter = 'all';

    document.addEventListener("DOMContentLoaded", renderNotifications);

    function renderNotifications() {
      const all = window.Storage.get("notifications");
      const unread = all.filter(n => n.unread);

      document.getElementById("countAll").innerHTML = all.length;
      document.getElementById("countUnread").innerHTML = unread.length;

      const list = currentFilter === 'unread' ? unread : all;
      const container = document.getElementById("notifListContainer");

      if (list.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-bell" aria-hidden="true"></i></div>
            <div class="empty-title">Không có thông báo nào</div>
            <div class="empty-desc">Bạn đã xem hết toàn bộ các cập nhật và thông báo từ chuyến đi!</div>
          </div>
        `;
        return;
      }

      container.innerHTML = list.map(item => `
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-color); background-color: ${item.unread ? 'rgba(5, 150, 105, 0.04)' : 'transparent'}; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; transition: var(--transition);">
          <div style="flex: 1;">
            <div class="d-flex items-center gap-2 mb-1">
              ${item.unread ? '<span class="badge badge-primary" style="font-size: 0.68rem;">MỚI</span>' : ''}
              <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--text-main); margin: 0;">${item.title}</h4>
              <span style="font-size: 0.78rem; color: var(--text-light); margin-left: auto;">${item.time}</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.5rem;">${item.message}</p>
            ${item.link ? `<a href="${item.link}" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 0.2rem 0.5rem;">Xem chi tiết →</a>` : ''}
          </div>
          <div class="d-flex items-center gap-1">
            <button class="btn btn-outline btn-sm" title="Đánh dấu đã đọc" onclick="toggleRead('${item.id}')">
              ${item.unread ? '<i class="fa-solid fa-eye" aria-hidden="true"></i>' : "<i class='fa-solid fa-reply' aria-hidden='true'></i>"}
            </button>
            <button class="btn btn-outline btn-sm text-danger" title="Xóa thông báo" onclick="deleteNotif('${item.id}')">
              &times;
            </button>
          </div>
        </div>
      `).join('');
    }

    function filterTab(filter, btn) {
      currentFilter = filter;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderNotifications();
    }

    function toggleRead(id) {
      const all = window.Storage.get("notifications");
      const target = all.find(n => n.id === id);
      if (target) {
        window.Storage.update("notifications", id, { unread: !target.unread });
        renderNotifications();
      }
    }

    function markAllAsRead() {
      const all = window.Storage.get("notifications");
      all.forEach(n => { n.unread = false; });
      localStorage.setItem("commutematch_notifications", JSON.stringify(all));
      window.Toast.show("Đã đánh dấu tất cả thông báo là đã đọc.", "success");
      renderNotifications();
    }

    function deleteNotif(id) {
      window.Storage.delete("notifications", id);
      window.Toast.show("Đã xóa thông báo.", "info");
      renderNotifications();
    }

    function clearAllNotifs() {
      if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ thông báo?")) return;
      localStorage.setItem("commutematch_notifications", JSON.stringify([]));
      window.Toast.show("Đã dọn sạch hộp thư thông báo.", "info");
      renderNotifications();
    }