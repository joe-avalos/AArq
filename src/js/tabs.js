/**
 * initTabs — WAI-ARIA tabs pattern implementation.
 *
 * Expects container to have:
 *   [role="tablist"] [role="tab"]   — tab buttons with aria-controls pointing to panel id
 *   [role="tabpanel"]               — panels with matching id
 *
 * Supports:
 *   - Click to activate tab
 *   - Left/Right arrow key navigation with wrap-around
 *   - Hash-based deep linking on init and on hashchange (e.g. #construction activates that tab)
 */
export function initTabs(container) {
  const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
  const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));

  if (tabs.length === 0 || panels.length === 0) return;

  function activateTab(tab) {
    // Deactivate all tabs
    tabs.forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    // Activate the selected tab
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');

    // Hide all panels, show the matching panel
    const targetId = tab.getAttribute('aria-controls');
    panels.forEach((panel) => {
      if (panel.id === targetId) {
        panel.style.display = 'block';
        panel.removeAttribute('hidden');
      } else {
        panel.style.display = 'none';
        panel.setAttribute('hidden', '');
      }
    });
  }

  function activateFromHash() {
    const hash = location.hash.replace('#', '');
    if (!hash) return false;
    const hashTab = tabs.find((t) => t.getAttribute('data-tab-key') === hash);
    if (hashTab) {
      activateTab(hashTab);
      return true;
    }
    return false;
  }

  // Click handler
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });
  });

  // Arrow key navigation
  tabs.forEach((tab, i) => {
    tab.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') {
        target = tabs[(i + 1) % tabs.length];
      } else if (e.key === 'ArrowLeft') {
        target = tabs[(i - 1 + tabs.length) % tabs.length];
      }
      if (target) {
        e.preventDefault();
        target.focus();
        activateTab(target);
      }
    });
  });

  // Listen for hash changes (dropdown nav links while already on the page)
  window.addEventListener('hashchange', () => {
    const scrollY = window.scrollY;
    activateFromHash();
    // Prevent any scroll caused by hash change
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  });

  // Initial activation from hash or default
  if (!activateFromHash()) {
    const activeTab = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    activateTab(activeTab);
  }
}
