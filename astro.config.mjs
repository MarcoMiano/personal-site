import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://miano.cloud',
  trailingSlash: 'always',
  vite: {
    build: {
      // Astro also uses this limit for processed scripts. Keep even tiny
      // executable chunks external without changing CSS/image inlining.
      assetsInlineLimit: (filePath) =>
        /\.[cm]?js(?:$|\?)/i.test(filePath) ? false : undefined,
    },
  },
  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
