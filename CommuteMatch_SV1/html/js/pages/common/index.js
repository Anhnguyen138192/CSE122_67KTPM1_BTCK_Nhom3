document.addEventListener("DOMContentLoaded", () => {
      const user = window.Auth.getCurrentUser();
      if (user) {
        const loginBtn = document.getElementById("heroLoginBtn");
        if (loginBtn) {
          const userIcon = document.createElement("i");
          userIcon.className = "fa-solid fa-user";
          userIcon.setAttribute("aria-hidden", "true");
          loginBtn.replaceChildren(userIcon, document.createTextNode(" Trang Cá Nhân (" + user.name.split(" ").pop() + ")"));
          loginBtn.href = window.Auth.ROLE_DASHBOARDS[user.role] || "account/profile-overview.html";
        }
      }
    });