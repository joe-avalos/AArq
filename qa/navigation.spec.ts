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

  const assertWhite = (color: string, label: string) => {
    const r = parseInt(color.match(/\d+/g)![0]);
    expect(r, `${label} should be white (r=${r})`).toBeGreaterThan(200);
  };

  const getHamburgerColor = (page: any) =>
    page.evaluate(() => getComputedStyle(document.querySelector('.hamburger-line')!).backgroundColor);

  test('homepage: all navbar buttons stay white regardless of theme, language, or menu state', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only');
    await page.goto('/');
    await page.waitForTimeout(300);

    // Menu closed — all buttons white
    assertWhite(await getButtonColor(page, '.theme-toggle'), 'theme-toggle (closed, initial)');
    assertWhite(await getButtonColor(page, '.lang-toggle'), 'lang-toggle (closed, initial)');
    assertWhite(await getHamburgerColor(page), 'hamburger (closed, initial)');

    // Toggle theme with menu closed — still white
    await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);
    assertWhite(await getButtonColor(page, '.theme-toggle'), 'theme-toggle (closed, after theme toggle)');
    assertWhite(await getButtonColor(page, '.lang-toggle'), 'lang-toggle (closed, after theme toggle)');
    assertWhite(await getHamburgerColor(page), 'hamburger (closed, after theme toggle)');

    // Open menu — still white
    await page.locator('.hamburger').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(400);
    assertWhite(await getButtonColor(page, '.theme-toggle'), 'theme-toggle (open)');
    assertWhite(await getButtonColor(page, '.lang-toggle'), 'lang-toggle (open)');
    assertWhite(await getHamburgerColor(page), 'hamburger (open)');

    // Toggle theme with menu open — still white
    await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);
    assertWhite(await getButtonColor(page, '.theme-toggle'), 'theme-toggle (open, after theme toggle)');
    assertWhite(await getButtonColor(page, '.lang-toggle'), 'lang-toggle (open, after theme toggle)');
    assertWhite(await getHamburgerColor(page), 'hamburger (open, after theme toggle)');

    // Toggle language — still white
    await page.locator('.lang-toggle').evaluate((el: HTMLElement) => el.click());
    await page.waitForTimeout(300);
    assertWhite(await getButtonColor(page, '.theme-toggle'), 'theme-toggle (open, after lang toggle)');
    assertWhite(await getButtonColor(page, '.lang-toggle'), 'lang-toggle (open, after lang toggle)');
    assertWhite(await getHamburgerColor(page), 'hamburger (open, after lang toggle)');
  });

  const OTHER_PAGES = ['/about/', '/projects/', '/services/', '/contact/'];

  for (const path of OTHER_PAGES) {
    test(`${path}: toggle colors change with theme regardless of menu state`, async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Mobile only');
      await page.goto(path);
      await page.waitForTimeout(300);

      // Menu closed — toggle theme, color should change
      const closedBefore = await getButtonColor(page, '.theme-toggle');
      await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(300);
      const closedAfter = await getButtonColor(page, '.theme-toggle');
      expect(closedAfter, 'menu closed: color should change with theme').not.toBe(closedBefore);

      // Toggle back
      await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(300);

      // Menu open — toggle theme, color should change
      await page.locator('.hamburger').evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(400);
      const openBefore = await getButtonColor(page, '.theme-toggle');
      await page.locator('.theme-toggle').evaluate((el: HTMLElement) => el.click());
      await page.waitForTimeout(300);
      const openAfter = await getButtonColor(page, '.theme-toggle');
      expect(openAfter, 'menu open: color should change with theme').not.toBe(openBefore);
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
