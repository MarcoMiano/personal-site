import type { Locale } from './site';

export function getCurrentTenure(startMonth: string, locale: Locale): string {
  const [startYear, startMonthNumber] = startMonth.split('-').map(Number);
  const now = new Date();
  const months = Math.max(
    0,
    (now.getFullYear() - startYear) * 12 +
      now.getMonth() +
      1 -
      startMonthNumber,
  );
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (months === 0)
    return locale === 'it' ? 'meno di un mese' : 'less than a month';

  const parts =
    locale === 'it'
      ? [
          years > 0 && `${years} ${years === 1 ? 'anno' : 'anni'}`,
          remainingMonths > 0 &&
            `${remainingMonths} ${remainingMonths === 1 ? 'mese' : 'mesi'}`,
        ]
      : [
          years > 0 && `${years} ${years === 1 ? 'year' : 'years'}`,
          remainingMonths > 0 &&
            `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`,
        ];

  return parts.filter(Boolean).join(locale === 'it' ? ' e ' : ' ');
}
