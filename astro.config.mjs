import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://miano.cloud',
  trailingSlash: 'always',
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
