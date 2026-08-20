import { expect, test } from '@playwright/test';
import { listedPageKeys } from '../../src/lib/site';

test('opens, filters, and closes the command palette with focus restoration', async ({
  page,
}) => {
  await page.goto('/en/');
  const openButton = page.getByRole('button', { name: 'Commands' });
  const palette = page.locator('[data-command-palette]');
  const filter = page.getByRole('searchbox', { name: 'Filter destinations' });

  await openButton.click();
  await expect(palette).toBeVisible();
  await expect(filter).toBeFocused();
  await expect(palette.locator('[data-command-link]')).toHaveCount(
    listedPageKeys.length,
  );

  await filter.fill('privacy');
  await expect(
    palette.locator('[data-command-item]:not([hidden])'),
  ).toHaveCount(1);
  await expect(palette.getByRole('link', { name: /Privacy/ })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(palette).not.toBeVisible();
  await expect(openButton).toBeFocused();
});

test('supports nano-like palette and theme shortcuts outside editing fields', async ({
  page,
}) => {
  await page.goto('/en/');

  await page.keyboard.press('Alt+p');
  const palette = page.locator('[data-command-palette]');
  const filter = page.getByRole('searchbox', { name: 'Filter destinations' });
  await expect(palette).toBeVisible();

  await page.keyboard.press('Alt+t');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme');

  await page.keyboard.press('Escape');
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('Alt+t');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.keyboard.press('Alt+p');
  await expect(filter).toBeFocused();
  await filter.fill('?');
  await expect(page.locator('[data-shortcut-help]')).not.toBeVisible();
});

test('documents shortcuts in an accessible help dialog', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Alt+h');
  const help = page.locator('[data-shortcut-help]');
  await expect(help).toBeVisible();
  await expect(
    help.getByRole('heading', { name: 'Scorciatoie da tastiera' }),
  ).toBeVisible();

  for (const shortcut of ['Alt+P', 'Alt+T', 'Alt+H', 'Esc']) {
    await expect(help.getByText(shortcut, { exact: true })).toBeVisible();
  }

  await page.keyboard.press('Escape');
  await expect(help).not.toBeVisible();
});

test('moves from the filter into visible commands with arrow keys', async ({
  page,
}) => {
  await page.goto('/en/');
  await page.keyboard.press('Alt+p');
  const filter = page.getByRole('searchbox', { name: 'Filter destinations' });
  await filter.fill('projects');
  await filter.press('ArrowDown');

  await expect(
    page
      .locator('[data-command-palette]')
      .getByRole('link', { name: /Projects/ }),
  ).toBeFocused();
});

test('keeps the command palette usable on a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/en/');
  await page.keyboard.press('Alt+p');

  const palette = page.locator('[data-command-palette]');
  const filter = page.getByRole('searchbox', { name: 'Filter destinations' });
  await expect(palette).toBeVisible();
  await expect(filter).toBeVisible();
  await expect
    .poll(() =>
      filter.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).fontSize),
      ),
    )
    .toBeGreaterThanOrEqual(16);
  await expect
    .poll(() =>
      palette.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= window.innerWidth;
      }),
    )
    .toBe(true);
});

test('reveals the legacy handle only for its exact palette query', async ({
  page,
}) => {
  await page.goto('/en/');
  await page.keyboard.press('Alt+p');
  const filter = page.getByRole('searchbox', { name: 'Filter destinations' });
  const legacy = page.locator('[data-legacy-command]');

  await expect(legacy).toBeHidden();
  await filter.fill('ev3r');
  await expect(legacy).toBeVisible();
  await expect(legacy).toContainText('legacy_handle = "Ev3r";');

  await filter.clear();
  await expect(legacy).toBeHidden();
});

test('closes a dialog without also dismissing the first-session panel', async ({
  page,
}) => {
  await page.goto('/en/');
  const panel = page.locator('[data-boot-panel]');
  const palette = page.locator('[data-command-palette]');

  await expect(panel).toBeVisible();
  await page.keyboard.press('Alt+p');
  await expect(palette).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(palette).toBeHidden();
  await expect(panel).toBeVisible();
});
