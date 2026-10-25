let trackStep = 2; // 2: approaching, 3: riding, 4: completed

    function performCheckin() {
      if (trackStep === 2) {
        trackStep = 3;
        document.getElementById("stepProgressBar").style.width = "75%";
        document.getElementById("step3Circle").style.backgroundColor = "var(--primary)";
        document.getElementById("step3Circle").style.color = "white";
        document.getElementById("step3Circle").innerHTML = "<i class='fa-solid fa-check' aria-hidden='true'></i>";
        document.getElementById("trackStatusBadge").innerHTML = "ĐANG DI CHUYỂN";
        document.getElementById("trackIcon").innerHTML = "<i class='fa-solid fa-car-side' aria-hidden='true'></i><i class='fa-solid fa-wind' aria-hidden='true'></i>";
        document.getElementById("trackMainText").innerHTML = "Bạn đang trên đường cùng tài xế Quân";
        document.getElementById("trackSubText").innerHTML = "Dự kiến đến ĐH Bách Khoa CS2 lúc 07:28 (khoảng 13 phút di chuyển).";
        document.getElementById("btnCheckin").innerHTML = "<i class='fa-solid fa-flag-checkered' aria-hidden='true'></i> Xác Nhận Đã Đến Nơi An Toàn";
        document.getElementById("btnCheckin").classList.replace("btn-primary", "btn-secondary");
        window.Toast.show("Đã check-in điểm đón! Chúc bạn có chuyến đi an toàn.", "success");
      } else if (trackStep === 3) {
        trackStep = 4;
        document.getElementById("stepProgressBar").style.width = "100%";
        document.getElementById("step4Circle").style.backgroundColor = "var(--success)";
        document.getElementById("step4Circle").style.color = "white";
        document.getElementById("step4Circle").innerHTML = "<i class='fa-solid fa-check' aria-hidden='true'></i>";
        document.getElementById("trackStatusBadge").innerHTML = "HOÀN THÀNH";
        document.getElementById("trackIcon").innerHTML = "<i class='fa-solid fa-gift' aria-hidden='true'></i>";
        document.getElementById("trackMainText").innerHTML = "Chuyến đi đã hoàn thành xuất sắc!";
        document.getElementById("trackSubText").innerHTML = "Bạn đã góp phần giảm 1.8 kg CO2 cho môi trường học đường.";
        document.getElementById("btnCheckin").innerHTML = "<i class='fa-solid fa-star' aria-hidden='true'></i> Viết Đánh Giá Cho Tài Xế";
        document.getElementById("btnCheckin").onclick = () => {
          window.location.href = "rider/rider-trip-review.html?tripId=trip_101&driverId=u_driver1";
        };
        window.Toast.show("Chuyến đi hoàn tất! Hãy để lại đánh giá cho bạn đồng hành.", "success");
      }
    }

    function triggerSos() {
      if (confirm("KÍCH HOẠT SOS KHẨN CẤP?\n\nHệ thống sẽ phát tín hiệu vị trí GPS hiện tại đến Ban Quản lý Di chuyển và lực lượng bảo vệ KTX.")) {
        window.Toast.show("ĐÃ PHÁT TÍN HIỆU CỨU HỘ SOS ĐẾN BẢO VỆ ĐHQG!", "error");
      }
    }