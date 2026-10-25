document.addEventListener("DOMContentLoaded", () => {
      // Đặt ngày mặc định là hôm nay hoặc ngày mai
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.getElementById("searchDate").value = tomorrow.toISOString().split("T")[0];
    });

    function setQuickSearch(origin, dest, time) {
      document.getElementById("searchOrigin").value = origin;
      document.getElementById("searchDestination").value = dest;
      document.getElementById("searchTime").value = time;
      window.Toast.show(`Đã nạp nhanh lộ trình: ${origin} → ${dest}`, "info");
    }

    function handleSearch(e) {
      e.preventDefault();
      const origin = document.getElementById("searchOrigin").value.trim();
      const destination = document.getElementById("searchDestination").value.trim();
      const date = document.getElementById("searchDate").value;
      const time = document.getElementById("searchTime").value;
      const seats = parseInt(document.getElementById("searchSeats").value) || 1;
      const vehicleType = document.getElementById("filterVehicleType").value;

      if (!origin || !destination) {
        window.Toast.show("Vui lòng nhập cả điểm đón và điểm đến!", "error");
        return;
      }

      // Lưu tiêu chí tìm kiếm vào sessionStorage để trang Match Results xử lý
      sessionStorage.setItem("commute_search_criteria", JSON.stringify({
        origin, destination, date, time, seats, vehicleType
      }));

      window.location.href = "rider/rider-match-results.html";
    }
