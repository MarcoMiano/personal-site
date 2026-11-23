import { expect, test } from '@playwright/test';

const certificationNames = [
  'AVIXA Certified Technology Specialist (CTS)',
  'Extron Authorized Programmer (EAP)',
  'Extron Control Professional (ECP)',
  'Extron XTP Systems Engineer (XTP-E)',
];

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
      const homeBadges = page
        .locator('.profile-panel figcaption')
        .getByRole('link', {
          name:
            locale === 'it'
              ? 'Certificazioni nel CV'
              : 'Certifications in the CV',
        });
      await expect(homeBadges).toBeVisible();
      await expect(homeBadges).toHaveAttribute(
        'href',
        `${prefix}/cv/#cv-certifications-heading`,
      );
      for (const name of certificationNames) {
        const badge = homeBadges.getByRole('img', { name, exact: true });
        await expect(badge).toBeVisible();
        await expect
          .poll(() =>
            badge.evaluate((image) => (image as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }
      const updates = page.getByRole('region', { name: heading });
      await expect(updates).toBeVisible();
      const entries = updates.getByRole('listitem');
      const latest = entries.first();
      const title =
        locale === 'it'
          ? 'Certificazione AVIXA CTS conseguita'
          : 'AVIXA CTS certification earned';
      await expect(latest.locator('time')).toHaveAttribute(
        'datetime',
        '2026-11-23',
      );
      const earlier = entries.filter({ hasText: 'Crestron CTI-P301' });
      await expect(earlier.locator('time')).toHaveAttribute(
        'datetime',
        '2026-10-03',
      );
      const link = latest.getByRole('link', { name: title });
      await expect(link).toHaveAttribute(
        'href',
        `${prefix}/cv/#cv-certifications-heading`,
      );
      await link.click();
      const certifications = page.getByRole('region', {
        name: locale === 'it' ? 'Certificazioni' : 'Certifications',
      });
      const cts = certifications
        .getByRole('listitem')
        .filter({ hasText: 'AVIXA Certified Technology Specialist (CTS)' });
      const credentialId =
        locale === 'it'
          ? 'ID certificazione 415628'
          : 'Certification ID 415628';
      await expect(cts).toContainText(credentialId);
      await expect(cts.locator('.certification-status')).toHaveCount(0);
      for (const name of certificationNames) {
        const badge = certifications
          .getByRole('listitem')
          .filter({ hasText: name })
          .locator('img');
        await badge.scrollIntoViewIfNeeded();
        await expect(badge).toBeVisible();
        await expect
          .poll(() =>
            badge.evaluate((image) => (image as HTMLImageElement).naturalWidth),
          )
          .toBeGreaterThan(0);
      }

      const ccp = certifications
        .getByRole('listitem')
        .filter({ hasText: 'Crestron CCP' });
      await expect(ccp.locator('.certification-status')).toHaveText(status);
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
