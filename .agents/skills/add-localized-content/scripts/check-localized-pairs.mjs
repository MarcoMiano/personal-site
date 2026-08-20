import { readFile, readdir } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';

const root = process.cwd();
const contentRoot = resolve(root, 'src/content');
const markdownCollections = ['projects', 'notes', 'lab'];
const failures = [];
const entries = [];

function scalar(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm'));
  return match?.[1]?.replace(/^['"]|['"]$/g, '');
}

function boolean(frontmatter, field) {
  const value = scalar(frontmatter, field);
  return value === 'true' ? true : value === 'false' ? false : undefined;
}

for (const collection of markdownCollections) {
  const directory = resolve(contentRoot, collection);
  for (const filename of await readdir(directory)) {
    if (!['.md', '.mdx'].includes(extname(filename))) continue;

    const source = await readFile(resolve(directory, filename), 'utf8');
    const frontmatter = source.match(
      /^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/,
    )?.[1];
    if (!frontmatter) {
      failures.push(`${collection}/${filename}: missing YAML frontmatter`);
      continue;
    }

    const translationKey = scalar(frontmatter, 'translationKey');
    const locale = scalar(frontmatter, 'locale');
    const draft = boolean(frontmatter, 'draft');
    const noindex = boolean(frontmatter, 'noindex');
    const fileLocale = basename(filename, extname(filename)).match(
      /-(it|en)$/,
    )?.[1];

    if (!translationKey)
      failures.push(`${collection}/${filename}: missing translationKey`);
    if (!['it', 'en'].includes(locale))
      failures.push(`${collection}/${filename}: invalid locale`);
    if (fileLocale !== locale)
      failures.push(
        `${collection}/${filename}: filename locale does not match frontmatter`,
      );
    if (draft === undefined)
      failures.push(`${collection}/${filename}: draft must be explicit`);
    if (noindex === undefined)
      failures.push(`${collection}/${filename}: noindex must be explicit`);
    if (draft === true && noindex !== true)
      failures.push(`${collection}/${filename}: drafts must remain noindex`);

    if (translationKey && ['it', 'en'].includes(locale)) {
      entries.push({
        collection,
        filename,
        translationKey,
        locale,
        draft,
        noindex,
      });
    }
  }
}

const cvDirectory = resolve(contentRoot, 'cv');
for (const filename of await readdir(cvDirectory)) {
  if (extname(filename) !== '.json') continue;
  const data = JSON.parse(
    await readFile(resolve(cvDirectory, filename), 'utf8'),
  );
  const fileLocale = basename(filename, '.json');

  if (fileLocale !== data.locale)
    failures.push(`cv/${filename}: filename locale does not match data`);
  if (data.draft === true && data.noindex !== true)
    failures.push(`cv/${filename}: drafts must remain noindex`);
  entries.push({
    collection: 'cv',
    filename,
    translationKey: data.translationKey,
    locale: data.locale,
    draft: data.draft,
    noindex: data.noindex,
  });
}

const groups = Map.groupBy(
  entries,
  ({ collection, translationKey }) => `${collection}:${translationKey}`,
);
for (const [key, group] of groups) {
  const locales = group.map(({ locale }) => locale);
  for (const locale of ['it', 'en']) {
    const count = locales.filter((value) => value === locale).length;
    if (count > 1) failures.push(`${key}: duplicate ${locale} entry`);
  }

  const complete = locales.includes('it') && locales.includes('en');
  const publishable = group.some(({ draft }) => draft === false);
  if (publishable && !complete)
    failures.push(`${key}: publishable content needs both locales`);

  if (complete) {
    const italian = group.find(({ locale }) => locale === 'it');
    const english = group.find(({ locale }) => locale === 'en');
    if (italian.draft !== english.draft)
      failures.push(`${key}: draft flags differ between locales`);
    if (italian.noindex !== english.noindex)
      failures.push(`${key}: noindex flags differ between locales`);
  }
}

if (failures.length > 0) {
  console.error('Localized-content pair check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Localized-content pair check passed (${groups.size} translation pair(s) checked).`,
  );
}
