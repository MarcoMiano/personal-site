#!/usr/bin/env node

import { access, readFile, readdir, stat } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { resolveBuildRevision } from '../src/lib/build.ts';
import {
  contactEmail,
  getIndexablePaths,
  getPath,
  listedPageKeys,
  locales,
  pageKeys,
  pages,
  ui,
} from '../src/lib/site.ts';

const root = process.cwd();
const output = resolve(root, 'dist');
const origin = 'https://miano.cloud';
const failures = [];
const buildRevision = resolveBuildRevision(process.env.SITE_BUILD_REVISION);
let profileImageCount = 0;
const featuredProjectKeys = [
  'cocon-client',
  'conference-av-modernization',
  'personal-site',
];
const publishedProjectKeys = [
  ...featuredProjectKeys,
  'cocon-vote-monitor',
  'mip-mcp9808',
];

const assetBudgets = {
  cssFile: 40 * 1024,
  javascriptTotal: 16 * 1024,
  rasterImageFile: 200 * 1024,
};
const generatedTextExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.xml',
]);
const generatedOutputSafetyRules = [
  {
    label: 'source CV filename',
    pattern: new RegExp(['marco-miano-cv', 'it-v6'].join('-'), 'i'),
  },
  {
    label: 'private source path',
    pattern: new RegExp(
      `(?:^|[/'"])(?:${['source', 'material'].join('-')})(?:[/.'"]|$)`,
      'i',
    ),
  },
  {
    label: 'professional qualification source path',
    pattern: new RegExp(
      `(?:^|[/'"])(?:${['professional', 'certifications'].join('-')})(?:[/.'"]|$)`,
      'i',
    ),
  },
  { label: 'private document format', pattern: /\.docx\b/i },
  {
    label: 'private key material',
    pattern: /BEGIN (?:EC |OPENSSH |RSA )?PRIVATE KEY/i,
  },
  {
    label: 'unreleased project reference',
    pattern: new RegExp(['AV', 'NOC'].join(''), 'i'),
  },
];

function outputFile(path) {
  return resolve(
    output,
    path === '/' ? 'index.html' : `${path.slice(1)}index.html`,
  );
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'))?.[1];
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    if (entry.isFile()) files.push(path);
  }

  return files;
}

async function verifyGeneratedOutputSafety() {
  let files;
  try {
    files = await collectFiles(output);
  } catch {
    failures.push('generated output safety scan could not inspect dist');
    return 0;
  }

  for (const file of files) {
    const fileName = relative(output, file);
    for (const rule of generatedOutputSafetyRules) {
      if (rule.pattern.test(fileName))
        failures.push(`${fileName} contains ${rule.label}`);
    }

    if (!generatedTextExtensions.has(extname(file).toLowerCase())) continue;
    const contents = await readFile(file, 'utf8');
    for (const rule of generatedOutputSafetyRules) {
      if (rule.pattern.test(contents))
        failures.push(`${fileName} contains ${rule.label}`);
    }
  }

  return files.length;
}

