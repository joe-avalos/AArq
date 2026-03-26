export function initLangToggle() {
  const buttons = document.querySelectorAll('.lang-toggle');
  if (!buttons.length) return;

  function getLang() {
    return document.documentElement.lang || 'en';
  }

  function updateButtons(lang) {
    buttons.forEach(btn => {
      btn.textContent = lang === 'en' ? 'ES' : 'EN';
      btn.setAttribute('aria-label',
        lang === 'en' ? 'Cambiar a español' : 'Switch to English'
      );
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = getLang() === 'en' ? 'es' : 'en';
      document.documentElement.lang = next;
      localStorage.setItem('lang', next);
      updateButtons(next);
    });
  });

  updateButtons(getLang());
}
