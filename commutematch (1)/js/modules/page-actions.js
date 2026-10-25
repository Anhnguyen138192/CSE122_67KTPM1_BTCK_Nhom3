/* Delegated behavior for the SV2 pages; event logic stays in JavaScript. */
(() => {
  "use strict";

  const invoke = (name, ...args) => {
    const handler = window[name];
    if (typeof handler !== "function") {
      console.error(`CommuteMatch action "${name}" is not available.`);
      return;
    }
    return handler(...args);
  };

  const actions = {
    "open-kyc-file": () => document.getElementById("kycFile")?.click(),
    "open-add-vehicle": () => invoke("openAddVehicleModal"),
    "close-modal": (el) => window.Modal?.close(el.dataset.modalId),
    "send-quick": (el) => invoke("sendQuick", el.dataset.cmMessage || ""),
    "recommend-meeting-point": () => invoke("triggerAiZoneRecommendation"),
    "focus-trip-origin": () => {
      const select = document.getElementById("tripOrigin");
      (select?.value === "__custom__" ? document.getElementById("tripOriginCustom") : select)?.focus();
    },
    "focus-trip-destination": () => {
      const select = document.getElementById("tripDestination");
      (select?.value === "__custom__" ? document.getElementById("tripDestinationCustom") : select)?.focus();
    },
    "apply-ai-zone": () => invoke("applyAiZoneRecommendation"),
    "show-zone-options": () => {
      const group = document.getElementById("zoneSelectGroup");
      group.hidden = false;
      document.getElementById("tripZoneSelect")?.focus();
    },
    "filter-schedule": (el) => invoke("switchFilter", el.dataset.filter, el),
    "confirm-driver-cancel": () => invoke("confirmDriverCancel"),
    "toggle-seat-registration": () => invoke("toggleSeatRegistration"),
    "filter-requests": (el) => invoke("switchRequestTab", el.dataset.filter, el),
    "handle-execution-action": () => invoke("handleExecAction"),
    "export-earnings-report": () => invoke("exportReport"),
    "refresh-earnings": () => invoke("renderEarnings")
  };

  const submissions = {
    register: (form, event) => invoke("handleRegister", event),
    "save-vehicle": (form, event) => invoke("handleSaveVehicle", event),
    "send-message": (form, event) => invoke("handleSendMessage", event),
    "create-trip": (form, event) => invoke("handleCreateTrip", event),
    "save-recurring": (form, event) => invoke("saveRecurring", event)
  };

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-cm-action]");
    if (!el || el.disabled) return;
    actions[el.dataset.cmAction]?.(el, event);
  });

  document.addEventListener("change", (event) => {
    const el = event.target.closest("[data-cm-change-action]");
    if (!el) return;
    const action = el.dataset.cmChangeAction;
    if (action === "preview-file") invoke("previewFile", el);
    else actions[action]?.(el, event);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-cm-submit]");
    if (!form) return;
    event.preventDefault();
    submissions[form.dataset.cmSubmit]?.(form, event);
  });

  document.addEventListener("keydown", (event) => {
    const el = event.target.closest('[data-cm-action="open-kyc-file"]');
    if (!el || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    actions["open-kyc-file"](el, event);
  });
})();
