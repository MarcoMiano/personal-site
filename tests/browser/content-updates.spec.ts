import { expect, test } from '@playwright/test';

for (const locale of ['it', 'en'] as const) {
  test(`shows updates and ongoing certifications without JavaScript (${locale})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 720 },
    });
    const page = await context.newPage();
    const prefix = locale === 'it' ? '' : '/en';
    const heading = locale === 'it' ? 'Ultimi aggiornamenti' : 'Latest updates';
    const status = locale === 'it' ? 'in corso' : 'in progress';

    try {
      await page.goto(`${prefix}/`);
      const updates = page.getByRole('region', { name: heading });
      await expect(updates).toBeVisible();
      await expect(updates.locator('time')).toHaveAttribute(
        'datetime',
        '2026-10-03',
      );
      await expect(updates).toContainText('Crestron CTI-P301');
      const link = updates.getByRole('link');
      await expect(link).toHaveAttribute('href', `${prefix}/cv/`);
      await link.click();
      const certifications = page.getByRole('region', {
        name: locale === 'it' ? 'Certificazioni' : 'Certifications',
      });
      await expect(certifications.locator('.certification-status')).toHaveCount(
        2,
      );
      for (const name of ['AVIXA CTS', 'Crestron CCP']) {
        const entry = certifications
          .getByRole('listitem')
          .filter({ hasText: name });
        await expect(entry.locator('.certification-status')).toHaveText(status);
      }
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
    } finally {
      await context.close();
    }
  });
}
