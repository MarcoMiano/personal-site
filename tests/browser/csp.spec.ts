import { expect, test } from '@playwright/test';
import { themeStorageKey } from '../../src/lib/interactions';
import { getPath, locales, pageKeys } from '../../src/lib/site';

test('runs external scripts under a self-only CSP without violations', async ({
  page,
}) => {
  const violations: string[] = [];
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /content security policy|script-src/i.test(message.text())
    ) {
      violations.push(message.text());
    }
  });

  for (const locale of locales) {
    for (const pageKey of pageKeys) {
      const response = await page.goto(getPath(locale, pageKey));
      expect(response?.headers()['content-security-policy']).toBe(
        "script-src 'self'",
      );
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('[data-theme-control]')).toBeVisible();
      await expect(page.locator('[data-shortcut-strip]')).toBeVisible();
    }
  }
  expect(violations).toEqual([]);

  const scripts = await page.locator('script').evaluateAll((elements) =>
    elements.map((element) => {
      const type = element.getAttribute('type')?.toLowerCase() ?? '';
      return {
        executable:
          !type ||
          ['module', 'text/javascript', 'application/javascript'].includes(
            type,
          ),
        source: element.getAttribute('src'),
        text: element.textContent?.trim() ?? '',
      };
    }),
  );
  for (const script of scripts.filter((script) => script.executable)) {
    expect(script.source).toMatch(/^\/_astro\/.+\.js$/);
    expect(script.text).toBe('');
  }
});

test('applies the stored theme before delayed enhancement modules run', async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: 'light' });
  await context.addInitScript((storageKey) => {
    localStorage.setItem(storageKey, 'dark');
  }, themeStorageKey);
  const page = await context.newPage();
  let releaseModules: () => void = () => {};
  const modulesHeld = new Promise<void>((resolve) => {
    releaseModules = resolve;
  });

  await page.route(/\/_astro\/.+\.js$/, async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (/bootstrap\.[^/]+\.js$/.test(pathname)) {
      const response = await route.fetch();
      const body = await response.text();
      await route.fulfill({
        response,
        body: `${body}\ndocument.documentElement.dataset.cspBootstrapSnapshot = JSON.stringify({ bodyPresent: document.body !== null, theme: document.documentElement.dataset.theme });`,
      });
    } else {
      await modulesHeld;
      await route.continue();
    }
  });

  try {
    await page.goto('/en/', { waitUntil: 'commit' });
    await page.waitForFunction(
      () => document.documentElement.dataset.cspBootstrapSnapshot !== undefined,
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('html')).toHaveAttribute(
      'data-csp-bootstrap-snapshot',
      JSON.stringify({ bodyPresent: false, theme: 'dark' }),
    );
    await expect(
      page.locator('head script[data-site-bootstrap]'),
    ).toHaveAttribute('src', /^\/_astro\/bootstrap\.[^/]+\.js$/);
    releaseModules();
    await page.waitForLoadState('domcontentloaded');
  } finally {
    releaseModules();
    await context.close();
  }
});

test('keeps normal content and controls usable when storage reads fail', async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', {
      configurable: true,
      value: () => {
        throw new DOMException('Storage is unavailable', 'SecurityError');
      },
    });
  });
  const page = await context.newPage();

  await page.goto('/');
  await expect(page.locator('[data-boot-panel]')).toBeHidden();
  await expect(page.locator('[data-page-title]')).toHaveText(
    'Sistemi, segnali e software.',
  );

  const theme = page.locator('[data-theme-control]');
  await theme.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.keyboard.press('Alt+p');
  await expect(page.locator('[data-command-palette]')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Progetti', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await context.close();
});

test('does not arm first-session effects when session storage writes fail', async ({
  browser,
}) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'setItem', {
      configurable: true,
      value: () => {
        throw new DOMException('Storage is unavailable', 'SecurityError');
      },
    });
  });
  const page = await context.newPage();

  await page.goto('/en/');
  await expect(page.locator('[data-boot-panel]')).toBeHidden();
  await expect(page.locator('html')).not.toHaveAttribute(
    'data-first-session-effect',
  );
  await context.close();
});
