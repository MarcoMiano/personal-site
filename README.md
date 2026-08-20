# miano.cloud

Marco Miano's bilingual personal website: a static Astro project for sharing
software, AV automation, infrastructure work, and technical notes.

## Requirements

- Conda or another environment manager
- Node.js 24 LTS
- pnpm 11.22.0

The repository-local environment definition keeps project tooling isolated from
Conda `base`. The exact setup is:

```sh
conda env create --prefix ./.conda --file environment.yml
conda activate ./.conda
corepack enable --install-directory "$CONDA_PREFIX/bin"
corepack prepare pnpm@11.22.0 --activate
pnpm install
```

For a later session, activate `.conda` and run `pnpm install` only when the
lockfile changes. The repository's `.env.tooling` disables framework telemetry
without containing secrets. This environment is intentionally Node-only;
repository-adjacent Python tooling belongs in a separate named Conda
environment outside the checkout, never in Conda `base`.

`pnpm-workspace.yaml` keeps PostCSS on the latest compatible Nano ID 3.x patch;
the override can be removed when PostCSS no longer requires that CommonJS line.

## Commands

```sh
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm format:check
pnpm verify
pnpm verify:site
pnpm test:browser
pnpm test:browser:all
```

`pnpm verify:site` runs the deterministic quality gate and scans source and
generated output for publication-safety violations. Browser tests cover
Chromium, Firefox, and WebKit; the complete matrix runs in CI.

## Structure

```text
src/pages/        Italian and English routes
src/components/   Shared semantic page structure
src/layouts/      Document shell and metadata
src/lib/          Typed route, content and interface contracts
src/content/      Bilingual CV and project collections
src/styles/       Responsive design tokens and styles
src/assets/       Optimized site assets
scripts/          Dependency-free source and static-output checks
public/           Files copied unchanged into the generated site
tests/browser/    Progressive-enhancement and interaction checks
docs/             Public architecture and visual-system notes
.agents/skills/   Repeatable content, dependency, and verification guidance
```

Astro turns each page into a static route. Shared components provide the
semantic shell, while typed data and content collections keep localization and
metadata consistent. The client scripts are progressive enhancements: links,
content, and navigation remain usable without JavaScript.

## Publication boundary

CI builds and verifies the site, then retains the exact deterministic `dist/`
artifact for the private release process. This repository does not contain
deployment credentials, production scripts, or infrastructure automation.

The site intentionally has no analytics, profiling, advertising, contact form,
account system, or non-essential cookies. See the rendered privacy page for the
site's actual hosting and operational logging disclosure.

## Documentation

- `AGENTS.md` contains durable public-source rules.
- `docs/TECHNICAL_OVERVIEW.md` explains the build, content, localization, and
  progressive-enhancement boundaries.
- `docs/VISUAL_SYSTEM.md` records the palette, mark, typography, and
  accessibility constraints.

## License

Source code is available under the MIT License. Site prose, CV and project
content, photographs, EHMF mark, favicon, and personal identity assets remain
copyright Marco Miano, all rights reserved. See `LICENSE` and `NOTICE.md`.
