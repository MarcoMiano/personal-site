---
name: add-localized-content
description: Create or update paired Italian and English entries in the personal site's Astro content collections. Use for projects, notes, lab entries, or structured CV content when translation keys, filenames, draft/noindex state, evidence boundaries, attribution, and schema validation must remain synchronized.
---

# Add Localized Content

Create bilingual content pairs without inventing facts or weakening publication controls.

Use [`docs/CONTENT_AUTHORING.md`](../../../docs/CONTENT_AUTHORING.md) for the content map, complete paired fictional examples, and the detailed safe authoring workflow.

## Workflow

1. Read `AGENTS.md`, `src/content.config.ts`, and the relevant existing collection entries.
2. Identify the evidence approved for the entry. Separate sourced facts, user-approved wording, and unresolved questions. Stop for Marco's review if dates, roles, attribution, confidentiality, or translation meaning are unclear.
3. Choose one stable lowercase hyphenated `translationKey`. For Markdown collections, use matching `<translationKey>-it.md` and `<translationKey>-en.md` filenames.
4. Create or update both locales together. Keep factual scope and field meaning equivalent; translations need not be literal.
5. Populate every schema field. Use Markdown unless interactive embedded components genuinely require MDX.
6. Default new or unapproved content to `draft: true` and `noindex: true`. Never make a draft indexable. Change publication flags only after explicit review of both languages.
7. For employer or organization work, state Marco's role and contribution separately from organizational ownership. Do not infer authorship from a public repository.
8. Never copy non-public evidence, direct personal contact data, certificate identifiers, or source-document metadata into content or `public/`.
9. Notes and Lab are intentionally dormant. Do not activate either collection as part of a content-only change; the first entry requires the separately reviewed rendering, navigation, indexing, and verification work described in the authoring runbook.

## Validation

From the repository root, run:

```sh
node .agents/skills/add-localized-content/scripts/check-localized-pairs.mjs
pnpm format:check
pnpm check
pnpm build
```

Before a broad handoff or publication-state change, use `$verify-personal-site` as the final gate.

The pair checker validates filenames, locale values, translation-key uniqueness, complete public pairs, and synchronized draft/noindex flags for Markdown collections. Astro owns the full content schema validation.

## Output

Report:

- files added or changed;
- evidence used and unresolved claims;
- translation and attribution decisions needing review;
- pair-check, type-check, build, and publication-safety results.
