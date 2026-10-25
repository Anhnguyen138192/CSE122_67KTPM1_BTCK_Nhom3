let currentStars = 5;

    document.addEventListener("DOMContentLoaded", () => {
      setStars(5);
    });

    function setStars(val) {
      currentStars = val;
      const spans = document.querySelectorAll("#starContainer span");
      const labels = [
        "", "Cần cải thiện (1 sao)", "Bình thường (2 sao)",
        "Tốt (3 sao)", "Rất tốt (4 sao)", "Tuyệt vời (5 sao)"
      ];

      spans.forEach((s, idx) => {
        s.style.color = idx < val ? "var(--warning)" : "#cbd5e1";
      });

      document.getElementById("starLabel").innerText = labels[val];
    }

    function toggleTag(btn) {
      btn.classList.toggle("active-tag");
    }

    function submitReview(e) {
      e.preventDefault();
      const user = window.Storage.getCurrentUser();
      const comment = document.getElementById("reviewComment").value.trim() || "Chuyến đi an toàn, tài xế đúng giờ và thân thiện.";

      const selectedTags = Array.from(document.querySelectorAll("#tagList .active-tag")).map(b => b.innerText);

      const newRating = {
        id: "rate_" + Date.now(),
        tripId: "trip_101",
        fromUserId: user.id,
        fromUserName: user.name,
        toUserId: "u_driver1",
        toUserName: "Trần Minh Quân",
        stars: currentStars,
        tags: selectedTags,
        comment: comment,
        date: new Date().toLocaleDateString("vi-VN")
      };

      window.Storage.insert("ratings", newRating);

      // Thưởng điểm uy tín Trust Score
      window.Storage.update("users", user.id, {
        trustScore: Math.min(100, (user.trustScore || 95) + 1),
        tripsCount: (user.tripsCount || 24) + 1
      });

      window.Toast.show("Cảm ơn bạn đã gửi đánh giá! Bạn được cộng +1 Điểm Uy Tín.", "success");

      setTimeout(() => {
        window.location.href = "rider/rider-dashboard.html";
      }, 800);
    }