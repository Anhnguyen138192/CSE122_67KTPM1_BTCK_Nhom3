/**
 * COMMUTEMATCH MODAL CONTROLLER
 * Học phần: CSE122 - BTL-06 CommuteMatch
 */

const modalPreviousFocus = new Map();
let modalListenersInitialized = false;

function getModalDialog(modal) {
  return modal && (modal.querySelector(".modal-box") || modal);
}

function prepareModalDialog(modal, dialog, modalId) {
  if (!dialog.hasAttribute("role")) dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  if (!dialog.hasAttribute("tabindex")) dialog.setAttribute("tabindex", "-1");

  if (!dialog.hasAttribute("aria-labelledby")) {
    const title = dialog.querySelector(".modal-header h1, .modal-header h2, .modal-header h3, .modal-header [data-modal-title]");
    if (title) {
      if (!title.id) title.id = `${modalId}-title`;
      dialog.setAttribute("aria-labelledby", title.id);
    }
  }
}

window.Modal = {
  open: function (modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      const dialog = getModalDialog(el);
      if (!el.classList.contains("show")) {
        modalPreviousFocus.set(modalId, document.activeElement);
      }
      prepareModalDialog(el, dialog, modalId);
      el.classList.add("show");
      el.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      dialog.focus();
    }
  },

  close: function (modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove("show");
      el.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      const previousFocus = modalPreviousFocus.get(modalId);
      modalPreviousFocus.delete(modalId);
      if (previousFocus && previousFocus.isConnected && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    }
  },

  initListeners: function () {
    if (modalListenersInitialized) return;
    modalListenersInitialized = true;

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        window.Modal.close(e.target.id);
      }
      if (e.target.dataset.closeModal) {
        window.Modal.close(e.target.dataset.closeModal);
      }
    });

    document.addEventListener("keydown", (e) => {
      const openModals = document.querySelectorAll(".modal-backdrop.show");
      const modal = openModals[openModals.length - 1];
      if (!modal) return;

      const dialog = getModalDialog(modal);
      if (e.key === "Escape") {
        e.preventDefault();
        window.Modal.close(modal.id);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = Array.from(dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        e.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        e.preventDefault();
        first.focus();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", () => window.Modal.initListeners());
