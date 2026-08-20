# Technical overview

## Build model

Astro compiles the project to static HTML, CSS, JavaScript, and optimized image assets. `astro.config.mjs` selects static output, trailing-slash routes, and Italian as the default locale. `pnpm build` writes the deployable site to `dist/`; no application server or database is required at runtime.

## Routes and localization

The explicit page files in `src/pages/` make the Italian and English route trees easy to audit. `src/lib/site.ts` is the typed registry for page keys, localized paths, interface strings, metadata, and the approved contact alias. Every finished page emits a canonical URL, Italian and English alternates, an `x-default` alternate, a title, a description, and the correct indexing state.

## Components and progressive enhancement

`BaseLayout.astro` owns document metadata and shared resources. The site header, navigation, language switcher, footer, content cards, and page-specific panels are semantic Astro components. Theme selection, command palette behavior, shortcuts, and first-session presentation are small framework-free scripts.

Without JavaScript, ordinary links and content remain usable. JavaScript only adds convenience behavior, and reduced-motion preferences remove decorative motion without changing content or access.

## Content and assets

The CV is structured JSON because it is a list of typed records with shared fields. Projects, notes, and lab entries use Markdown frontmatter and typed content-collection schemas. The localized-content and case-study skills keep paired translations, attribution, and draft/index flags synchronized.

[`CONTENT_AUTHORING.md`](CONTENT_AUTHORING.md) is the operational companion for public CV and project updates: it maps the content locations, explains the publication boundary, and provides paired fictional examples. Notes and Lab remain schema-ready but dormant until a separately reviewed rendering and publication change enables them.

Only the reviewed 320-pixel and 640-pixel WebP portrait variants are retained. Private source documents and unreviewed originals are never part of the public tree or generated output.

## Verification and artifact boundary

`pnpm verify:site` runs formatting, Astro/TypeScript checks, a source-safety scan, a static build, route/metadata/link checks, and a generated-output safety scan. Playwright checks progressive enhancement and interactions in Chromium, Firefox, and WebKit. CI runs this gate and packages the resulting `dist/` directory only after all checks succeed.

CI supplies the full commit hash through the build-time-only `SITE_BUILD_REVISION` environment variable. The build rejects values that are not exactly 40 lowercase hexadecimal characters; when the variable is absent, local output labels itself `LOCAL`. The generated footer contains the revision, so the browser performs no source lookup.

The CI package is deterministic: files are sorted, timestamps use the commit timestamp, ownership is normalized, and gzip metadata is omitted. The archive and its SHA-256 sidecar are retained as `personal-site-<commit>` for 30 days. CI has read-only repository permissions and no production credentials. A downstream release process consumes an exact verified artifact.

## Privacy boundary

The rendered privacy page contains the intentionally approved disclosure about the site's hosting provider and runtime logging. That operational disclosure is not duplicated in general documentation, workflows, tests, or metadata. The site has no analytics, advertising, profiling, contact form, or non-essential cookies.
