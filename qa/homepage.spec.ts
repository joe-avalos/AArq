import { test, expect } from './fixtures';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for carousel JS to initialize
    await page.waitForSelector('.carousel-dots button');
  });

  test('hero carousel loads and fills viewport', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();
    const box = await hero.boundingBox();
    const viewport = page.viewportSize()!;
    expect(box!.height).toBeGreaterThan(viewport.height * 0.9);
  });

  test('carousel dots are interactive', async ({ page }) => {
    // Pause autoplay by focusing the carousel
    await page.locator('.carousel').first().dispatchEvent('mouseenter');
    await page.waitForTimeout(200);

    const dots = page.locator('.carousel-dots button');
    const count = await dots.count();
    expect(count).toBeGreaterThan(1);

    // Click third dot via JS to bypass any overlay
    const targetIdx = 2;
    await dots.nth(targetIdx).evaluate((el) => el.click());
    // Wait for scroll-snap to settle
    await expect(dots.nth(targetIdx)).toHaveAttribute('aria-selected', 'true', { timeout: 3000 });
  });

  test('carousel prev/next buttons work', async ({ page }) => {
    // Pause autoplay
    await page.locator('.carousel').first().dispatchEvent('mouseenter');
    await page.waitForTimeout(200);

    const dots = page.locator('.carousel-dots button');
    // Go to first slide
    await dots.nth(0).click({ force: true });
    await page.waitForTimeout(800);

    await page.locator('.carousel-next').click({ force: true });
    await page.waitForTimeout(800);
    await expect(dots.nth(1)).toHaveAttribute('aria-selected', 'true');

    await page.locator('.carousel-prev').click({ force: true });
    await page.waitForTimeout(800);
    await expect(dots.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('carousel prev/next have accessible labels', async ({ page }) => {
    const prev = page.locator('.carousel-prev');
    const next = page.locator('.carousel-next');
    const prevLabel = await prev.getAttribute('aria-label');
    const nextLabel = await next.getAttribute('aria-label');
    expect(prevLabel).toBeTruthy();
    expect(prevLabel!.length).toBeGreaterThan(0);
    expect(nextLabel).toBeTruthy();
    expect(nextLabel!.length).toBeGreaterThan(0);
  });

  test('h1 exists on homepage', async ({ page }) => {
    // Exclude Astro dev toolbar h1s
    const count = await page.evaluate(() =>
      document.querySelectorAll('h1:not(astro-dev-toolbar h1)').length
    );
    expect(count).toBe(1);
    const text = await page.evaluate(() => {
      const h1 = document.querySelector('h1:not(astro-dev-toolbar h1)');
      return h1?.textContent?.trim() ?? '';
    });
    expect(text.length).toBeGreaterThan(0);
  });

  test('no vertical scroll on homepage', async ({ page }) => {
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
    expect(scrollHeight).toBeLessThanOrEqual(clientHeight + 1);
  });

  test('no horizontal scroll on homepage', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
