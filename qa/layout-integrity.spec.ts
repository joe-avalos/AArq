import { test, expect } from './fixtures';

const PAGES = ['/', '/about/', '/projects/', '/services/', '/contact/'];

for (const path of PAGES) {
  test.describe(`Layout integrity: ${path}`, () => {
    test('no horizontal overflow', async ({ page }) => {
      await page.goto(path);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test('no horizontal scroll after scrolling full page', async ({ page }) => {
      await page.goto(path);
      // Scroll to bottom and back
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test('header is visible and fixed at top', async ({ page }) => {
      await page.goto(path);
      const header = page.locator('.site-header');
      await expect(header).toBeVisible();

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);

      // Header should still be at top
      const box = await header.boundingBox();
      expect(box!.y).toBeLessThanOrEqual(0);
    });

    test('no FOUC — theme applied before paint', async ({ page, context }) => {
      // Set dark theme via localStorage before navigating
      await page.goto(path);
      await page.evaluate(() => localStorage.setItem('theme', 'dark'));

      // Reload — the FOUC script should read localStorage and apply dark before paint
      await page.reload();
      await page.waitForTimeout(100);

      const theme = await page.locator('html').getAttribute('data-theme');
      expect(theme).toBe('dark');

      // Clean up
      await page.evaluate(() => localStorage.removeItem('theme'));
    });

    test('both themes render without contrast issues', async ({ page }) => {
      await page.goto(path);

      // Light theme
      await page.evaluate(() => {
        delete document.documentElement.dataset.theme;
      });
      await page.waitForTimeout(100);

      // Check body text is visible (not same color as bg)
      const lightBg = await page.evaluate(() =>
        getComputedStyle(document.body).backgroundColor
      );
      const lightColor = await page.evaluate(() =>
        getComputedStyle(document.body).color
      );
      expect(lightBg).not.toEqual(lightColor);

      // Dark theme
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'dark';
      });
      await page.waitForTimeout(100);

      const darkBg = await page.evaluate(() =>
        getComputedStyle(document.body).backgroundColor
      );
      const darkColor = await page.evaluate(() =>
        getComputedStyle(document.body).color
      );
      expect(darkBg).not.toEqual(darkColor);
    });

    test('skip nav link exists and works', async ({ page }) => {
      await page.goto(path);
      const skipNav = page.locator('.skip-nav');
      await expect(skipNav).toHaveCount(1);
      const href = await skipNav.getAttribute('href');
      expect(href).toBe('#main-content');
    });

    test('single h1 per page', async ({ page }) => {
      await page.goto(path);
      // Exclude Astro dev toolbar h1 elements — only count page content h1s
      const h1Count = await page.evaluate(() =>
        document.querySelectorAll('h1:not(astro-dev-toolbar h1)').length
      );
      expect(h1Count).toBe(1);
    });

    test('all images have alt attributes', async ({ page }) => {
      await page.goto(path);
      const images = page.locator('img');
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).not.toBeNull();
      }
    });

    test('canonical URL is set', async ({ page }) => {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const href = await canonical.getAttribute('href');
      expect(href).toBeTruthy();
    });

    test('meta description exists', async ({ page }) => {
      await page.goto(path);
      const desc = page.locator('meta[name="description"]');
      await expect(desc).toHaveCount(1);
      const content = await desc.getAttribute('content');
      expect(content!.length).toBeGreaterThan(20);
    });
  });
}
