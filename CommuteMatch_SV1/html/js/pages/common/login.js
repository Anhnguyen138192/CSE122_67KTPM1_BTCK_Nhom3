document.addEventListener("DOMContentLoaded", () => {
      // Nếu đã có tham số redirect từ trang trước
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");
      if (redirect) {
        window.Toast.show("Vui lòng đăng nhập để truy cập trang này!", "warning");
      }
    });

    function handleLoginSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();

      const emailInput = document.getElementById("loginEmail");
      const passInput = document.getElementById("loginPass");
      const errBox = document.getElementById("loginErrorAlert");
      const errMsg = document.getElementById("loginErrorMsg");

      const email = emailInput.value.trim();
      const pass = passInput.value;

      let hasError = false;

      if (!email) {
        emailInput.classList.add("is-invalid");
        hasError = true;
      } else {
        emailInput.classList.remove("is-invalid");
      }

      if (!pass) {
        passInput.classList.add("is-invalid");
        hasError = true;
      } else {
        passInput.classList.remove("is-invalid");
      }

      if (hasError) return;

      // Gọi hàm Auth.login thực tế
      const res = window.Auth.login(email, pass);

      if (!res.success) {
        errBox.style.display = "block";
        errMsg.innerHTML = "<i class='fa-solid fa-triangle-exclamation' aria-hidden='true'></i> " + res.message;
        window.Toast.show(res.message, "error");
        return;
      }

      // Đăng nhập thành công!
      errBox.style.display = "none";
      window.Toast.show(`Đăng nhập thành công! Chào mừng ${res.user.name} (${res.user.roleLabel})`, "success");

      // Chuyển hướng tới trang đã định hoặc dashboard theo vai trò
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");

      setTimeout(() => {
        if (res.user.role === "superadmin") {
          const nextPage = redirect && redirect !== "common/login.html" ? redirect : "admin/admin-dashboard.html";
          window.location.href = `common/superadmin-auth.html?redirect=${encodeURIComponent(nextPage)}`;
        } else if (redirect && redirect !== "common/login.html") {
          window.location.href = redirect;
        } else {
          window.location.href = window.Auth.ROLE_DASHBOARDS[res.user.role] || "rider/rider-dashboard.html";
        }
      }, 500);
    }