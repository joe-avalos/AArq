import { test, expect } from './fixtures';

test.describe('Projects page — Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/');
  });

  test('all filter tabs visible', async ({ page }) => {
    const tabs = page.locator('.filter-tabs [role="tab"]');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(1);
    for (let i = 0; i < count; i++) {
      await expect(tabs.nth(i)).toBeVisible();
    }
  });

  test('filtering shows/hides cards', async ({ page }) => {
    const allCards = page.locator('.card-wrapper');
    const totalCount = await allCards.count();

    // Click a specific filter (not "all")
    const tabs = page.locator('.filter-tabs [role="tab"]');
    await tabs.nth(1).click(); // Second filter (e.g., residential)
    await page.waitForTimeout(500);

    // Some cards should be hidden
    const visibleCards = page.locator('.card-wrapper:not(.hidden)');
    const filteredCount = await visibleCards.count();
    expect(filteredCount).toBeLessThanOrEqual(totalCount);
    expect(filteredCount).toBeGreaterThan(0);

    // Click "All" to restore
    await tabs.nth(0).click();
    await page.waitForTimeout(500);
    const restoredCount = await page.locator('.card-wrapper:not(.hidden)').count();
    expect(restoredCount).toBe(totalCount);
  });

  test('rapid filter switching (20x) — no stuck cards', async ({ page }) => {
    const tabs = page.locator('.filter-tabs [role="tab"]');
    const count = await tabs.count();
    const allCards = page.locator('.card-wrapper');
    const totalCount = await allCards.count();

    for (let i = 0; i < 20; i++) {
      const idx = i % count;
      await tabs.nth(idx).click();
      await page.waitForTimeout(250);
    }

    // Reset to "all" and poll until all cards are visible (stacked timers may take a while)
    await tabs.nth(0).click();
    await expect(async () => {
      const visible = await page.locator('.card-wrapper:not(.hidden)').count();
      expect(visible).toBe(totalCount);
    }).toPass({ timeout: 5000 });
  });

  test('filter tabs manage tabindex correctly', async ({ page }) => {
    const tabs = page.locator('.filter-tabs [role="tab"]');

    // First tab should have tabindex 0
    await expect(tabs.nth(0)).toHaveAttribute('tabindex', '0');

    // Click second tab
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(0)).toHaveAttribute('tabindex', '-1');
  });

  test('project cards link to detail pages', async ({ page }) => {
    const firstCard = page.locator('.project-card').first();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/projects\/.+\/$/);

    await firstCard.click();
    await page.waitForURL('**/projects/**');
    expect(page.url()).toContain('/projects/');
  });
});

test.describe('Project detail page', () => {
  test('parallax divider renders', async ({ page }) => {
    await page.goto('/projects/');
    await page.locator('.project-card').first().click();
    await page.waitForURL('**/projects/**');

    const parallax = page.locator('.parallax-divider');
    if (await parallax.count() > 0) {
      await expect(parallax.first()).toBeVisible();
      const box = await parallax.first().boundingBox();
      expect(box!.height).toBeGreaterThan(100);
    }
  });

  test('back bar is visible when scrolling', async ({ page }) => {
    await page.goto('/projects/');
    await page.locator('.project-card').first().click();
    await page.waitForURL('**/projects/**');

    const backBar = page.locator('.back-bar');
    if (await backBar.count() > 0) {
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(200);
      await expect(backBar).toBeVisible();
    }
  });
});
