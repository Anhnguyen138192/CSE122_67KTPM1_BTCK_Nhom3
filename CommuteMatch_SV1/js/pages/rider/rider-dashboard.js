document.addEventListener("DOMContentLoaded", () => {
      loadDashboard();
    });

    function loadDashboard() {
      const u = window.Storage.getCurrentUser();
      if (u) {
        document.getElementById("dashRiderName").innerText = u.name;
        document.getElementById("statRiderTrips").innerText = u.tripsCount || 24;
        document.getElementById("statRiderCo2").innerText = u.co2Saved || "42.5 kg";
        document.getElementById("statRiderMoney").innerText = u.moneySaved || "450.000 đ";
        document.getElementById("statRiderTrust").innerText = (u.trustScore || 98) + " / 100";
      }

      const trips = window.Storage.get("trips");
      const tbody = document.getElementById("recentTripsTableBody");

      tbody.innerHTML = trips.slice(0, 4).map(t => `
        <tr>
          <td>
            <strong>${t.origin}</strong><br>
            <span style="color: var(--text-muted); font-size: 0.8rem;">đến ${t.destination}</span>
          </td>
          <td>${t.departureDate} <br><strong>${t.departureTime}</strong></td>
          <td>${t.driverName}</td>
          <td>${t.vehicleInfo}</td>
          <td><strong style="color: var(--primary);">${(t.costSharing || 10000).toLocaleString('vi-VN')} đ</strong></td>
          <td>
            <span class="badge ${t.status === 'completed' ? 'badge-success' : t.status === 'scheduled' ? 'badge-primary' : 'badge-warning'}">
              ${t.status === 'completed' ? 'Đã hoàn thành' : t.status === 'scheduled' ? 'Sắp đi' : 'Chờ chạy'}
            </span>
          </td>
          <td>
            <a href="rider/rider-trip-detail.html?id=${t.id}" class="btn btn-outline btn-sm">Chi tiết</a>
          </td>
        </tr>
      `).join('');
    }