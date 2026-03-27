import { test, expect } from './fixtures';

test.describe('Mobile lightbox', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a project detail with gallery images
    await page.goto('/projects/');
    await page.locator('.project-card').first().click();
    await page.waitForURL('**/projects/**');
  });

  test('tap image opens lightbox on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Lightbox is mobile-only');

    const galleryImg = page.locator('.project-gallery img').first();
    if (await galleryImg.count() === 0) return;

    await galleryImg.scrollIntoViewIfNeeded();
    await galleryImg.click();
    await page.waitForTimeout(300);

    const overlay = page.locator('.lightbox-overlay:not([hidden])');
    await expect(overlay).toBeVisible();
  });

  test('close button closes lightbox', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Lightbox is mobile-only');

    const galleryImg = page.locator('.project-gallery img').first();
    if (await galleryImg.count() === 0) return;

    await galleryImg.scrollIntoViewIfNeeded();
    await galleryImg.click();
    await page.waitForTimeout(300);

    const closeBtn = page.locator('.lightbox-close');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await page.waitForTimeout(300);

    const overlay = page.locator('.lightbox-overlay');
    await expect(overlay).toBeHidden();
  });

  test('escape key closes lightbox', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Lightbox is mobile-only');

    const galleryImg = page.locator('.project-gallery img').first();
    if (await galleryImg.count() === 0) return;

    await galleryImg.scrollIntoViewIfNeeded();
    await galleryImg.click();
    await page.waitForTimeout(300);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await expect(page.locator('.lightbox-overlay')).toBeHidden();
  });

  test('scroll position preserved after lightbox close', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Lightbox is mobile-only');

    const galleryImg = page.locator('.project-gallery img').first();
    if (await galleryImg.count() === 0) return;

    await galleryImg.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);

    const scrollBefore = await page.evaluate(() => window.scrollY);

    await galleryImg.click();
    await page.waitForTimeout(300);
    await page.locator('.lightbox-close').click();
    await page.waitForTimeout(300);

    const scrollAfter = await page.evaluate(() => window.scrollY);
    // Allow some tolerance — mobile browsers may adjust scroll on position:fixed toggle
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(400);
  });

  test('rapid open/close (10x) does not break scroll', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Lightbox is mobile-only');

    const galleryImg = page.locator('.project-gallery img').first();
    if (await galleryImg.count() === 0) return;

    await galleryImg.scrollIntoViewIfNeeded();

    for (let i = 0; i < 10; i++) {
      await galleryImg.click({ force: true });
      await page.waitForTimeout(300);
      const closeBtn = page.locator('.lightbox-close');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // Body should not be stuck in fixed position
    const bodyPosition = await page.evaluate(() => document.body.style.position);
    expect(bodyPosition).toBe('');
  });
});
