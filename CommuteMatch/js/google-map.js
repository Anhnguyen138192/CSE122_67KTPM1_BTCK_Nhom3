(() => {
  const screen = document.body.dataset.screen;
  if (!['rider-trip-search', 'driver-trip-create'].includes(screen)) return;
  const form = document.querySelector('#trip-search, #create-trip');
  if (!form) return;
  const panel = document.createElement('section');
  panel.className = 'map-panel';
  panel.innerHTML = `<div class="map-heading"><div><h3>Chọn điểm trên bản đồ</h3><p>Bấm vào bản đồ để đặt điểm đang chọn hoặc kéo ghim để chỉnh vị trí.</p></div><div class="map-controls"><button class="map-select active" type="button" data-map-point="pickup">Đặt điểm đón</button><button class="map-select" type="button" data-map-point="destination">Đặt điểm đến</button></div></div><div class="map-canvas" id="trip-map" role="application" aria-label="Bản đồ chọn điểm đón và điểm đến"></div><p class="map-message map-status" role="status" aria-live="polite">Đang chuẩn bị bản đồ…</p><div class="map-coordinates"><span class="map-coordinate" data-coordinate="pickup">Điểm đón: chưa chọn</span><span class="map-coordinate" data-coordinate="destination">Điểm đến: chưa chọn</span></div>`;
  form.insertAdjacentElement('afterend', panel);

  const status = panel.querySelector('.map-status');
  const mapHost = panel.querySelector('#trip-map');
  let activePoint = 'pickup';
  const storedPoint = (key, fallback) => { try { return JSON.parse(localStorage.getItem(`cm-map-${key}`)) || fallback; } catch { return fallback; } };
  const points = {
    pickup: storedPoint('pickup', { lat: 10.8012, lng: 106.7104 }),
    destination: storedPoint('destination', { lat: 10.8702, lng: 106.8031 })
  };
  const markers = {};
  const fieldFor = (name) => form.querySelector(`[name="${name}"]`);
  function updatePoint(kind, position) {
    points[kind] = { lat: position.lat(), lng: position.lng() };
    const { lat, lng } = points[kind];
    panel.querySelector(`[data-coordinate="${kind}"]`).textContent = `${kind === 'pickup' ? 'Điểm đón' : 'Điểm đến'}: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const target = fieldFor(kind === 'pickup' ? 'origin' : 'destination');
    if (target) target.value = `${kind === 'pickup' ? 'Điểm đón' : 'Điểm đến'} (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
    localStorage.setItem(`cm-map-${kind}`, JSON.stringify(points[kind]));
  }
  panel.querySelectorAll('[data-map-point]').forEach((button) => button.addEventListener('click', () => {
    activePoint = button.dataset.mapPoint;
    panel.querySelectorAll('[data-map-point]').forEach((item) => item.classList.toggle('active', item === button));
    status.textContent = `Đang chọn ${activePoint === 'pickup' ? 'điểm đón' : 'điểm đến'}; bấm bản đồ hoặc kéo ghim để cập nhật.`;
  }));
  function showKeyHelp() {
    mapHost.innerHTML = '<div class="map-key-help"><strong>Bản đồ Google Maps chưa được kết nối</strong><p>Cần thêm API key vào <code>google-maps-config.js</code> và bật Maps JavaScript API trong Google Cloud.</p></div>';
    status.classList.add('error');
    status.textContent = 'Bạn vẫn có thể nhập địa chỉ ở biểu mẫu; bản đồ tương tác sẽ hoạt động sau khi cấu hình API key.';
  }
  function initMap() {
    const map = new google.maps.Map(mapHost, {
      center: { lat: 10.8231, lng: 106.6297 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });
    const makeMarker = (kind, label, color) => {
      const marker = new google.maps.Marker({
        map,
        position: points[kind],
        draggable: true,
        title: label,
        label: { text: kind === 'pickup' ? 'A' : 'B', color: '#fff', fontWeight: '700' },
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: color, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 }
      });
      marker.addListener('dragend', (event) => updatePoint(kind, event.latLng));
      markers[kind] = marker;
    };
    makeMarker('pickup', 'Điểm đón', '#278767');
    makeMarker('destination', 'Điểm đến', '#e28c70');
    map.addListener('click', (event) => {
      markers[activePoint].setPosition(event.latLng);
      updatePoint(activePoint, event.latLng);
    });
    Object.entries(points).forEach(([kind, point]) => updatePoint(kind, new google.maps.LatLng(point.lat, point.lng)));
    status.classList.remove('error');
    status.textContent = 'Bản đồ đã sẵn sàng. Chọn điểm đón/điểm đến rồi bấm bản đồ hoặc kéo ghim.';
  }
  const key = window.COMMUTEMATCH_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) { showKeyHelp(); return; }
  window.initCommuteMatchMap = initMap;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initCommuteMatchMap&loading=async&v=weekly`;
  script.async = true;
  script.onerror = showKeyHelp;
  document.head.appendChild(script);
})();
