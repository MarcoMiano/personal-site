import { expect, test } from '@playwright/test';
import { bootSessionKey } from '../../src/lib/interactions';

test('keeps the first-session treatment non-blocking and non-repeating', async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/en/');

  const panel = page.locator('[data-boot-panel]');
  const skip = panel.getByRole('button', { name: 'Skip' });
  const narrative = page.locator('.lede [data-content-effect-visual]');
  const projects = page.getByRole('link', { name: 'Projects', exact: true });
  await expect(panel).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Systems, signals, and software.',
    }),
  ).toBeVisible();
  await expect(skip).toBeVisible();

  await projects.focus();
  await expect(projects).toBeFocused();
  await skip.dispatchEvent('click');
  await expect(panel).toBeHidden();
  await expect(narrative).toHaveText(
    'I build and maintain technical tools across software, hardware, AV automation, and infrastructure.',
  );
  await expect
    .poll(() =>
      page.evaluate((key) => sessionStorage.getItem(key), bootSessionKey),
    )
    .toBe('true');

  await page.reload();
  await expect(panel).toBeHidden();
  await context.close();
});

test('suppresses first-session effects when reduced motion is requested', async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('[data-boot-panel]')).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-first-session-effect',
  );
  await expect(page.locator('[data-entry-effect]')).toHaveText(
    'entry: /it/home',
  );
  await expect(page.locator('.lede [data-content-effect-visual]')).toHaveText(
    'Costruisco e mantengo strumenti tecnici tra software, hardware, automazione AV e infrastrutture.',
  );
  await context.close();
});

test('suppresses first-session effects when increased contrast is requested', async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.emulateMedia({ contrast: 'more' });
  await page.goto('/en/');

  await expect(page.locator('[data-boot-panel]')).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-first-session-effect',
  );
  await expect(page.locator('[data-entry-effect]')).toHaveText(
    'entry: /en/home',
  );
  await expect(page.locator('.lede [data-content-effect-visual]')).toHaveText(
    'I build and maintain technical tools across software, hardware, AV automation, and infrastructure.',
  );
  await context.close();
});

test('finishes automatically after the four-second treatment', async ({
  page,
}) => {
  await page.goto('/en/');
  const panel = page.locator('[data-boot-panel]');
  await expect(panel).toBeVisible();
  await expect(panel.locator('[data-boot-line]:not([hidden])')).toHaveCount(5, {
    timeout: 3_200,
  });
  await expect(panel).toBeHidden({ timeout: 4_500 });
  await expect(page.locator('.lede [data-content-effect-visual]')).toHaveText(
    'I build and maintain technical tools across software, hardware, AV automation, and infrastructure.',
  );
});
