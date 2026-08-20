#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const packagePath = resolve(root, 'package.json');
const outputPath = resolve(root, 'dist');
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.xml',
]);
const forbidden = [
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

try {
  await readFile(packagePath, 'utf8');
} catch {
  console.error(
    'Verification must run from the repository root (package.json was not found).',
  );
  process.exit(2);
}

console.log('Running code quality gate...');
const quality = spawnSync('pnpm', ['verify'], {
  cwd: root,
  encoding: 'utf8',
  stdio: 'inherit',
});

if (quality.error) {
  console.error(`Could not run pnpm verify: ${quality.error.message}`);
  process.exit(2);
}

if (quality.status !== 0) process.exit(quality.status ?? 1);

let files;
try {
  files = await collectFiles(outputPath);
} catch {
  console.error(
    'Static output scan failed: dist/ does not exist after the build.',
  );
  process.exit(1);
}

const findings = [];
for (const file of files) {
  const fileName = relative(outputPath, file);
  for (const rule of forbidden) {
    if (rule.pattern.test(fileName))
      findings.push({ file: fileName, rule: rule.label });
  }

  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const contents = await readFile(file, 'utf8');
  for (const rule of forbidden) {
    if (rule.pattern.test(contents))
      findings.push({ file: fileName, rule: rule.label });
  }
}

if (findings.length > 0) {
  console.error('Generated output safety scan failed:');
  for (const finding of findings)
    console.error(`- ${finding.file}: ${finding.rule}`);
  process.exit(1);
}

console.log(
  `Generated output safety scan passed (${files.length} file(s) checked).`,
);
