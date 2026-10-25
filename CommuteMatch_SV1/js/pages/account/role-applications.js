const applicationRoleNames = { driver: "Tài xế", coordinator: "Điều phối viên" };

    document.addEventListener("DOMContentLoaded", () => {
      const user = window.Auth.getCurrentUser();
      if (!user) return;
      document.querySelectorAll(".application-file-label").forEach((label) => {
        label.dataset.defaultText = label.textContent;
      });
      renderApplications();
    });

    function previewApplicationFile(input) {
      const label = document.getElementById(input.id + "Label");
      if (!input.files || !input.files[0] || !label) return;
      label.textContent = "Đã chọn: " + input.files[0].name + " (Sẵn sàng tải lên)";
      label.style.color = "var(--success)";
    }

    async function submitApplication(event, role) {
      event.preventDefault();
      const form = event.currentTarget;
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      try {
        const requiredImageIds = role === "driver"
          ? ["vehiclePhoto", "driverLicensePhoto", "driverCitizenIdPhoto"]
          : ["coordCitizenIdPhoto"];
        if (requiredImageIds.some((id) => !document.getElementById(id).files[0])) {
          throw new Error("Vui lòng chọn đầy đủ ảnh hồ sơ.");
        }

        const details = role === "driver"
          ? {
            vehicleType: `${document.getElementById("vehicleCategory").value === "electric" ? "Ô tô điện" : "Ô tô xăng"} (${document.getElementById("vehicleType").value.trim()})`,
            vehiclePlate: document.getElementById("vehiclePlate").value.trim(),
            driverLicense: document.getElementById("driverLicense").value.trim(),
            vehiclePhoto: await readApplicationImage(document.getElementById("vehiclePhoto").files[0]),
            driverLicensePhoto: await readApplicationImage(document.getElementById("driverLicensePhoto").files[0]),
            citizenIdPhoto: await readApplicationImage(document.getElementById("driverCitizenIdPhoto").files[0])
          }
          : {
            affiliation: document.getElementById("coordAffiliation").value.trim(),
            motivation: document.getElementById("coordMotivation").value.trim(),
            citizenIdPhoto: await readApplicationImage(document.getElementById("coordCitizenIdPhoto").files[0])
          };

        const result = window.Auth.submitRoleApplication(role, details);
        window.Toast.show(result.message, result.success ? "success" : "error");
        if (result.success) {
          form.reset();
          form.querySelectorAll(".application-file-label").forEach((label) => {
            label.textContent = label.dataset.defaultText;
            label.style.color = "";
          });
          renderApplications();
        }
      } catch (error) {
        console.error("Không thể gửi hồ sơ ứng tuyển:", error);
        const message = error.name === "QuotaExceededError"
          ? "Không đủ dung lượng lưu ảnh. Hãy chọn ảnh nhỏ hơn rồi thử lại."
          : error.message || "Không thể xử lý ảnh. Vui lòng thử lại.";
        window.Toast.show(message, "error");
      } finally {
        submitButton.disabled = false;
      }
    }

    function readApplicationImage(file) {
      if (!file) return Promise.reject(new Error("Vui lòng chọn đầy đủ các ảnh hồ sơ."));
      if (!file.type.startsWith("image/")) return Promise.reject(new Error("Chỉ chấp nhận tệp ảnh."));
      if (file.size > 5 * 1024 * 1024) {
        return Promise.reject(new Error("Mỗi ảnh phải nhỏ hơn 5 MB."));
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Không thể đọc tệp ảnh đã chọn."));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error("Tệp ảnh không hợp lệ hoặc không thể mở."));
          image.onload = () => {
            if (!image.naturalWidth || !image.naturalHeight) {
              reject(new Error("Ảnh không có kích thước hợp lệ."));
              return;
            }
            const maxDimension = 1600;
            const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);
            const context = canvas.getContext("2d");
            if (!context) {
              reject(new Error("Trình duyệt không thể xử lý ảnh này."));
              return;
            }
            try {
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
            } catch (error) {
              reject(new Error("Không thể xử lý ảnh đã chọn."));
              return;
            }
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Không thể nén ảnh đã chọn."));
                return;
              }
              const compressedReader = new FileReader();
              compressedReader.onerror = () => reject(new Error("Không thể lưu ảnh đã xử lý."));
              compressedReader.onload = () => resolve({
                dataUrl: compressedReader.result,
                fileName: file.name
              });
              compressedReader.readAsDataURL(blob);
            }, "image/jpeg", 0.82);
          };
          image.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    }

    function renderApplications() {
      const applications = window.Storage.get("roleApplications");
      const statusNames = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };
      const currentUser = window.Auth.getCurrentUser();
      const renderApplication = (application, shared = false) => {
        const applicant = window.Storage.getById("users", application.userId);
        const details = application.details || {};
        const images = application.role === "driver"
          ? [["Ảnh phương tiện", details.vehiclePhoto], ["Ảnh GPLX", details.driverLicensePhoto], ["Ảnh CCCD", details.citizenIdPhoto]]
          : [["Ảnh CCCD", details.citizenIdPhoto]];
        return `
          <div class="card mb-2">
            <div class="card-body">
              <div class="d-flex justify-between items-center flex-wrap gap-2">
                <strong>${applicationRoleNames[application.role]}${shared ? ` · ${escapeHtml(applicant ? applicant.name : application.userName)}` : ""}</strong>
                <span class="badge ${application.status === "approved" ? "badge-success" : application.status === "rejected" ? "badge-danger" : "badge-warning"}">
                  ${statusNames[application.status] || escapeHtml(application.status)}
                </span>
              </div>
              <div class="d-grid grid-cols-2 gap-2 mt-2">
                ${images.map(([label, image]) => renderImage(label, image)).join("")}
              </div>
            </div>
          </div>
        `;
      };
      document.getElementById("myApplications").innerHTML = applications
        .filter((application) => currentUser && application.userId === currentUser.id)
        .map((application) => renderApplication(application))
        .join("")
        || '<p style="color: var(--text-muted);">Bạn chưa gửi đơn ứng tuyển nào.</p>';

      document.getElementById("sharedApplications").innerHTML = applications.length
        ? applications
          .filter((application) => {
            if (!currentUser) return false;
            if (application.userId === currentUser.id) return true;
            if (["admin", "superadmin"].includes(currentUser.role)) return true;
            if (currentUser.role !== "coordinator" || application.role !== "driver") return false;
            const applicant = window.Storage.getById("users", application.userId);
            const applicantRoles = applicant && (Array.isArray(applicant.roles)
              ? applicant.roles
              : [applicant.role || "rider"]);
            return Boolean(applicantRoles &&
              !applicantRoles.some((role) => ["admin", "superadmin"].includes(role)));
          })
          .map((application) => renderApplication(application, application.userId !== currentUser.id))
          .join("") || '<p style="color: var(--text-muted);">Chưa có đơn ứng tuyển nào.</p>'
        : '<p style="color: var(--text-muted);">Bạn chưa gửi đơn ứng tuyển nào.</p>';
    }

    function renderImage(label, image) {
      if (!image || !/^data:image\/jpeg;base64,/.test(image.dataUrl || "")) return "";
      return `<div><strong>${label}</strong><br><img src="${image.dataUrl}" alt="${label}" loading="lazy" style="display:block;max-width:100%;max-height:260px;object-fit:contain;margin-top:.4rem;border:1px solid var(--border-color);border-radius:var(--radius-md);"><small>${escapeHtml(image.fileName || "Ảnh đã tải lên")}</small></div>`;
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      })[character]);
    }
