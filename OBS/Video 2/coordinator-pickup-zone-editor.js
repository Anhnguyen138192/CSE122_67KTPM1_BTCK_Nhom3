let editingID = null;

document.addEventListener("DOMContentLoaded"),() =>{
    const urlParams = new URLSearchParams(window.location.search)
    editingID = urlParams.get("id")

    if(editiingId) {
        const titleEl = document.getElementById("editorTitle");
        if(titleEl) {
            titleEl.innerText ="Cập nhật trạm đón an toàn"}
        
const z = window.Storage.getByID("pickupZones",editingId);
 if (z) {
      document.getElementById("zName").value = z.name || "";
      document.getElementById("zArea").value = z.area || "";
      document.getElementById("zCoordinates").value = z.coordinates || "";
      document.getElementById("zAddress").value = z.address || "";
      document.getElementById("zCapacity").value = z.capacity !== undefined ? z.capacity : "";
      document.getElementById("zSafetyScore").value = z.safetyScore !== undefined ? z.safetyScore : "";
      document.getElementById("zHasSidewalk").checked = !!z.hasSidewalk;
      document.getElementById("zHasLighting").checked = !!z.hasLighting;
      document.getElementById("zHasCCTV").checked = !!z.hasCCTV;
      document.getElementById("zHasShelter").checked = !!z.hasShelter;
      document.getElementById("zNotes").value = z.notes || "";
    }
  }

  // Gắn sự kiện submit cho form
  const formEl = document.getElementById("zoneEditorForm");
  if (formEl) {
    formEl.addEventListener("submit", savePickupZone);
  }
};

function savePickupZone(e) {
  e.preventDefault();

  const zoneData = {
    name: document.getElementById("zName").value.trim(),
    area: document.getElementById("zArea").value,
    coordinates: document.getElementById("zCoordinates").value.trim(),
    address: document.getElementById("zAddress").value.trim(),
    capacity: parseInt(document.getElementById("zCapacity").value, 10),
    safetyScore: parseFloat(document.getElementById("zSafetyScore").value),
    hasSidewalk: document.getElementById("zHasSidewalk").checked,
    hasLighting: document.getElementById("zHasLighting").checked,
    hasCCTV: document.getElementById("zHasCCTV").checked,
    hasShelter: document.getElementById("zHasShelter").checked,
    status: "active",
    notes: document.getElementById("zNotes").value.trim()
  };

  if (editingId) {
    window.Storage.update("pickupZones", editingId, zoneData);
    window.Toast.show("Đã cập nhật trạm đón thành công!", "success");
  } else {
    zoneData.id = "zone_" + Date.now();
    window.Storage.insert("pickupZones", zoneData);
    window.Toast.show("Đã thêm trạm đón mới vào danh mục!", "success");
  }
}