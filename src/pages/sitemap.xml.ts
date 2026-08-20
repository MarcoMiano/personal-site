import type { APIRoute } from 'astro';
import { getIndexablePaths } from '../lib/site';

export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? url;
  const entries = getIndexablePaths()
    .map((path) => `  <url><loc>${new URL(path, origin)}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
