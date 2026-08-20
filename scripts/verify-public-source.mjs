#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set([
  '.astro',
  '.conda',
  '.git',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
]);
const textExtensions = new Set([
  '',
  '.astro',
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);
const privacyPath = 'src/components/PrivacyPage.astro';
// The desktop-distribution entry is an approved public CV skill; this exception
// does not permit general hosting or operations documentation.
const cvPaths = new Set(['src/content/cv/en.json', 'src/content/cv/it.json']);
const safetyScannerPaths = new Set([
  'scripts/verify-public-source.mjs',
  '.agents/skills/verify-personal-site/scripts/verify-site.mjs',
]);

const joinedPattern = (parts, flags = 'i') => new RegExp(parts.join(''), flags);

const forbiddenRules = [
  {
    label: 'operational host identifier',
    pattern: joinedPattern(['tel', 'star']),
  },
  {
    label: 'deployment account identifier',
    pattern: joinedPattern(['miano', '-', 'deploy']),
  },
  {
    label: 'deployment environment identifier',
    pattern: joinedPattern(['production', '-', 'upload']),
  },
  {
    label: 'private release skill',
    pattern: joinedPattern(['release', '-', 'static', '-', 'site']),
  },
  { label: 'SSH operation', pattern: /\bssh\b/i },
  { label: 'SFTP operation', pattern: /\bsftp\b/i },
  {
    label: 'host firewall operation',
    pattern: joinedPattern(['firewall', 'd']),
  },
  {
    label: 'authoritative DNS operator',
    pattern: joinedPattern(['de', 'SEC']),
  },
  {
    label: 'registrar operator',
    pattern: joinedPattern(['IN', 'WX']),
  },
  { label: 'server filesystem path', pattern: /\/srv\//i },
  {
    label: 'preview listener',
    pattern: joinedPattern(['127.0.0.1:', '8008']),
  },
  {
    label: 'administration listener',
    pattern: joinedPattern(['127.0.0.1:', '2019']),
  },
  {
    label: 'internal planning document',
    pattern: joinedPattern(['SITE', '_KICKOFF', '_SURVEY']),
  },
  {
    label: 'internal phase record',
    pattern: joinedPattern(['PHASE', '_3']),
  },
  {
    label: 'internal implementation plan',
    pattern: joinedPattern(['IMPLEMENTATION', '_PLAN']),
  },
  {
    label: 'private input directory',
    pattern: joinedPattern(['source', '-', 'material']),
  },
  {
    label: 'qualification input directory',
    pattern: joinedPattern(['professional', '-', 'certifications']),
  },
  {
    label: 'unused original portrait',
    pattern: joinedPattern(['marco-miano-profile', '.png']),
  },
  {
    label: 'unreleased project reference',
    pattern: joinedPattern(['AV', 'NOC']),
  },
  {
    label: 'private key material',
    pattern: /BEGIN (?:EC |OPENSSH |RSA )?PRIVATE KEY/i,
  },
  { label: 'private document format', pattern: /\.(?:docx|pdf)\b/i },
];

const disclosureRules = [
  {
    label: 'hosting provider disclosure',
    pattern: joinedPattern(['Info', 'maniak']),
    allowed: new Set([privacyPath]),
  },
  {
    label: 'web runtime disclosure',
    pattern: joinedPattern(['Cad', 'dy']),
    allowed: new Set([privacyPath]),
  },
  {
    label: 'host operating-system disclosure',
    pattern: joinedPattern(['Fed', 'ora']),
    allowed: new Set([privacyPath, ...cvPaths]),
  },
];

async function collectWorkingFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectWorkingFiles(path)));
    if (entry.isFile()) files.push(relative(root, path));
  }

  return files;
}

async function sourceFiles() {
  try {
    const output = execFileSync('git', ['ls-files', '-z'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const files = output.split('\0').filter(Boolean);
    if (files.length > 0) return files;
  } catch {
    // A fresh export can be checked before its initial Git commit.
  }

  return collectWorkingFiles(root);
}

const findings = [];
for (const file of await sourceFiles()) {
  for (const rule of forbiddenRules) {
    if (rule.pattern.test(file)) findings.push({ file, rule: rule.label });
  }

  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const contents = await readFile(resolve(root, file), 'utf8');
  if (!safetyScannerPaths.has(file)) {
    for (const rule of forbiddenRules) {
      if (rule.pattern.test(contents))
        findings.push({ file, rule: rule.label });
    }
  }
  for (const rule of disclosureRules) {
    if (rule.pattern.test(contents) && !rule.allowed.has(file))
      findings.push({ file, rule: rule.label });
  }
}

if (findings.length > 0) {
  console.error('Public-source safety scan failed:');
  for (const finding of findings)
    console.error(`- ${finding.file}: ${finding.rule}`);
  process.exit(1);
}

console.log('Public-source safety scan passed.');
