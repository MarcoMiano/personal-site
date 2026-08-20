/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
