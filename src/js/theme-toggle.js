export function initThemeToggle() {
  const buttons = document.querySelectorAll('.theme-toggle');
  if (!buttons.length) return;

  function getTheme() {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function updateButtons(theme) {
    buttons.forEach(btn => {
      const isDark = theme === 'dark';
      btn.querySelector('.icon-sun')?.classList.toggle('hidden', !isDark);
      btn.querySelector('.icon-moon')?.classList.toggle('hidden', isDark);
      btn.setAttribute('aria-label',
        isDark ? btn.dataset.labelLight : btn.dataset.labelDark
      );
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      if (next === 'light') delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = 'dark';
      localStorage.setItem('theme', next);
      updateButtons(next);
    });
  });

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
      updateButtons(e.matches ? 'dark' : 'light');
    }
  });

  updateButtons(getTheme());
}
