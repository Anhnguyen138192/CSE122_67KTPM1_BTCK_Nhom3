document.addEventListener("DOMContentLoaded", renderVehicles);

    function renderVehicles() {
      const u = window.Storage.getCurrentUser();
      const container = document.getElementById("vehiclesList");

      // Giả lập danh sách xe của user
      const vehicles = u.vehiclesList || (u.vehicle ? [u.vehicle] : []);

      if (vehicles.length === 0) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: span 2;">
            <div class="empty-icon"><i class="fa-solid fa-car-side" aria-hidden="true"></i></div>
            <div class="empty-title">Chưa có phương tiện nào</div>
            <div class="empty-desc">Thêm ô tô điện hoặc ô tô xăng để bắt đầu chia sẻ chuyến đi.</div>
            <button class="btn btn-primary" onclick="openAddVehicleModal()"><i class="fa-solid fa-plus" aria-hidden="true"></i> Thêm phương tiện đầu tiên</button>
          </div>
        `;
        return;
      }

      container.innerHTML = vehicles.map((v, i) => `
        <div class="card" style="border-left: 4px solid var(--primary);">
          <div class="card-body">
            <div class="d-flex justify-between items-start mb-2">
              <div>
                <span class="badge badge-success mb-1">Đang sử dụng chính</span>
                <h4 style="font-size: 1.1rem;">${v.type || v.model || 'Ô tô'}</h4>
                <div style="font-size: 0.85rem; color: var(--text-muted);">${v.color || 'Màu tiêu chuẩn'}</div>
              </div>
              <span style="font-size: 1.8rem;">${(v.type || '').toLowerCase().includes('điện') ? '<i class="fa-solid fa-bolt" aria-hidden="true"></i>' : '<i class="fa-solid fa-gas-pump" aria-hidden="true"></i>'}</span>
            </div>

            <div style="background-color: var(--bg-muted); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.88rem; margin-bottom: 1rem;">
              <div class="d-flex justify-between mb-1">
                <span class="text-muted">Biển số:</span>
                <strong class="font-bold">${v.plate}</strong>
              </div>
              <div class="d-flex justify-between">
                <span class="text-muted">Số chỗ trống:</span>
                <span>${v.seatsTotal || v.seats || 1} người</span>
              </div>
            </div>

            <div class="d-flex justify-end gap-1">
              <button class="btn btn-outline btn-sm" onclick="window.Toast.show('Phương tiện đã được kiểm tra đạt chuẩn an toàn!', 'success')">Kiểm định</button>
              <button class="btn btn-danger btn-sm" onclick="deleteVehicle(${i})">Xóa xe</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function openAddVehicleModal() {
      document.getElementById("vehicleForm").reset();
      window.Modal.open("vehicleModal");
    }

    function handleSaveVehicle(e) {
      e.preventDefault();
      const u = window.Storage.getCurrentUser();
      const type = document.getElementById("vType").value;
      const model = document.getElementById("vModel").value.trim();
      const plate = document.getElementById("vPlate").value.trim();
      const seats = parseInt(document.getElementById("vSeats").value) || 1;
      const color = document.getElementById("vColor").value.trim();

      const newV = {
        type: `${type} (${model})`,
        plate: plate,
        seatsTotal: seats,
        color: color || "Tiêu chuẩn"
      };

      const currentList = u.vehiclesList || (u.vehicle ? [u.vehicle] : []);
      currentList.push(newV);

      window.Storage.update("users", u.id, {
        vehicle: newV,
        vehiclesList: currentList,
        role: "driver",
        roleLabel: "Người chia sẻ xe"
      });

      window.Modal.close("vehicleModal");
      window.Toast.show("Đã thêm phương tiện mới thành công!", "success");
      renderVehicles();
    }

    function deleteVehicle(index) {
      if (!confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) return;
      const u = window.Storage.getCurrentUser();
      const currentList = u.vehiclesList || (u.vehicle ? [u.vehicle] : []);
      currentList.splice(index, 1);

      window.Storage.update("users", u.id, {
        vehiclesList: currentList,
        vehicle: currentList[0] || null
      });

      window.Toast.show("Đã xóa phương tiện.", "info");
      renderVehicles();
    }
