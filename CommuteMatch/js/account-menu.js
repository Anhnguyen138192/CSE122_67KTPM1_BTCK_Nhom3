(() => {
  const profile = document.querySelector('.profile');
  if (!profile) return;
  const isRoleScreen = Boolean(document.body.dataset.screen);
  const loginHref = isRoleScreen ? '../index.html#login' : 'index.html#login';
  const routePrefix = isRoleScreen ? '../' : '';
  const routes = {
    rider: `${routePrefix}Hanhkhach/rider-trip-search.html`,
    driver: `${routePrefix}Nguoichiase/driver-trip-create.html`,
    coordinator: `${routePrefix}Dieuphoi/coordinator-mobility-dashboard.html`,
    admin: `${routePrefix}admin/admin-dashboard.html`
  };
  const control = document.createElement('div');
  control.className = 'account-control';
  profile.parentNode.insertBefore(control, profile);
  control.appendChild(profile);

  if (!profile.querySelector('.profile-chevron')) {
    const chevron = document.createElement('span');
    chevron.className = 'profile-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '⌄';
    profile.appendChild(chevron);
  }
  profile.setAttribute('aria-haspopup', 'menu');
  profile.setAttribute('aria-expanded', 'false');
  profile.onclick = null;

  let sessionStorageType = localStorage;
  const session = (() => {
    for (const storage of [localStorage, sessionStorage]) {
      try {
        const value = JSON.parse(storage.getItem('commutematch-session'));
        if (value?.email) { sessionStorageType = storage; return value; }
      } catch { /* Ignore invalid demo session data. */ }
    }
    return null;
  })();
  if (session) {
    const displayName = session.displayName || session.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const nameNode = profile.querySelector('.profile-name');
    const avatarNode = profile.querySelector('.avatar');
    if (nameNode) nameNode.textContent = displayName;
    if (avatarNode) avatarNode.textContent = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }
  const accountMenu = document.createElement('div');
  accountMenu.className = 'account-menu';
  accountMenu.hidden = true;
  accountMenu.innerHTML = `<p class="account-menu-caption">${session ? `Tài khoản <strong>${session.displayName || session.email}</strong>` : 'Bạn chưa đăng nhập'}</p><label class="account-role-label" for="account-role">Vai trò</label><select id="account-role" class="account-role-select"><option value="rider">Hành khách</option><option value="driver">Người chia sẻ xe</option><option value="coordinator">Điều phối viên</option><option value="admin">Quản trị viên</option></select><button class="account-role-submit" type="button" data-role-submit>${session ? 'Chuyển vai trò' : 'Đăng nhập với vai trò này'}</button>${session ? '<a href="'+routePrefix+'profile.html">Hồ sơ cá nhân</a><a href="'+routePrefix+'notifications.html">Thông báo</a><a href="'+loginHref+'">Đổi tài khoản</a><button type="button" data-sign-out>Đăng xuất</button>' : ''}`;
  const roleSelect = accountMenu.querySelector('.account-role-select');
  roleSelect.value = session?.role || localStorage.getItem('cm-current-role') || 'rider';
  if (!session) accountMenu.querySelector('[data-role-submit]').addEventListener('click', () => { window.location.href = `${routePrefix}index.html?role=${encodeURIComponent(roleSelect.value)}#login`; });
  else accountMenu.querySelector('[data-role-submit]').addEventListener('click', () => {
    session.role = roleSelect.value;
    sessionStorageType.setItem('commutematch-session', JSON.stringify(session));
    localStorage.setItem('cm-current-role', session.role);
    window.location.href = routes[session.role];
  });
  accountMenu.querySelector('a[href="' + loginHref + '"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem('commutematch-session');
    sessionStorage.removeItem('commutematch-session');
    localStorage.removeItem('cm-current-role');
    window.location.href = loginHref;
  });  control.appendChild(accountMenu);

  function closeMenu() {
    accountMenu.hidden = true;
    profile.setAttribute('aria-expanded', 'false');
  }
  profile.addEventListener('click', () => {
    accountMenu.hidden = !accountMenu.hidden;
    profile.setAttribute('aria-expanded', String(!accountMenu.hidden));
  });
  document.addEventListener('click', (event) => {
    if (!control.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  accountMenu.querySelector('[data-sign-out]')?.addEventListener('click', () => {
    localStorage.removeItem('commutematch-session');
    sessionStorage.removeItem('commutematch-session');
    localStorage.removeItem('cm-current-role');
    window.location.href = loginHref;
  });
})();





