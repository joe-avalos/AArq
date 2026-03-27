import { test, expect } from './fixtures';

test.describe('Services page — Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services/');
  });

  test('all service tabs visible', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('switching tabs shows correct content', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(200);
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');

      const panelId = await tabs.nth(i).getAttribute('aria-controls');
      if (panelId) {
        const panel = page.locator(`#${panelId}`);
        await expect(panel).toBeVisible();
      }
    }
  });

  test('rapid tab switching (20x)', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    const count = await tabs.count();

    for (let i = 0; i < 20; i++) {
      await tabs.nth(i % count).click();
      await page.waitForTimeout(80);
    }

    // Tabs still functional
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('service images load', async ({ page }) => {
    const tabs = page.locator('.tab-list .tab-button');
    const count = await tabs.count();

    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(300);

      const panelId = await tabs.nth(i).getAttribute('aria-controls');
      if (panelId) {
        const images = page.locator(`#${panelId} img`);
        const imgCount = await images.count();
        for (let j = 0; j < imgCount; j++) {
          const naturalWidth = await images.nth(j).evaluate(
            (img: HTMLImageElement) => img.naturalWidth
          );
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    }
  });
});
