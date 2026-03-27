import { test as base } from '@playwright/test';

/**
 * Extended test fixture that hides the Astro dev toolbar
 * which intercepts pointer events on elements near the bottom of the viewport.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Inject CSS to hide Astro dev toolbar on every navigation
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = 'astro-dev-toolbar { display: none !important; }';
      (document.head || document.documentElement).appendChild(style);
    });
    await use(page);
  },
});

export { expect } from '@playwright/test';
