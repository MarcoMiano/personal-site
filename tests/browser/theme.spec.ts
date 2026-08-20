import { expect, test } from '@playwright/test';
import { themeStorageKey } from '../../src/lib/interactions';

test('uses the operating-system theme when no preference exists', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/en/');

  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  await expect(
    page.getByRole('button', { name: /Theme: auto\. Switch to dark\./ }),
  ).toBeVisible();
  await expect(page.locator('[data-theme-mode-icon="auto"]')).toBeVisible();

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
});

test('cycles and persists explicit theme preferences', async ({ page }) => {
  await page.goto('/en/');
  const control = page.locator('[data-theme-control]');

  await control.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(control).toHaveAttribute('data-theme-mode', 'dark');
  await expect(control.locator('[data-theme-mode-icon="dark"]')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), themeStorageKey),
    )
    .toBe('dark');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(control).toHaveAttribute('data-theme-mode', 'dark');

  await control.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'bright');
  await expect(
    control.locator('[data-theme-mode-icon="bright"]'),
  ).toBeVisible();
  await control.click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), themeStorageKey),
    )
    .toBeNull();
});

test('localizes the accessible control name', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('button', { name: /Tema: auto\. Attiva scuro\./ }),
  ).toBeVisible();
});

test('keeps the enhanced header inside a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/en/');

  await expect(page.locator('[data-site-header]')).toBeVisible();
  await expect(page.locator('[data-theme-control]')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});

test('keeps navigation and system theming usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    colorScheme: 'light',
    javaScriptEnabled: false,
  });
  const page = await context.newPage();

  await page.goto('/en/');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  await expect(page.locator('[data-theme-control]')).toBeHidden();
  await expect(page.locator('[data-shortcut-strip]')).toBeHidden();
  await expect(page.locator('[data-command-palette]')).not.toBeVisible();
  await expect(page.locator('[data-boot-panel]')).toBeHidden();
  await expect(page.locator('[data-entry-effect]')).toHaveText(
    'entry: /en/home',
  );

  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/projects\/$/);

  await context.close();
});
