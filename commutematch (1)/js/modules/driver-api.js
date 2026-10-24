/* CommuteMatch driver API adapter for the MockAPI driverData resource. */
(function () {
  const API_BASE_URL = "https://6ad6d130f71f154ac4871fa2.mockapi.io/api/v1";
  const ENDPOINT = `${API_BASE_URL}/driverData`;
  const ENTITY_TYPES = { trips: "trip", joinRequests: "joinRequest", notifications: "notification", driverRecurring: "driverRecurring" };
  const remoteIds = new Map();
  const localNewRecords = new Set();
  let initialized = false;
  let warnedOffline = false;

  function cacheKey(type, id) {
    return `${type}:${id}`;
  }

  function parsePayload(row) {
    try {
      return typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    } catch (error) {
      console.warn("MockAPI record payload could not be parsed:", row.id, error);
      return null;
    }
  }

  async function request(url = ENDPOINT, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) }
    });
    if (!response.ok) throw new Error(`MockAPI ${response.status}: ${response.statusText}`);
    return response.status === 204 ? null : response.json();
  }

  function mergeRemoteRecords(rows) {
    const mergedByEntity = new Map();
    rows.forEach((row) => {
      const entity = Object.keys(ENTITY_TYPES).find((key) => ENTITY_TYPES[key] === row.recordType);
      if (entity && row.recordId && row.id) remoteIds.set(cacheKey(row.recordType, row.recordId), row.id);
      const payload = parsePayload(row);
      if (!entity || !payload || !payload.id) return;
      if (!mergedByEntity.has(entity)) mergedByEntity.set(entity, new Map());
      mergedByEntity.get(entity).set(String(payload.id), payload);
    });

    mergedByEntity.forEach((remoteById, entity) => {
      const localById = new Map(window.Storage.get(entity).map((item) => [String(item.id), item]));
      remoteById.forEach((record, id) => localById.set(id, record));
      localStorage.setItem(`commutematch_${entity}`, JSON.stringify([...localById.values()]));
      window.dispatchEvent(new CustomEvent("commute_storage_updated", { detail: { entity, action: "api-sync" } }));
    });
  }

  function ensureRecurringTrips() {
    const users = new Map(window.Storage.get("users").map((user) => [String(user.id), user]));
    const templates = window.Storage.get("driverRecurring").filter((template) => template.active);
    templates.forEach((template) => {
      const driver = users.get(String(template.driverId)) || window.Storage.get("users").find((user) =>
        template.driverUsername && String(user.username || "").toLowerCase() === String(template.driverUsername).toLowerCase()
      );
      if (!driver || !Array.isArray(template.days) || !template.days.length) return;
      const generated = new Set(template.generatedDates || []);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let changed = false;
      for (let offset = 1; offset <= 14; offset += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        const weekDay = date.getDay() === 0 ? 7 : date.getDay();
        if (!template.days.includes(weekDay)) continue;
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (generated.has(dateKey)) continue;
        const routes = [
          { route: template.outboundRoute, time: template.outboundTime, direction: "out" },
          { route: template.returnRoute, time: template.returnTime, direction: "return" }
        ].filter((entry) => entry.route && entry.time).map((entry) => ({
          ...entry,
          points: entry.route.split(/\s*(?:→|->|–|—)\s*/).map((part) => part.trim()).filter(Boolean)
        })).filter((entry) => entry.points.length === 2);
        routes.forEach((entry) => {
          const id = `recurring_${template.id}_${dateKey}_${entry.direction}`;
          if (window.Storage.getById("trips", id)) return;
          const seats = Math.max(1, Math.min(4, Number(template.totalSeats) || 1));
          const vehicleType = template.vehicleType === "gasoline" ? "gasoline" : "electric";
          window.Storage.insert("trips", {
            id, recurringId: template.id, driverId: driver.id, driverUsername: driver.username || "", driverName: driver.name,
            driverAvatar: driver.avatar || "TX", driverRating: Number(driver.rating) || 0, driverPhone: driver.phone,
            origin: entry.points[0], destination: entry.points[1], departureDate: dateKey, departureTime: entry.time,
            vehicleInfo: template.vehicleInfo || "", vehicleType,
            totalSeats: seats, availableSeats: seats, acceptedSeats: 0,
            costSharing: Math.max(5000, Math.min(35000, Number(template.costSharing) || 12000)),
            costType: vehicleType === "electric" ? "charging" : "fuel",
            status: "scheduled", registrationClosed: false, pickupZoneId: "", pickupZoneName: entry.points[0],
            routePoints: entry.points, notes: "Chuyến được tạo tự động từ lịch trình định kỳ."
          });
        });
        generated.add(dateKey);
        changed = true;
      }
      if (changed) window.Storage.update("driverRecurring", template.id, { generatedDates: [...generated] });
    });
  }

  async function persistRecord(entity, record, allowCreate = false) {
    if (!record || !record.id || !ENTITY_TYPES[entity]) return;
    const type = ENTITY_TYPES[entity];
    const key = cacheKey(type, record.id);
    const knownRemoteId = remoteIds.get(key);
    if (!knownRemoteId && !allowCreate && !localNewRecords.has(key)) return;

    const body = JSON.stringify({ recordType: type, recordId: String(record.id), payload: JSON.stringify(record) });
    const saved = await request(knownRemoteId ? `${ENDPOINT}/${encodeURIComponent(knownRemoteId)}` : ENDPOINT, {
      method: knownRemoteId ? "PUT" : "POST",
      body
    });
    if (saved?.id) remoteIds.set(key, saved.id);
    localNewRecords.delete(key);
  }

  function reportOffline(error) {
    console.warn("CommuteMatch API is unavailable; existing local browser storage remains active.", error);
    if (!warnedOffline) {
      warnedOffline = true;
      window.Toast?.show("Chưa kết nối được API. Dữ liệu hiện có vẫn ở trên trình duyệt này.", "warning");
    }
  }

  async function initialize() {
    try {
      const rows = await request();
      if (!Array.isArray(rows)) throw new Error("driverData endpoint must return a list");

      // The user approved moving existing demo trips and join requests to their MockAPI project.
      const localTrips = window.Storage.get("trips");
      const tripIds = new Set(localTrips.map((trip) => String(trip.id)));
      const localRequests = window.Storage.get("joinRequests").filter((item) => tripIds.has(String(item.tripId)));
      const seedIfMissing = async (entity, record) => {
        const type = ENTITY_TYPES[entity];
        const key = cacheKey(type, record.id);
        if (remoteIds.has(key) || rows.some((row) => row.recordType === type && String(row.recordId) === String(record.id))) return;
        const saved = await request(ENDPOINT, {
          method: "POST",
          body: JSON.stringify({ recordType: type, recordId: String(record.id), payload: JSON.stringify(record) })
        });
        if (saved?.id) {
          remoteIds.set(key, saved.id);
          rows.push(saved);
        }
      };

      for (const trip of localTrips) await seedIfMissing("trips", trip);
      for (const item of localRequests) await seedIfMissing("joinRequests", item);

      mergeRemoteRecords(rows);
      ensureRecurringTrips();
      initialized = true;
      return true;
    } catch (error) {
      reportOffline(error);
      ensureRecurringTrips();
      return false;
    }
  }

  const ready = initialize();
  ["insert", "update"].forEach((method) => {
    const original = window.Storage[method].bind(window.Storage);
    window.Storage[method] = function (entity, ...args) {
      const record = original(entity, ...args);
      const type = ENTITY_TYPES[entity];
      if (type && record) {
        const key = cacheKey(type, record.id);
        const isInsert = method === "insert";
        if (isInsert) localNewRecords.add(key);
        ready.then(() => persistRecord(entity, record, isInsert)).catch(reportOffline);
      }
      return record;
    };
  });

  window.DriverApi = {
    baseUrl: API_BASE_URL,
    endpoint: ENDPOINT,
    ready,
    isConnected: () => initialized,
    refresh: async () => {
      const rows = await request();
      mergeRemoteRecords(rows);
      return rows;
    },
    save: persistRecord
  };
})();
