/**
 * initFilter — vanilla JS filter with width-collapse transition.
 *
 * Expects container to have:
 *   .filter-tabs [role="tab"]   — filter buttons with data-filter attribute
 *   .card-wrapper               — filterable wrappers with data-category attribute
 */
export function initFilter(container) {
  const tabs = Array.from(container.querySelectorAll('.filter-tabs [role="tab"]'));
  const wrappers = Array.from(container.querySelectorAll('.card-wrapper'));

  if (tabs.length === 0 || wrappers.length === 0) return;

  const TRANSITION_MS = 400;

  function filterCards(value) {
    const toShow = [];
    const toHide = [];

    wrappers.forEach((wrapper) => {
      const match = value === 'all' || wrapper.dataset.category === value;
      if (match) toShow.push(wrapper);
      else toHide.push(wrapper);
    });

    // Phase 1: collapse width of non-matching cards
    toHide.forEach((wrapper) => {
      if (!wrapper.classList.contains('hidden')) {
        wrapper.classList.add('hiding');
      }
    });

    // Show matching cards: unhide at width:0, then expand
    toShow.forEach((wrapper) => {
      if (wrapper.classList.contains('hidden')) {
        // Start collapsed: remove display:none but keep at width:0
        wrapper.classList.add('hiding');
        wrapper.classList.remove('hidden');
        // Force reflow so browser paints at width:0 first
        void wrapper.offsetWidth;
      }
      // Now remove hiding — triggers width transition from 0 to full
      wrapper.classList.remove('hiding');
    });

    // Phase 2: after width collapse completes, set display:none
    setTimeout(() => {
      toHide.forEach((wrapper) => {
        wrapper.classList.add('hidden');
        wrapper.classList.remove('hiding');
      });
    }, TRANSITION_MS);
  }

  function selectTab(tab) {
    tabs.forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    filterCards(tab.dataset.filter);
  }

  // Set initial tabindex state
  tabs.forEach((t, i) => {
    t.setAttribute('tabindex', i === 0 ? '0' : '-1');
  });

  // Click handler
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectTab(tab));
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
        selectTab(target);
      }
    });
  });
}
