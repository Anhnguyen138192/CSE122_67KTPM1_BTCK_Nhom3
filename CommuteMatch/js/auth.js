const form = document.querySelector('#login-form');
const message = document.querySelector('#form-message');
const password = document.querySelector('#login-password');
const showPassword = document.querySelector('.show-password');
const roleTargets = {
  rider: 'Hanhkhach/rider-trip-search.html',
  driver: 'Nguoichiase/driver-trip-create.html',
  coordinator: 'Dieuphoi/coordinator-mobility-dashboard.html',
  admin: 'admin/admin-dashboard.html'
};
const requestedRole = new URLSearchParams(location.search).get('role');
if (roleTargets[requestedRole]) form.elements.role.value = requestedRole;

showPassword.addEventListener('click', () => {
  const reveal = password.type === 'password';
  password.type = reveal ? 'text' : 'password';
  showPassword.textContent = reveal ? 'Ẩn' : 'Hiện';
  showPassword.setAttribute('aria-pressed', String(reveal));
  showPassword.setAttribute('aria-label', reveal ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
});

document.querySelector('.forgot-button').addEventListener('click', () => {
  const email = form.elements.email;
  if (!email.value.trim()) {
    message.className = 'form-message';
    message.textContent = 'Nhập email để nhận hướng dẫn đặt lại mật khẩu (mô phỏng).';
    email.focus();
    return;
  }
  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }
  message.className = 'form-message success';
  message.textContent = `Đã gửi hướng dẫn đặt lại mật khẩu tới ${email.value} (mô phỏng).`;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.className = 'form-message';
  if (!form.reportValidity()) return;
  const email = form.elements.email.value.trim();
  const role = form.elements.role.value;
  const submit = form.querySelector('.login-submit');
  submit.disabled = true;
  submit.querySelector('span:first-child').textContent = 'Đang đăng nhập…';
  message.textContent = 'Đang kiểm tra thông tin (mô phỏng).';
  const displayName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const session = { email, displayName, role, signedInAt: new Date().toISOString() };
  const store = form.elements.remember.checked ? localStorage : sessionStorage;
  store.setItem('commutematch-session', JSON.stringify(session));
  localStorage.setItem('cm-current-role', role);
  setTimeout(() => { window.location.href = roleTargets[role]; }, 250);
});




