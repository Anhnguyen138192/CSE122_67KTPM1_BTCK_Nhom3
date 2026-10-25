/**
 * COMMUTEMATCH MODAL CONTROLLER
 * Học phần: CSE122 - BTL-06 CommuteMatch
 */

window.Modal = {
  open: function (modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  },

  close: function (modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove("show");
      document.body.style.overflow = "";
    }
  },

  initListeners: function () {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        e.target.classList.remove("show");
        document.body.style.overflow = "";
      }
      if (e.target.dataset.closeModal) {
        this.close(e.target.dataset.closeModal);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => window.Modal.initListeners());
