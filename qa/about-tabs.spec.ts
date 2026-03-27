import { test, expect } from './fixtures';

test.describe('About page — Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about/');
  });

  test('all 4 tabs are visible', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    await expect(tabs).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('clicking each tab shows its panel', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
      const panelId = await tabs.nth(i).getAttribute('aria-controls');
      const panel = page.locator(`#${panelId}`);
      await expect(panel).toBeVisible();
    }
  });

  test('rapid tab switching (30x) — tabs remain visible', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    const count = await tabs.count();

    for (let i = 0; i < 30; i++) {
      const idx = i % count;
      await tabs.nth(idx).click();
      await page.waitForTimeout(100);
    }

    // All tabs should still be visible
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('scroll down in philosophy, switch to history — tabs visible', async ({ page }) => {
    // Go to philosophy tab
    const philTab = page.locator('.tab-button:has-text("Philosophy"), .tab-button:has-text("PHILOSOPHY")');
    await philTab.click();
    await page.waitForTimeout(300);

    // Scroll down to testimonials
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Switch to history tab
    const histTab = page.locator('.tab-button:has-text("History"), .tab-button:has-text("HISTORY")');
    await histTab.click();
    await page.waitForTimeout(300);

    // Tabs should still be visible
    const tabs = page.locator('.tab-list .tab-button');
    for (let i = 0; i < await tabs.count(); i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('testimonial carousel dots do NOT break page tabs', async ({ page }) => {
    // Go to philosophy tab
    const philTab = page.locator('.tab-button:has-text("Philosophy"), .tab-button:has-text("PHILOSOPHY")');
    await philTab.click();
    await page.waitForTimeout(300);

    // Find testimonial dots
    const testimDots = page.locator('.testimonials-section .carousel-dots button');
    const dotCount = await testimDots.count();

    if (dotCount > 1) {
      // Click each testimonial dot
      for (let i = 0; i < dotCount; i++) {
        await testimDots.nth(i).click();
        await page.waitForTimeout(300);
      }
    }

    // Now switch to a page tab — content should be visible
    const histTab = page.locator('.tab-button:has-text("History"), .tab-button:has-text("HISTORY")');
    await histTab.click();
    await page.waitForTimeout(300);

    // History panel should be visible
    const panel = page.locator('#panel-history');
    await expect(panel).toBeVisible();

    // Tabs should still be visible
    const pageTabs = page.locator('.tab-list .tab-button');
    for (let i = 0; i < await pageTabs.count(); i++) {
      await expect(pageTabs.nth(i)).toBeVisible();
    }
  });

  test('testimonial dots update correctly', async ({ page }) => {
    const philTab = page.locator('.tab-button:has-text("Philosophy"), .tab-button:has-text("PHILOSOPHY")');
    await philTab.click();
    await page.waitForTimeout(300);

    const dots = page.locator('.testimonials-section .carousel-dots button');
    const count = await dots.count();
    if (count < 2) return;

    await dots.nth(1).click();
    await page.waitForTimeout(500);
    await expect(dots.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('testimonial text does not overlap with dots', async ({ page }) => {
    const philTab = page.locator('.tab-button:has-text("Philosophy"), .tab-button:has-text("PHILOSOPHY")');
    await philTab.click();
    await page.waitForTimeout(300);

    const dots = page.locator('.testimonials-section .carousel-dots');
    const slide = page.locator('.testimonials-section .testimonial-slide').first();

    if (await dots.isVisible() && await slide.isVisible()) {
      const dotsBox = await dots.boundingBox();
      const quote = page.locator('.testimonials-section .testimonial-quote').first();
      const quoteBox = await quote.boundingBox();

      if (dotsBox && quoteBox) {
        // Bottom of quote text should be above top of dots
        expect(quoteBox.y + quoteBox.height).toBeLessThanOrEqual(dotsBox.y + 5);
      }
    }
  });
});
