# Public repository guidance

## Project intent

- Maintain Marco Miano's bilingual personal website for employers,
  collaborators, and technical peers.
- Present software, low-level hardware, AV automation, and infrastructure work
  with a technical, dry, and occasionally playful professional voice.
- Prefer a restrained terminal/TUI character, readable information density,
  and ordinary web semantics over novelty effects.

## Architecture

- Use Astro static output, strict TypeScript, pnpm, native CSS, and small
  framework-free client scripts.
- Keep content and navigation functional without JavaScript; client code is
  progressive enhancement.
- Use typed Astro content collections. Markdown is the default content format.
- Keep dependencies few and document every non-trivial dependency.
- Do not add a server adapter, database, accounts, realtime service, or private
  API integration without a new architecture decision.

## Localization and content

- Italian is the default language and English mirrors published routes under
  `/en/`.
- Keep shared UI strings in typed locale dictionaries.
- Publish paired Italian and English entries with a stable translation key.
- Keep new or unresolved entries drafted and `noindex` until both languages,
  facts, attribution, and confidentiality are reviewed.
- Separate Marco's contribution from employer or organization ownership. Never
  infer authorship from repository access.

## Design and accessibility

- Preserve the Solarized-inspired dark theme and Xerox-Alto-influenced bright
  theme, with restrained pixel-style external marks.
- Use semantic landmarks, visible focus, skip navigation, keyboard-operable
  controls, and responsive layouts.
- Honor `prefers-reduced-motion`; decorative effects must never delay access or
  obscure content.
- Keep the site fast, usable with JavaScript disabled, and free of forced sound
  or autoplay.

## Publication safety

- Never commit private source documents, certificates, credentials, raw source
  metadata, or direct personal contact data.
- The public CV omits street address, phone number, full birth date, and
  birthplace.
- Do not publish a claim, employer/client attribution, or project detail without
  Marco's review.
- Hosting-provider and runtime disclosure belongs only in the approved bilingual
  privacy implementation and its generated pages.
- Never commit secrets or modify production systems from this repository.

## Checks

Use the repository-local environment and run the relevant checks before every
handoff. For broad changes run `pnpm verify:site` and the complete browser suite.
Leave changes uncommitted until the exact commit message and scope have been
reviewed by Marco; keep commits focused and signed.

## Skills

The four repository-local skills under `.agents/skills/` own repeatable
localized-content, case-study, dependency-update, and verification workflows.
Do not turn broad repository rules into skills.
