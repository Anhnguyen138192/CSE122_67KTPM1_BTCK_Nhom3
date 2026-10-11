(() => {
  let session = null;
  try { for (const store of [localStorage, sessionStorage]) { const value = JSON.parse(store.getItem('commutematch-session') || 'null'); if (value?.email) { session = value; break; } } } catch {}
  if (!session) { document.documentElement.style.visibility = 'hidden'; window.location.replace('../index.html#login'); }
})();
