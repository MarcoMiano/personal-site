import { expect, test } from '@playwright/test';

test('uses the same searchable CV heading in both locales', async ({
  page,
}) => {
  for (const path of ['/cv/', '/en/cv/']) {
    await page.goto(path);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Curriculum vitae' }),
    ).toHaveCount(1);
    await expect(page.locator('h1[data-page-title]')).toHaveText(
      'Curriculum vitae',
    );
  }
});

test('exposes one honest build revision marker in the footer', async ({
  page,
}) => {
  await page.goto('/en/');
  const footer = page.locator('[data-site-footer]');
  const revision = await footer.getAttribute('data-build-revision');

  expect(revision).toMatch(/^(?:LOCAL|[0-9a-f]{40})$/);
  await expect(page.locator('[data-build-revision]')).toHaveCount(1);

  if (revision === 'LOCAL') {
    await expect(footer.locator('.footer-revision')).toHaveText(
      'build.sha = "LOCAL"',
    );
    await expect(footer.locator('.footer-revision a')).toHaveCount(0);
  } else {
    const link = footer.locator('.footer-revision__link');
    const label = `Full source revision: ${revision}`;
    await expect(link).toHaveAttribute(
      'href',
      `https://github.com/MarcoMiano/personal-site/commit/${revision}`,
    );
    await expect(link).toHaveAttribute('aria-label', label);
    await expect(link).toHaveAttribute('title', label);
    await expect(link.locator('[data-brand="github"]')).toHaveCount(1);
    await link.focus();
    await expect(link).toBeFocused();
  }
});

test('keeps the skip link and page landmarks usable from the keyboard', async ({
  page,
}) => {
  await page.goto('/en/cv/');

  const skipLink = page.locator('[data-skip-link]');
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toHaveCount(1);
  await expect(
    page.getByRole('navigation', { name: 'Language selection' }),
  ).toHaveCount(1);
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('contentinfo')).toHaveCount(1);
});

test('keeps the progressive dialogs labelled in the semantic page structure', async ({
  page,
}) => {
  await page.goto('/en/');

  for (const [selector, heading] of [
    ['[data-command-palette]', 'Command palette'],
    ['[data-shortcut-help]', 'Keyboard shortcuts'],
  ]) {
    const dialog = page.locator(selector);
    const labelledBy = await dialog.getAttribute('aria-labelledby');

    expect(labelledBy).not.toBeNull();
    await expect(page.locator(`#${labelledBy}`)).toHaveText(heading);
  }
});

test('keeps a full CV page within a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/en/cv/');

  await expect(page.locator('.cv-overview')).toBeVisible();
  await expect(page.locator('.header-context__tty--mobile')).toBeVisible();
  await expect(page.locator('.header-context__tty--desktop')).toBeHidden();
  await expect
    .poll(() =>
      page.locator('[data-site-header]').evaluate((header) => {
        const bounds = (selector: string) =>
          header.querySelector(selector)?.getBoundingClientRect();
        const context = bounds('.header-context');
        const brand = bounds('.brand');
        const utilities = bounds('.header-utilities');
        const navigation = bounds('.primary-nav');

        return Boolean(
          context &&
          brand &&
          utilities &&
          navigation &&
          context.bottom <= brand.top &&
          Math.abs(brand.top - utilities.top) < 2 &&
          navigation.top >= brand.bottom,
        );
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.locator('[data-site-footer]').evaluate((footer) => {
        const bounds = footer.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= window.innerWidth;
      }),
    )
    .toBe(true);
});

test('lays out the privacy policy as responsive TUI modules', async ({
  page,
}) => {
  await page.goto('/en/privacy/');

  const panels = page.locator('.privacy-panel');
  await expect(panels).toHaveCount(4);
  await expect
    .poll(() =>
      page.locator('.privacy-grid').evaluate((grid) => {
        const bounds = [...grid.querySelectorAll('.privacy-panel')].map(
          (panel) => panel.getBoundingClientRect(),
        );

        return (
          bounds[1].left > bounds[0].left &&
          bounds[2].top > bounds[0].top &&
          bounds[3].left > bounds[2].left
        );
      }),
    )
    .toBe(true);

  await page.setViewportSize({ width: 320, height: 720 });
  await expect
    .poll(() =>
      page.evaluate(() => {
        const panels = [...document.querySelectorAll('.privacy-panel')];
        const positions = panels.map(
          (panel) => panel.getBoundingClientRect().left,
        );
        return (
          positions.every(
            (position) => Math.abs(position - positions[0]) < 2,
          ) && document.documentElement.scrollWidth <= window.innerWidth
        );
      }),
    )
    .toBe(true);
});

test('keeps CV content visible and suppresses interactive chrome when printed', async ({
  page,
}) => {
  await page.goto('/en/cv/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.cv-overview')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  await expect(page.locator('[data-site-nav]')).toBeHidden();
  await expect(page.locator('[data-language-switcher]')).toBeHidden();
  await expect(page.locator('[data-theme-control]')).toBeHidden();
  await expect(page.locator('[data-shortcut-strip]')).toBeHidden();
  await expect(page.locator('[data-command-palette]')).toBeHidden();
  await expect(page.locator('[data-shortcut-help]')).toBeHidden();
  await expect(page.locator('[data-boot-panel]')).toBeHidden();
  await expect
    .poll(() =>
      page
        .locator('[data-page-title]')
        .evaluate((heading) => getComputedStyle(heading, '::after').display),
    )
    .toBe('none');
});
