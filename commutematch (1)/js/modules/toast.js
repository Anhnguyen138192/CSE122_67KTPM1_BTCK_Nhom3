/**
 * COMMUTEMATCH TOAST NOTIFICATION MODULE
 * Học phần: CSE122 - BTL-06 CommuteMatch
 */

window.Toast = {
  container: null,

  init: function () {
    if (!this.container) {
      let el = document.querySelector(".toast-container");
      if (!el) {
        el = document.createElement("div");
        el.className = "toast-container";
        document.body.appendChild(el);
      }
      this.container = el;
    }
  },

  show: function (message, type = "info", duration = 3500) {
    this.init();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "⚠️";
    if (type === "warning") icon = "🔔";

    toast.innerHTML = `
      <span style="font-size: 1.2rem;">${icon}</span>
      <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${message}</div>
      <button style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1.1rem;" onclick="this.parentElement.remove()">&times;</button>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }
};

document.addEventListener("DOMContentLoaded", () => window.Toast.init());
