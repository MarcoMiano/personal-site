import { expect, test } from '@playwright/test';
import { bootSessionKey } from '../../src/lib/interactions';

test('adds an animated underscore caret without changing the page heading', async ({
  page,
}) => {
  await page.goto('/en/cv/');
  const heading = page.getByRole('heading', {
    level: 1,
    name: 'Curriculum vitae',
  });

  await expect(heading).toHaveCount(1);
  const cursor = await heading.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return {
      animationName: style.animationName,
      borderStyle: style.borderStyle,
      color: style.color,
      content: style.content,
      fontWeight: style.fontWeight,
      titleColor: getComputedStyle(element).color,
    };
  });
  expect(cursor).toEqual({
    animationName: 'page-title-caret',
    borderStyle: 'none',
    color: cursor.titleColor,
    content: '"_"',
    fontWeight: '400',
    titleColor: cursor.titleColor,
  });
});

test('keeps the first-session treatment non-blocking and non-repeating', async ({
  browser,
}) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/en/');

  const panel = page.locator('[data-boot-panel]');
  const heading = page.getByRole('heading', {
    level: 1,
    name: 'Systems, signals, and software.',
  });
  const skip = panel.getByRole('button', { name: 'Skip' });
  const narrative = page.locator('.lede [data-content-effect-visual]');
  const projects = page.getByRole('link', { name: 'Projects', exact: true });
  await expect(panel).toBeVisible();
  await expect(heading).toBeVisible();
  await expect(heading).not.toHaveText('Systems, signals, and software.');
  await expect.poll(() => heading.textContent()).toMatch(/^S/);
  await expect(skip).toBeVisible();

  await projects.focus();
  await expect(projects).toBeFocused();
  await skip.dispatchEvent('click');
  await expect(panel).toBeHidden();
  await expect
    .poll(() =>
      heading.evaluate((element) => ({
        caret: getComputedStyle(element, '::after').animationName,
        title: element.textContent,
      })),
    )
    .toEqual({
      caret: 'page-title-caret',
      title: 'Systems, signals, and software.',
    });
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
  await expect
    .poll(() =>
      heading.evaluate(
        (element) => getComputedStyle(element, '::after').animationName,
      ),
    )
    .toBe('page-title-caret');
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
  await expect
    .poll(() =>
      page
        .locator('[data-page-title]')
        .evaluate(
          (heading) => getComputedStyle(heading, '::after').animationName,
        ),
    )
    .toBe('none');
  await expect(page.locator('[data-page-title]')).toHaveText(
    'Sistemi, segnali e software.',
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
  await expect
    .poll(() =>
      page
        .locator('[data-page-title]')
        .evaluate(
          (heading) => getComputedStyle(heading, '::after').animationName,
        ),
    )
    .toBe('none');
  await expect(page.locator('[data-page-title]')).toHaveText(
    'Systems, signals, and software.',
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
  await expect
    .poll(() =>
      page.locator('[data-page-title]').evaluate((element) => ({
        caret: getComputedStyle(element, '::after').animationName,
        title: element.textContent,
      })),
    )
    .toEqual({
      caret: 'page-title-caret',
      title: 'Systems, signals, and software.',
    });
  await expect(page.locator('.lede [data-content-effect-visual]')).toHaveText(
    'I build and maintain technical tools across software, hardware, AV automation, and infrastructure.',
  );
});
