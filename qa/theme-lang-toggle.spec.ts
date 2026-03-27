import { test, expect } from './fixtures';

const PAGES = ['/', '/about/', '/projects/', '/services/', '/contact/'];

for (const path of PAGES) {
  test.describe(`Theme & Language toggle on ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('theme toggle switches dark/light', async ({ page }) => {
      const toggle = page.locator('.theme-toggle');
      await expect(toggle).toBeVisible();

      // Get initial theme
      const initial = await page.locator('html').getAttribute('data-theme');

      // Toggle
      await toggle.click();
      const after = await page.locator('html').getAttribute('data-theme');
      expect(after).not.toEqual(initial);

      // Toggle back
      await toggle.click();
      const restored = await page.locator('html').getAttribute('data-theme');
      expect(restored).toEqual(initial);
    });

    test('rapid theme toggling (20x) does not break layout', async ({ page }) => {
      const toggle = page.locator('.theme-toggle');
      for (let i = 0; i < 20; i++) {
        await toggle.click();
        await page.waitForTimeout(50);
      }
      // Page should still be functional
      await expect(page.locator('body')).toBeVisible();
      // No horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()!.width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });

    test('language toggle switches EN/ES', async ({ page }) => {
      const toggle = page.locator('.lang-toggle');
      await expect(toggle).toBeVisible();

      const initialLang = await page.locator('html').getAttribute('lang');

      await toggle.click();
      const newLang = await page.locator('html').getAttribute('lang');
      expect(newLang).not.toEqual(initialLang);

      // Toggle back
      await toggle.click();
      const restored = await page.locator('html').getAttribute('lang');
      expect(restored).toEqual(initialLang);
    });

    test('rapid language toggling (20x) does not break layout', async ({ page }) => {
      const toggle = page.locator('.lang-toggle');
      for (let i = 0; i < 20; i++) {
        await toggle.click();
        await page.waitForTimeout(50);
      }
      await expect(page.locator('body')).toBeVisible();
    });

    test('theme persists after navigation', async ({ page }) => {
      // Set dark theme
      await page.evaluate(() => {
        localStorage.setItem('theme', 'dark');
        document.documentElement.dataset.theme = 'dark';
      });

      // Navigate to another page
      const otherPage = path === '/' ? '/about/' : '/';
      await page.goto(otherPage);

      const theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('dark');
    });
  });
}
