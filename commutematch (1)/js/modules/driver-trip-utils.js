/* Shared helpers for driver trip updates, seat counts, and cost wording. */
(function () {
  function getRequests(tripId) {
    return window.Storage.get("joinRequests").filter((request) => request.tripId === tripId);
  }

  function getDriverTrips(driverId, driverName, driverUsername) {
    return window.Storage.get("trips").filter((trip) =>
      trip.driverId === driverId ||
      (driverUsername && String(trip.driverUsername || "").toLowerCase() === String(driverUsername).toLowerCase()) ||
      (!trip.driverId && driverName && trip.driverName === driverName)
    );
  }

  function getDriverRequests(driverId, driverName, driverUsername) {
    const tripIds = new Set(getDriverTrips(driverId, driverName, driverUsername).map((trip) => String(trip.id)));
    return window.Storage.get("joinRequests").filter((request) => tripIds.has(String(request.tripId)));
  }

  function syncSeats(tripId, options = {}) {
    const trip = window.Storage.getById("trips", tripId);
    if (!trip) return null;

    const acceptedSeats = getRequests(tripId)
      .filter((request) => request.status === "accepted")
      .reduce((sum, request) => sum + Math.max(1, Number(request.seatsRequested) || 1), 0);
    const totalSeats = Math.max(0, Number(trip.totalSeats) || 0);
    const closed = options.closed === undefined ? Boolean(trip.registrationClosed) : Boolean(options.closed);
    const availableSeats = closed ? 0 : Math.max(0, totalSeats - acceptedSeats);
    const updated = { acceptedSeats, availableSeats, registrationClosed: closed };
    if (trip.acceptedSeats !== acceptedSeats || trip.availableSeats !== availableSeats || Boolean(trip.registrationClosed) !== closed) {
      window.Storage.update("trips", tripId, updated);
    }
    return { ...trip, ...updated };
  }

  function notifyUsers(userIds, notification) {
    [...new Set(userIds.filter(Boolean))].forEach((userId) => {
      window.Storage.insert("notifications", {
        userId,
        title: notification.title,
        message: notification.message,
        time: "Vừa xong",
        createdAt: new Date().toISOString(),
        type: notification.type || "trip_update",
        tripId: notification.tripId,
        unread: true,
        link: notification.link || "rider/rider-my-trips.html"
      });
    });
  }

  function notifyTripPassengers(trip, notification, statuses = ["accepted", "pending"]) {
    if (!trip) return;
    const riderIds = getRequests(trip.id)
      .filter((request) => statuses.includes(request.status))
      .map((request) => request.riderId);
    notifyUsers(riderIds, { ...notification, tripId: trip.id });
  }

  function costDescription(vehicleType) {
    return vehicleType === "electric"
      ? "Khoản đóng góp chia sẻ chi phí sạc điện của chuyến đi."
      : vehicleType === "gasoline"
        ? "Khoản đóng góp chia sẻ chi phí nhiên liệu của chuyến đi."
        : "Khoản đóng góp chia sẻ chi phí chuyến đi.";
  }

  function costLabel(vehicleType) {
    return vehicleType === "electric" ? "Chi phí sạc điện / người" :
      vehicleType === "gasoline" ? "Chi phí nhiên liệu / người" : "Chi phí chuyến đi / người";
  }

  window.DriverTripUtils = { getRequests, getDriverTrips, getDriverRequests, syncSeats, notifyUsers, notifyTripPassengers, costDescription, costLabel };
})();
