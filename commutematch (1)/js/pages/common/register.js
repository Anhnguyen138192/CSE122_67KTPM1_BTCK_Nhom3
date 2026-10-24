function previewFile(input) {
      if (input.files && input.files[0]) {
        document.getElementById("fileLabel").innerText = "Đã chọn: " + input.files[0].name + " (Sẵn sàng tải lên)";
        document.getElementById("fileLabel").style.color = "var(--success)";
      }
    }

    async function handleRegister(e) {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const username = document.getElementById("regUsername").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const password = document.getElementById("regPassword").value;
      const occupation = document.getElementById("regOccupation").value.trim();

      if (!name || username.length < 3 || !email || !phone || !occupation || password.length < 8) {
        window.Toast.show("Vui lòng điền đầy đủ các thông tin bắt buộc!", "error");
        return;
      }

      const duplicate = window.Storage.get("users").some((user) =>
        (user.email && user.email.toLowerCase() === email.toLowerCase()) ||
        (user.username && user.username.toLowerCase() === username.toLowerCase())
      );
      if (duplicate) {
        window.Toast.show("Tên đăng nhập hoặc email đã được sử dụng.", "error");
        return;
      }

      const kycFile = document.getElementById("kycFile").files[0];
      let kycPhoto = null;
      try {
        if (kycFile) kycPhoto = await readRegistrationImage(kycFile);
      } catch (error) {
        window.Toast.show(error.message, "error");
        return;
      }

      const newUser = {
        id: "u_" + Date.now(),
        name: name,
        username: username,
        email: email,
        password: password,
        phone: phone,
        role: "driver",
        roles: ["driver"],
        roleLabel: "Tài xế",
        avatar: name.split(" ").pop().substring(0, 2).toUpperCase(),
        avatarColor: "#059669",
        occupation: occupation,
        kycPhoto,
        trustScore: 90,
        rating: 5.0,
        tripsCount: 0,
        co2Saved: "0.0 kg",
        kycStatus: "pending",
        joinedDate: new Date().toLocaleDateString("vi-VN")
      };

      try {
        window.Storage.insert("users", newUser);
      } catch (error) {
        console.error("Không thể lưu tài khoản đăng ký:", error);
        window.Toast.show("Không đủ dung lượng lưu hồ sơ. Hãy chọn ảnh nhỏ hơn rồi thử lại.", "error");
        return;
      }
      window.Toast.show("Đăng ký thành công! Hãy đăng nhập bằng tài khoản vừa tạo.", "success");
      setTimeout(() => {
        window.location.href = "login.html?registered=1";
      }, 500);
    }

    function readRegistrationImage(file) {
      if (!file.type.startsWith("image/")) {
        return Promise.reject(new Error("Chỉ chấp nhận tệp ảnh xác minh."));
      }
      if (file.size > 5 * 1024 * 1024) {
        return Promise.reject(new Error("Ảnh xác minh phải nhỏ hơn 5 MB."));
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Không thể đọc ảnh xác minh."));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("Tệp ảnh xác minh không hợp lệ."));
          image.onload = () => {
            const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);
            const context = canvas.getContext("2d");
            if (!context) {
              reject(new Error("Trình duyệt không thể xử lý ảnh xác minh."));
              return;
            }
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Không thể nén ảnh xác minh."));
                return;
              }
              const compressedReader = new FileReader();
              compressedReader.onerror = () => reject(new Error("Không thể lưu ảnh xác minh đã xử lý."));
              compressedReader.onload = () => resolve({
                dataUrl: compressedReader.result,
                fileName: file.name
              });
              compressedReader.readAsDataURL(blob);
            }, "image/jpeg", 0.78);
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }
