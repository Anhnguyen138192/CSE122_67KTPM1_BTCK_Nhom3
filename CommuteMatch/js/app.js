const toast = document.querySelector('.toast');
const tripDialog = document.querySelector('.trip-dialog');
const dialogBody = document.querySelector('.dialog-body');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
}

document.querySelector('.search-button').addEventListener('click', () => {
  const originInput = document.querySelector('.search-fields [name="origin"]');
  const destinationInput = document.querySelector('.search-fields [name="destination"]');
  const origin = originInput.value.trim();
  const destination = destinationInput.value.trim();
  if (!origin || !destination) {
    showToast('Vui lòng nhập điểm đón và điểm đến.');
    (!origin ? originInput : destinationInput).focus();
    return;
  }
  const trip = {
    origin,
    destination,
    date: document.querySelector('.search-fields [name="date"]').value,
    people: document.querySelector('.search-fields [name="people"]').value,
    vehicle: document.querySelector('.search-fields [name="vehicle"]').value
  };
  localStorage.setItem('cm-trip-search', JSON.stringify(trip));
  const query = new URLSearchParams(trip);
  window.location.href = `${document.querySelector('.search-button').dataset.resultsUrl}?${query}`;
});

function openTripDetails(card) {
  const driver = card.querySelector('.driver strong').textContent;
  const route = [...card.querySelectorAll('.stop-labels strong')].map((item) => item.textContent.trim());
  const price = card.querySelector('.trip-price strong').textContent;
  const seats = card.querySelector('.seats').textContent.trim();
  dialogBody.innerHTML = `<p><strong>Tài xế:</strong> ${driver}</p><p><strong>Lộ trình:</strong> ${route.join(' → ')}</p><p><strong>Chi phí:</strong> ${price} / người</p><p><strong>Tình trạng:</strong> ${seats}</p><p class="dialog-note">Đây là dữ liệu minh họa cho nguyên mẫu CommuteMatch.</p>`;
  tripDialog.showModal();
}

document.querySelectorAll('.details-button').forEach((button) => button.addEventListener('click', () => openTripDetails(button.closest('.trip-card'))));
document.querySelector('.dialog-close').addEventListener('click', () => tripDialog.close());
document.querySelector('.request-button').addEventListener('click', () => {
  tripDialog.close();
  showToast('Đã gửi yêu cầu tham gia chuyến (mô phỏng).');
});

const cards = [...document.querySelectorAll('.trip-card')];
const sortButton = document.querySelector('.sort-button');
sortButton.addEventListener('click', () => {
  const current = sortButton.dataset.sort || 'match';
  const next = current === 'match' ? 'price' : current === 'price' ? 'time' : 'match';
  sortButton.dataset.sort = next;
  const labels = { match: 'Phù hợp nhất', price: 'Giá thấp nhất', time: 'Khởi hành sớm' };
  sortButton.innerHTML = `Sắp xếp: <strong>${labels[next]}</strong>⌄`;
  const sorted = [...document.querySelectorAll('.trip-card')].sort((a, b) => {
    if (next === 'price') return Number(a.querySelector('.trip-price strong').textContent.replace(/\D/g, '')) - Number(b.querySelector('.trip-price strong').textContent.replace(/\D/g, ''));
    if (next === 'time') return a.querySelector('.stop-labels strong').textContent.localeCompare(b.querySelector('.stop-labels strong').textContent);
    return Number(b.querySelector('.match-badge').textContent.replace(/\D/g, '')) - Number(a.querySelector('.match-badge').textContent.replace(/\D/g, ''));
  });
  sorted.forEach((card) => document.querySelector('.more-button').before(card));
});

const filterButton = document.querySelector('.filter-button');
const filterPanel = document.querySelector('.trip-filters');
const filterInputs = [...filterPanel.querySelectorAll('select')];
function applyTripFilters() {
  const [maxPrice, maxKm, minRating] = filterInputs.map((input) => input.value === '' ? null : Number(input.value));
  const visibleCards = [...document.querySelectorAll('.trip-card')];
  visibleCards.forEach((card) => {
    const price = Number(card.querySelector('.trip-price strong').textContent.replace(/\D/g, ''));
    const distance = Number(card.querySelector('.stop-labels small').textContent.match(/[\d.]+(?=\s*km)/i)?.[0] || Infinity);
    const rating = Number(card.querySelector('.driver-meta').textContent.match(/★\s*([\d.]+)/)?.[1] || 0);
    card.hidden = (maxPrice !== null && price > maxPrice) || (maxKm !== null && distance > maxKm) || (minRating !== null && rating < minRating);
  });
  const count = visibleCards.filter((card) => !card.hidden).length;
  document.querySelector('.result-count').innerHTML = `Tìm thấy <strong>${count} chuyến</strong> phù hợp`;
}
filterButton.addEventListener('click', () => {
  filterPanel.hidden = !filterPanel.hidden;
  filterButton.classList.toggle('filter-active', !filterPanel.hidden);
  filterButton.setAttribute('aria-expanded', String(!filterPanel.hidden));
});
filterInputs.forEach((input) => input.addEventListener('change', applyTripFilters));
filterPanel.querySelector('.filter-reset').addEventListener('click', () => {
  filterInputs.forEach((input) => { input.value = ''; });
  applyTripFilters();
});

document.querySelector('.more-button').addEventListener('click', (event) => {
  const button = event.currentTarget;
  if (button.dataset.loaded) return showToast('Bạn đã xem hết chuyến mẫu hiện có.');
  const extra = cards[1].cloneNode(true);
  extra.querySelector('.driver strong').textContent = 'Mai Phương';
  extra.querySelector('.driver-meta').innerHTML = '★ 4.8 <i>·</i> 9 chuyến';
  window.cmRefreshAirportTripPrices?.();
  extra.querySelector('.match-badge').textContent = '✦ Khớp 76%';
  extra.querySelector('.driver-avatar').textContent = 'MP';
  extra.hidden = false;
  button.before(extra);
  extra.querySelector('.details-button').addEventListener('click', () => openTripDetails(extra));
  window.cmRefreshAirportTripPrices?.();
  button.dataset.loaded = 'true';
  button.innerHTML = 'Đã tải thêm <span aria-hidden="true">✓</span>';
  showToast('Đã thêm một chuyến mẫu vào danh sách.');
});

const themeToggles = [...document.querySelectorAll('.theme-toggle')];
const savedTheme = localStorage.getItem('commutematch-theme');
if (savedTheme === 'dark') document.body.classList.add('dark-theme');
function updateThemeControl() {
  const isDark = document.body.classList.contains('dark-theme');
  themeToggles.forEach((button) => {
    button.setAttribute('aria-label', isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    button.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
    button.querySelector('.theme-label').textContent = isDark ? 'Sáng' : 'Tối';
  });
}
updateThemeControl();
themeToggles.forEach((button) => button.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('commutematch-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
  updateThemeControl();
}));
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelectorAll('.main-nav a').forEach((item) => item.classList.remove('active'));
  link.classList.add('active');
}));