for (const locale of locales) {
  for (const page of pageKeys) {
    const path = getPath(locale, page);
    const label = `${locale}:${page}`;
    let html;

    try {
      html = await readFile(outputFile(path), 'utf8');
    } catch {
      failures.push(`${label} did not generate ${path}`);
      continue;
    }

    expect(
      new RegExp(`<html[^>]+lang=["']${locale}["']`, 'i').test(html),
      `${label} has the wrong or missing html lang`,
    );
    expect(
      countMatches(html, /<title>[^<]+<\/title>/gi) === 1,
      `${label} needs exactly one non-empty title`,
    );
    expect(
      countMatches(
        html,
        /<link\s+rel=["']icon["'][^>]+href=["']\/favicon\.svg["'][^>]*>/gi,
      ) === 1,
      `${label} needs exactly one SVG favicon link`,
    );
    expect(
      countMatches(
        html,
        /<meta\s+name=["']description["'][^>]+content=["'][^"']+["'][^>]*>/gi,
      ) === 1,
      `${label} needs exactly one non-empty description`,
    );
    expect(
      countMatches(html, /<h1(?:\s[^>]*)?>/gi) === 1,
      `${label} needs exactly one h1`,
    );
    expect(
      countMatches(html, /<h1\b[^>]*data-page-title[^>]*>/gi) === 1,
      `${label} needs exactly one page-title hook on its h1`,
    );
    if (page === 'cv') {
      expect(
        /<h1\b[^>]*data-page-title[^>]*>\s*Curriculum vitae\s*<\/h1>/i.test(
          html,
        ),
        `${label} needs the Curriculum vitae page heading`,
      );
    }
    expect(
      countMatches(html, /<header\b[^>]*data-site-header[^>]*>/gi) === 1,
      `${label} needs exactly one site header`,
    );
    expect(
      countMatches(html, /<main(?:\s[^>]*)?>/gi) === 1,
      `${label} needs exactly one main`,
    );
    expect(
      countMatches(html, /<footer\b[^>]*data-site-footer[^>]*>/gi) === 1,
      `${label} needs exactly one site footer`,
    );
    expect(
      countMatches(html, /\sdata-build-revision=["'][^"']+["']/gi) === 1,
      `${label} needs exactly one build-revision marker`,
    );
    expect(
      html.includes(`data-build-revision="${buildRevision.value}"`),
      `${label} has the wrong build-revision marker`,
    );

    const footer =
      html.match(
        /<footer\b[^>]*data-site-footer[^>]*>[\s\S]*?<\/footer>/i,
      )?.[0] ?? '';
    const footerText = footer
      .replace(/<[^>]+>/g, '')
      .replaceAll('&quot;', '"')
      .replace(/\s+/g, ' ')
      .trim();
    expect(
      footerText.includes(`build.sha = "${buildRevision.short}"`),
      `${label} is missing the visible build revision`,
    );
    if (buildRevision.url) {
      const accessibleLabel = `${ui[locale].footerBuildRevision}: ${buildRevision.value}`;
      const revisionLink =
        footer.match(
          /<a\b[^>]*footer-revision__link[^>]*>([\s\S]*?)<\/a>/i,
        )?.[1] ?? '';
      expect(
        footer.includes(`href="${buildRevision.url}"`) &&
          footer.includes(`aria-label="${accessibleLabel}"`) &&
          footer.includes(`title="${accessibleLabel}"`),
        `${label} is missing the linked full source revision`,
      );
      expect(
        revisionLink.includes(buildRevision.short) &&
          revisionLink.includes('data-brand="github"') &&
          !revisionLink.includes('&quot;') &&
          footer.includes('</a><span aria-hidden="true">&quot;</span>'),
        `${label} must link only the short revision and GitHub mark`,
      );
    } else {
      expect(
        !footer.includes('footer-revision__link'),
        `${label} must not link the LOCAL build fallback`,
      );
    }
    expect(
      /<main[^>]+id=["']main-content["'][^>]+data-page-main/i.test(html),
      `${label} is missing the stable main landmark`,
    );
    expect(
      /<a[^>]+href=["']#main-content["'][^>]+data-skip-link/i.test(html),
      `${label} is missing its skip link`,
    );
    expect(
      /<nav[^>]+data-site-nav/i.test(html),
      `${label} is missing primary navigation`,
    );
    expect(
      /<nav[^>]+data-language-switcher/i.test(html),
      `${label} is missing language navigation`,
    );
    for (const mode of ['auto', 'dark', 'bright']) {
      expect(
        countMatches(
          html,
          new RegExp(
            `<svg\\b[^>]*data-theme-mode-icon=["']${mode}["'][^>]*data-icon-source=["']hackernoon-pixel-icon-library["'][^>]*data-icon-license=["']CC-BY-4\\.0["']`,
            'gi',
          ),
        ) === 1,
        `${label} needs one attributed ${mode} theme icon`,
      );
    }
    expect(
      html.includes('miano.theme'),
      `${label} is missing the early theme-preference bootstrap`,
    );
    expect(
      countMatches(
        html,
        /<div\b[^>]*data-shortcut-strip[^>]*\shidden(?:\s|>|=)/gi,
      ) === 1,
      `${label} needs one progressively revealed shortcut strip`,
    );
    const narrativeEffectCount = countMatches(
      html,
      /<(?:p|figcaption)\b[^>]*data-content-effect[^>]*>[\s\S]*?<span\b[^>]*class=["']visually-hidden["'][^>]*>[\s\S]*?<\/span>[\s\S]*?<span\b[^>]*aria-hidden=["']true["'][^>]*data-content-effect-visual[^>]*>/gi,
    );
    expect(
      narrativeEffectCount >= 1,
      `${label} needs complete accessible text beside each decorative narrative effect`,
    );
    expect(
      !/tabindex=["']?[1-9]/i.test(html),
      `${label} contains a positive tabindex`,
    );
    expect(!/\sautofocus(?:\s|=|>)/i.test(html), `${label} contains autofocus`);

    const canonical = new URL(path, origin).href;
    expect(
      html.includes(`<link rel="canonical" href="${canonical}">`),
      `${label} has the wrong canonical URL`,
    );
    for (const alternate of locales) {
      const alternateUrl = new URL(getPath(alternate, page), origin).href;
      expect(
        html.includes(
          `<link rel="alternate" hreflang="${alternate}" href="${alternateUrl}">`,
        ),
        `${label} is missing its ${alternate} alternate`,
      );
    }
    expect(
      html.includes(
        `<link rel="alternate" hreflang="x-default" href="${new URL(getPath('it', page), origin).href}">`,
      ),
      `${label} is missing its x-default alternate`,
    );
    expect(
      html.includes('<meta name="robots" content="noindex,follow">') ===
        !pages[page].indexable,
      `${label} has inconsistent indexing metadata`,
    );
    expect(
      html.includes('data-page-provisional') === !pages[page].listed,
      `${label} has inconsistent structural-draft status`,
    );

    const primaryNav =
      html.match(/<nav[^>]+data-site-nav[^>]*>([\s\S]*?)<\/nav>/i)?.[1] ?? '';
    for (const navPage of pageKeys.filter(
      (key) => pages[key].nav && pages[key].listed,
    )) {
      expect(
        primaryNav.includes(`href="${getPath(locale, navPage)}"`),
        `${label} primary navigation is missing ${navPage}`,
      );
    }

    const otherLocale = locale === 'it' ? 'en' : 'it';
    const languageNav =
      html.match(
        /<nav[^>]+data-language-switcher[^>]*>([\s\S]*?)<\/nav>/i,
      )?.[1] ?? '';
    expect(
      languageNav.includes(`href="${getPath(otherLocale, page)}"`),
      `${label} language switch does not preserve the page`,
    );

    const commandPalette =
      html.match(
        /<dialog\b[^>]*data-command-palette[^>]*>([\s\S]*?)<\/dialog>/i,
      )?.[1] ?? '';
    for (const commandPage of listedPageKeys) {
      expect(
        commandPalette.includes(`href="${getPath(locale, commandPage)}"`),
        `${label} command palette is missing ${commandPage}`,
      );
    }
    for (const hiddenPage of pageKeys.filter((page) => !pages[page].listed)) {
      expect(
        !primaryNav.includes(`href="${getPath(locale, hiddenPage)}"`) &&
          !commandPalette.includes(`href="${getPath(locale, hiddenPage)}"`),
        `${label} publicly lists hidden page ${hiddenPage}`,
      );
    }
    expect(
      /<li\b[^>]*data-legacy-command[^>]*\shidden(?:\s|>|=)/i.test(
        commandPalette,
      ),
      `${label} needs a hidden-by-default legacy command`,
    );

    const localLinks = [
      ...html.matchAll(/<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/gi),
    ]
      .map((match) => attribute(match[0], 'href'))
      .filter((href) => href?.startsWith('/') && !href.startsWith('//'));
    for (const href of localLinks) {
      const target = new URL(href, origin).pathname;
      try {
        await access(outputFile(target));
      } catch {
        failures.push(`${label} links to missing local route ${href}`);
      }
    }

    const mailtoLinks = [
      ...html.matchAll(/<a\b[^>]*\shref=["']mailto:([^"']+)["'][^>]*>/gi),
    ].map((match) => match[1]);
    expect(
      mailtoLinks.every((address) => address === contactEmail),
      `${label} publishes an email other than the approved contact alias`,
    );
    expect(
      mailtoLinks.length === (page === 'contact' || page === 'privacy' ? 1 : 0),
      `${label} has an unexpected number of contact email links`,
    );

    const githubLinks = [
      ...html.matchAll(
        /<a\b[^>]*\shref=["']https:\/\/github\.com\/[^"']+["'][^>]*>/gi,
      ),
    ];
    for (const githubLink of githubLinks) {
      expect(
        githubLink[0].includes('data-external-brand-link'),
        `${label} has a GitHub link without the external-brand treatment`,
      );
    }

    for (const brandLink of html.matchAll(
      /<a\b[^>]*data-external-brand-link[^>]*>([\s\S]*?)<\/a>/gi,
    )) {
      const href = attribute(brandLink[0], 'href');
      expect(
        /<svg\b[^>]*class=["'][^"']*external-brand-icon[^"']*["'][^>]*shape-rendering=["']crispEdges["']/i.test(
          brandLink[1],
        ),
        `${label} has an external-brand link without a crisp pixel icon`,
      );
      const expectedBrand = href?.startsWith('https://github.com/')
        ? 'github'
        : href?.startsWith('https://www.linkedin.com/')
          ? 'linkedin'
          : href?.startsWith('https://bsky.app/')
            ? 'bluesky'
            : undefined;
      if (expectedBrand) {
        expect(
          new RegExp(
            `<svg\\b[^>]*data-brand=["']${expectedBrand}["']`,
            'i',
          ).test(brandLink[1]),
          `${label} has a ${expectedBrand} link with the wrong brand icon`,
        );
        expect(
          brandLink[1].includes(
            'data-icon-source="hackernoon-pixel-icon-library"',
          ) && brandLink[1].includes('data-icon-license="CC-BY-4.0"'),
          `${label} has a ${expectedBrand} icon without its HackerNoon source and licence markers`,
        );
      }
    }

    if (page === 'contact') {
      for (const href of [
        'https://github.com/MarcoMiano',
        'https://www.linkedin.com/in/marco-miano/',
        'https://bsky.app/profile/ev3rm4rc0.bsky.social',
      ]) {
        expect(
          html.includes(`href="${href}"`),
          `${label} is missing approved contact link ${href}`,
        );
      }
    }

    if (page === 'privacy') {
      expect(
        html.includes('localStorage') &&
          html.includes('sessionStorage') &&
          html.includes('miano.bootSeen'),
        `${label} does not disclose client-side preference storage`,
      );
    }

    if (page === 'home') {
      for (const project of featuredProjectKeys) {
        expect(
          html.includes(
            `href="${getPath(locale, 'projects')}#project-${project}"`,
          ),
          `${label} is missing selected project ${project}`,
        );
      }
    }

    if (page === 'projects') {
      for (const project of publishedProjectKeys) {
        expect(
          html.includes(`id="project-${project}"`),
          `${label} is missing project anchor ${project}`,
        );
      }
    }

    const profileImages = [
      ...html.matchAll(/<img\b[^>]*data-profile-image[^>]*>/gi),
    ];
    const expectsProfile = page === 'home' || page === 'cv';
    expect(
      profileImages.length === (expectsProfile ? 1 : 0),
      `${label} has an unexpected number of profile images`,
    );
    profileImageCount += profileImages.length;

    for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
      expect(
        attribute(image[0], 'alt') !== undefined,
        `${label} has an image without alt`,
      );
      expect(
        Number(attribute(image[0], 'width')) > 0 &&
          Number(attribute(image[0], 'height')) > 0,
        `${label} has an image without intrinsic dimensions`,
      );

      const source = attribute(image[0], 'src');
      expect(
        source?.startsWith('/_astro/'),
        `${label} has an unexpected image source`,
      );
      if (source?.startsWith('/')) {
        try {
          await access(resolve(output, source.slice(1)));
        } catch {
          failures.push(`${label} references missing image ${source}`);
        }
      }

      const sourceSet = attribute(image[0], 'srcset');
      if (sourceSet) {
        for (const candidate of sourceSet.split(',')) {
          const candidateSource = candidate.trim().split(/\s+/)[0];
          if (!candidateSource?.startsWith('/')) continue;
          try {
            await access(resolve(output, candidateSource.slice(1)));
          } catch {
            failures.push(
              `${label} references missing responsive image ${candidateSource}`,
            );
          }
        }
      }

      if (image[0].includes('data-profile-image')) {
        expect(
          source?.endsWith('.webp') && sourceSet?.includes('.webp'),
          `${label} profile image is missing responsive WebP output`,
        );
      }
    }

    expect(
      !/(?:fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net)/i.test(
        html,
      ),
      `${label} references a remote font service`,
    );
  }
}

expect(
  profileImageCount === 4,
  'the localized Landing and CV pages need four profile images',
);

const assetDirectory = resolve(output, '_astro');
let javascriptBytes = 0;
try {
  for (const entry of await readdir(assetDirectory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const assetPath = resolve(assetDirectory, entry.name);
    const { size } = await stat(assetPath);

    if (entry.name.endsWith('.js')) javascriptBytes += size;
    if (entry.name.endsWith('.css')) {
      expect(
        size <= assetBudgets.cssFile,
        `${entry.name} exceeds the ${assetBudgets.cssFile}-byte CSS budget`,
      );
    }
    if (/\.(?:avif|jpe?g|png|webp)$/i.test(entry.name)) {
      expect(
        size <= assetBudgets.rasterImageFile,
        `${entry.name} exceeds the ${assetBudgets.rasterImageFile}-byte raster-image budget`,
      );
    }
  }
} catch {
  failures.push('generated asset directory could not be inspected');
}
expect(
  javascriptBytes <= assetBudgets.javascriptTotal,
  `client JavaScript exceeds the ${assetBudgets.javascriptTotal}-byte budget`,
);

let robots = '';
let sitemap = '';
let favicon = '';
try {
  [robots, sitemap, favicon] = await Promise.all([
    readFile(resolve(output, 'robots.txt'), 'utf8'),
    readFile(resolve(output, 'sitemap.xml'), 'utf8'),
    readFile(resolve(output, 'favicon.svg'), 'utf8'),
  ]);
} catch {
  failures.push('robots.txt, sitemap.xml, or favicon.svg was not generated');
}

expect(
  favicon.includes('<svg') && favicon.includes('viewBox="0 0 100 100"'),
  'favicon.svg is empty or malformed',
);

expect(
  robots.includes('Sitemap: https://miano.cloud/sitemap.xml'),
  'robots.txt does not name the canonical sitemap',
);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
const expectedSitemapUrls = getIndexablePaths().map(
  (path) => new URL(path, origin).href,
);
expect(
  JSON.stringify(sitemapUrls) === JSON.stringify(expectedSitemapUrls),
  'sitemap URLs do not match the indexable route registry',
);

const failureCountBeforeOutputSafety = failures.length;
const generatedOutputFileCount = await verifyGeneratedOutputSafety();
if (failures.length === failureCountBeforeOutputSafety) {
  console.log(
    `Generated output safety scan passed (${generatedOutputFileCount} file(s) checked).`,
  );
}

if (failures.length > 0) {
  console.error('Static-site verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Static-site verification passed (${locales.length * pageKeys.length} localized pages checked).`,
);
