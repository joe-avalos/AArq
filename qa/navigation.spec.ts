import { test, expect } from './fixtures';

test.describe('Navigation & Hamburger Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all nav links navigate correctly', async ({ page, isMobile }) => {
    const links = [
      { text: 'PROJECTS', url: '/projects/' },
      { text: 'SERVICES', url: '/services/' },
      { text: 'CONTACT', url: '/contact/' },
    ];

    for (const link of links) {
      await page.goto('/');

      if (isMobile) {
        await page.locator('.hamburger').click();
        await page.waitForTimeout(200);
      }

      await page.locator(`.nav-list a:has-text("${link.text}")`).first().click();
      await page.waitForURL(`**${link.url}`);
      expect(page.url()).toContain(link.url);
    }
  });

  test('hamburger menu opens and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Hamburger only on mobile');

    const hamburger = page.locator('.hamburger');

    // Initially closed
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');

    // Open
    await hamburger.click({ force: true });
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true', { timeout: 2000 });

    // Close — wait for expanded state to be stable before clicking again
    await page.waitForTimeout(300);
    await hamburger.evaluate((el) => el.click());
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false', { timeout: 2000 });
  });

  test('rapid hamburger open/close (20x)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Hamburger only on mobile');

    const hamburger = page.locator('.hamburger');
    for (let i = 0; i < 20; i++) {
      await hamburger.evaluate((el) => el.click());
      await page.waitForTimeout(150);
    }

    // 20 clicks = even = closed
    await page.waitForTimeout(300);
    await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  test('hamburger menu closes on link click', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Hamburger only on mobile');

    await page.locator('.hamburger').click();
    await page.waitForTimeout(200);

    // Click a nav link
    await page.locator('.nav-list a:has-text("PROJECTS")').first().click();
    await page.waitForURL('**/projects/');

    // Menu should be closed on new page
    await expect(page.locator('.hamburger')).toHaveAttribute('aria-expanded', 'false');
  });

  test('dropdown sub-items visible in mobile menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile menu only');

    await page.locator('.hamburger').click();
    await page.waitForTimeout(200);

    // Services sub-items
    await expect(page.locator('.nav-list .dropdown a:has-text("DESIGN")').first()).toBeVisible();
    await expect(page.locator('.nav-list .dropdown a:has-text("CONSTRUCTION")').first()).toBeVisible();

    // About sub-items
    await expect(page.locator('.nav-list .dropdown a:has-text("HISTORY")').first()).toBeVisible();
    await expect(page.locator('.nav-list .dropdown a:has-text("MISSION")').first()).toBeVisible();
  });
});

test.describe('Mobile menu — toggle button colors', () => {
  const getButtonColor = (page: any, selector: string) =>
    page.evaluate((sel: string) => getComputedStyle(document.querySelector(sel)!).color, selector);

  test('homepage: toggles are white when menu closed, theme-aware when open', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only');
    await page.goto('/');
    await page.waitForTimeout(300);

    // Menu closed — buttons should be white (over hero image)
    const closedColor = await getButtonColor(page, '.theme-toggle');
    // White-ish: rgba(255,255,255,0.9) computes to rgb(255,255,255) or similar
    const r = parseInt(closedColor.match(/\d+/g)![0]);
    expect(r).toBeGreaterThan(200); // white range

    // Open menu
    await page.locator('.hamburger').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(400);

    // Menu open — buttons should be theme-aware (not white)
    const openColor = await getButtonColor(page, '.theme-toggle');
    expect(openColor).not.toBe(closedColor);

    // Toggle theme with menu open — color should change (theme-aware)
    const colorBefore = openColor;
    await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);
    const colorAfter = await getButtonColor(page, '.theme-toggle');
    expect(colorAfter).not.toBe(colorBefore);
  });

  const OTHER_PAGES = ['/about/', '/projects/', '/services/', '/contact/'];

  for (const path of OTHER_PAGES) {
    test(`${path}: toggle colors change with theme when menu open`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Mobile only');
      await page.goto(path);

      // Open menu
      await page.locator('.hamburger').evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(400);

      // Get color before theme toggle
      const colorBefore = await getButtonColor(page, '.theme-toggle');

      // Toggle theme
      await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(300);

      const colorAfter = await getButtonColor(page, '.theme-toggle');
      // Color should change because these pages use theme-aware colors
      expect(colorAfter).not.toBe(colorBefore);
    });
  }
});

test.describe('Desktop keyboard navigation', () => {
  test('dropdown opens with ArrowDown from parent link', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only');
    await page.goto('/');

    // Focus the Services link
    const servicesLink = page.locator('.has-dropdown > a:has-text("SERVICES")').first();
    await servicesLink.focus();
    await page.keyboard.press('ArrowDown');

    // First dropdown link should be focused
    const firstDropdownLink = page.locator('.has-dropdown:has(> a:has-text("SERVICES")) .dropdown a').first();
    await expect(firstDropdownLink).toBeFocused();
  });

  test('Escape closes dropdown and returns focus', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop only');
    await page.goto('/');

    const servicesLink = page.locator('.has-dropdown > a:has-text("SERVICES")').first();
    await servicesLink.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');

    await expect(servicesLink).toBeFocused();
  });
});
