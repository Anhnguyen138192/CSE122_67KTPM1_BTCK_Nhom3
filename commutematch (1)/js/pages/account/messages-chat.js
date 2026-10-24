let currentRecipientId = null;

    document.addEventListener("DOMContentLoaded", () => {
      const requestedRecipientId = new URLSearchParams(window.location.search).get("userId");
      renderConversationList();
      if (requestedRecipientId) {
        selectConversation(requestedRecipientId, false);
      } else {
        const firstConversation = getConversationUsers()[0];
        if (firstConversation) selectConversation(firstConversation.id, false);
      }
    });

    window.addEventListener("storage", (event) => {
      if (!event.key || event.key === "commutematch_messages" || event.key === "commutematch_users") {
        renderConversationList();
        renderMessages();
      }
    });

    function getConversationUsers() {
      const currentUser = window.Auth.getCurrentUser();
      return window.Storage.get("users")
        .filter((user) => user.id !== currentUser.id && !user.isSuspended)
        .sort((a, b) => a.name.localeCompare(b.name, "vi"));
    }

    function renderConversationList() {
      const users = getConversationUsers();
      const messages = window.Storage.get("messages");
      const currentUser = window.Auth.getCurrentUser();
      const host = document.getElementById("conversationList");

      host.innerHTML = users.length ? users.map((user) => {
        const conversationMessages = messages.filter((message) =>
          (message.senderId === currentUser.id && message.receiverId === user.id) ||
          (message.senderId === user.id && message.receiverId === currentUser.id)
        );
        const lastMessage = conversationMessages.find((message) => message.createdAt) ||
          conversationMessages[conversationMessages.length - 1];
        const roles = Array.isArray(user.roles) ? user.roles : [user.role || "rider"];
        const roleText = roles.map((role) => window.Auth.ROLE_LABELS[role] || role).join(" · ");
        return `
          <button type="button" onclick="selectConversation('${escapeHtml(user.id)}')" style="width:100%;text-align:left;border:0;border-bottom:1px solid var(--border-color);background:${currentRecipientId === user.id ? 'var(--primary-light)' : 'transparent'};padding:1rem;cursor:pointer;color:var(--text-main);">
            <span class="d-flex items-center gap-2">
              <span class="avatar" style="width:36px;height:36px;flex:none;background-color:${escapeHtml(user.avatarColor || "var(--primary)")};color:white;">${escapeHtml(user.avatar || "U")}</span>
              <span style="min-width:0;flex:1;line-height:1.3;">
                <span class="font-bold" style="display:block;font-size:.9rem;">${escapeHtml(user.name)}</span>
                <span style="display:block;font-size:.75rem;color:var(--text-muted);">${escapeHtml(roleText)}</span>
              </span>
            </span>
            <span style="display:block;margin-top:.5rem;font-size:.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${lastMessage ? escapeHtml(lastMessage.text) : "Bắt đầu trò chuyện"}</span>
          </button>
        `;
      }).join("") : '<p class="p-3" style="color:var(--text-muted);">Chưa có thành viên để nhắn tin.</p>';
    }

    function selectConversation(userId, updateUrl = true) {
      const currentUser = window.Auth.getCurrentUser();
      const recipient = window.Storage.getById("users", userId);
      if (!recipient || recipient.id === currentUser.id || recipient.isSuspended) {
        window.Toast.show("Không tìm thấy tài khoản để nhắn tin.", "error");
        return;
      }

      currentRecipientId = recipient.id;
      if (updateUrl) {
        history.replaceState(null, "", `account/messages-chat.html?userId=${encodeURIComponent(recipient.id)}`);
      }
      const roles = Array.isArray(recipient.roles) ? recipient.roles : [recipient.role || "rider"];
      document.getElementById("chatAvatar").textContent = recipient.avatar || "U";
      document.getElementById("chatAvatar").style.backgroundColor = recipient.avatarColor || "var(--primary)";
      const profileLink = document.getElementById("chatProfileLink");
      profileLink.textContent = recipient.name;
      profileLink.href = `account/profile-overview.html?userId=${encodeURIComponent(recipient.id)}`;
      document.getElementById("chatRoleLabel").textContent = roles
        .map((role) => window.Auth.ROLE_LABELS[role] || role)
        .join(" · ");
      document.getElementById("chatTargetProfile").href = profileLink.href;
      document.getElementById("chatTargetProfile").style.display = "";
      document.getElementById("msgInput").disabled = false;
      document.getElementById("msgInput").placeholder = `Nhắn tin cho ${recipient.name}...`;
      document.getElementById("sendMessageButton").disabled = false;
      renderConversationList();
      renderMessages();
    }

    function renderMessages() {
      const currentUser = window.Auth.getCurrentUser();
      const recipient = currentRecipientId && window.Storage.getById("users", currentRecipientId);
      const container = document.getElementById("messagesStream");
      if (!recipient) {
        container.innerHTML = '<div style="margin:auto;color:var(--text-muted);">Chọn một thành viên để bắt đầu trò chuyện.</div>';
        return;
      }

      const conversationMessages = window.Storage.get("messages").filter((message) =>
        (message.senderId === currentUser.id && message.receiverId === recipient.id) ||
        (message.senderId === recipient.id && message.receiverId === currentUser.id)
      );
      const legacyMessages = conversationMessages.filter((message) => !message.createdAt);
      const newMessages = conversationMessages
        .filter((message) => message.createdAt)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const messages = [...legacyMessages, ...newMessages];
      container.innerHTML = messages.length ? messages.map((message) => {
        const isMe = message.senderId === currentUser.id;
        return `
          <div style="display:flex;justify-content:${isMe ? "flex-end" : "flex-start"};">
            <div style="max-width:70%;background-color:${isMe ? "var(--primary)" : "var(--bg-surface)"};color:${isMe ? "#ffffff" : "var(--text-main)"};padding:.75rem 1rem;border-radius:12px;box-shadow:var(--shadow-sm);border:1px solid ${isMe ? "transparent" : "var(--border-color)"};">
              <div style="font-size:.72rem;opacity:.8;margin-bottom:.2rem;font-weight:600;">${isMe ? "Tôi" : escapeHtml(message.senderName || recipient.name)} · ${escapeHtml(message.timestamp || "")}</div>
              <div style="font-size:.9rem;line-height:1.4;white-space:pre-wrap;">${escapeHtml(message.text)}</div>
            </div>
          </div>
        `;
      }).join("") : '<div style="margin:auto;color:var(--text-muted);">Chưa có tin nhắn. Hãy gửi lời chào đầu tiên!</div>';
      container.scrollTop = container.scrollHeight;
    }

    function handleSendMessage(event) {
      event.preventDefault();
      const input = document.getElementById("msgInput");
      const text = input.value.trim();
      const currentUser = window.Auth.getCurrentUser();
      const recipient = currentRecipientId && window.Storage.getById("users", currentRecipientId);
      if (!text || !recipient) return;

      try {
        window.Storage.insert("messages", {
          id: `msg_${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          receiverId: recipient.id,
          text,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        });
        input.value = "";
        renderConversationList();
        renderMessages();
      } catch (error) {
        console.error("Không thể lưu tin nhắn:", error);
        window.Toast.show(
          error.name === "QuotaExceededError"
            ? "Không đủ dung lượng lưu tin nhắn trên trình duyệt này."
            : "Không thể gửi tin nhắn. Vui lòng thử lại.",
          "error"
        );
      }
    }

    function sendQuick(text) {
      document.getElementById("msgInput").value = text;
      document.getElementById("chatForm").requestSubmit();
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[character]);
    }