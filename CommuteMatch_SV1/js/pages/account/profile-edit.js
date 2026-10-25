document.addEventListener("DOMContentLoaded", () => {
      const u = window.Storage.getCurrentUser();
      if (!u) return;

      document.getElementById("editName").value = u.name || "";
      document.getElementById("editEmail").value = u.email || "";
      document.getElementById("editPhone").value = u.phone || "";
      document.getElementById("editUniv").value = u.university || u.department || "";
      document.getElementById("editId").value = u.studentId || "";
      document.getElementById("editBio").value = u.bio || "";
    });

    function saveProfile(e) {
      e.preventDefault();
      const u = window.Storage.getCurrentUser();

      const updated = {
        name: document.getElementById("editName").value.trim(),
        phone: document.getElementById("editPhone").value.trim(),
        university: document.getElementById("editUniv").value.trim(),
        bio: document.getElementById("editBio").value.trim()
      };

      window.Storage.update("users", u.id, updated);
      window.Toast.show("Đã cập nhật thông tin hồ sơ thành công!", "success");

      setTimeout(() => {
        window.location.href = "account/profile-overview.html";
      }, 700);
    }