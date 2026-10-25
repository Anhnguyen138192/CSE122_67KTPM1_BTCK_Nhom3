function sendOtp() {
      const email = document.getElementById("resetEmail").value.trim();
      if (!email) {
        window.Toast.show("Vui lòng nhập email!", "error");
        return;
      }
      window.Toast.show("Mã OTP đã được gửi đến " + email, "info");
      document.getElementById("step1").style.display = "none";
      document.getElementById("step2").style.display = "block";
      document.getElementById("otpCode").value = "888999";
    }

    function verifyAndReset() {
      const otp = document.getElementById("otpCode").value.trim();
      const pass = document.getElementById("newPass").value.trim();

      if (otp !== "888999") {
        window.Toast.show("Mã OTP không đúng! Vui lòng nhập 888999", "error");
        return;
      }
      if (!pass || pass.length < 6) {
        window.Toast.show("Mật khẩu mới phải từ 6 ký tự trở lên!", "error");
        return;
      }

      window.Toast.show("Đổi mật khẩu thành công! Chuyển về trang đăng nhập...", "success");
      setTimeout(() => {
        window.location.href = "common/login.html";
      }, 1000);
    }