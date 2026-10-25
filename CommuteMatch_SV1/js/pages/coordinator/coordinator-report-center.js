let reportFilter = 'all';

    document.addEventListener("DOMContentLoaded", renderReportsTable);

    function renderReportsTable() {
      const allReports = window.Storage.get("reports");
      const active = allReports.filter(r => r.status === 'investigating' || r.status === 'pending');
      const resolved = allReports.filter(r => r.status === 'resolved' || r.status === 'dismissed');

      document.getElementById("repTotalCount").innerHTML = allReports.length;
      document.getElementById("repActiveCount").innerHTML = active.length;
      document.getElementById("repResolvedCount").innerHTML = resolved.length;

      let list = allReports;
      if (reportFilter === 'investigating') list = active;
      else if (reportFilter === 'resolved') list = resolved;

      const tbody = document.getElementById("reportsTableBody");

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center p-4">
              <div class="empty-state">
                <div class="empty-icon"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></div>
                <div class="empty-title">Không có báo cáo sự cố nào</div>
                <div class="empty-desc">Cộng đồng đang vận hành an toàn và hòa thuận!</div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = list.map(r => `
        <tr>
          <td>
            <span style="font-size: 0.82rem; color: var(--text-muted);">
              ${new Date(r.createdAt || Date.now()).toLocaleDateString('vi-VN')}<br>
              ${new Date(r.createdAt || Date.now()).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </td>
          <td>
            <strong style="color: var(--text-main); font-size: 0.92rem;">${r.title}</strong><br>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${(r.description || '').substring(0, 50)}...</span>
          </td>
          <td>${r.reporterName}</td>
          <td><strong>${r.reportedUserName}</strong></td>
          <td>
            <span class="badge ${
              r.type === 'delay' ? 'badge-warning' :
              r.type === 'lost_item' ? 'badge-info' : 'badge-danger'
            }">
              ${
                r.type === 'delay' ? 'Trễ hẹn' :
                r.type === 'lost_item' ? 'Quên đồ' :
                r.type === 'noshow' ? 'Bùng chuyến' : 'Thái độ'
              }
            </span>
          </td>
          <td>
            <span class="badge ${
              r.priority === 'high' ? 'badge-danger' :
              r.priority === 'medium' ? 'badge-warning' : 'badge-primary'
            }">
              ${r.priority === 'high' ? 'Cao' : r.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </span>
          </td>
          <td>
            <span class="badge ${
              r.status === 'resolved' ? 'badge-success' : 'badge-warning'
            }">
              ${r.status === 'resolved' ? 'Đã giải quyết' : 'Đang xử lý'}
            </span>
          </td>
          <td>
            <a href="coordinator/coordinator-report-detail.html?id=${r.id}" class="btn btn-outline btn-sm">
              Xử lý hòa giải →
            </a>
          </td>
        </tr>
      `).join('');
    }

    function switchReportTab(filter, btn) {
      reportFilter = filter;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderReportsTable();
    }