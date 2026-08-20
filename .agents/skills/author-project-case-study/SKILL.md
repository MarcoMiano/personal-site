---
name: author-project-case-study
description: Draft or revise evidence-bound bilingual project case studies for the personal site's Astro projects collection. Use when turning approved repositories, private evidence, or Marco-supplied facts into Italian and English project entries with synchronized structure, precise contribution and organizational attribution, confidentiality review, and draft/publication controls.
---

# Author Project Case Study

Produce concise Italian and English case studies that distinguish Marco's work
from organizational ownership and disclose only approved facts.

## Workflow

1. Read `AGENTS.md`, `src/content.config.ts`, and both existing entries when
   revising a case study.
2. Inspect the authorized evidence. Separate:
   - facts directly supported by public or private evidence;
   - wording and claims explicitly approved by Marco;
   - unresolved claims, dates, outcomes, attribution, or confidentiality risks.
3. Stop for Marco's review when an unresolved item would materially change the
   public claim. Never infer authorship or contribution from repository access or
   organizational ownership.
4. Use one stable lowercase hyphenated `translationKey` and paired
   `<translationKey>-it.md` and `<translationKey>-en.md` files.
5. Populate every project-schema field. State the role, individual contribution,
   outcome, and organizational attribution separately. Prefer concrete scope and
   constraints over promotional language.
6. Add a short Markdown narrative only when it provides context beyond the
   structured fields. Keep both languages equivalent in factual scope without
   forcing literal translation.
7. Treat non-public evidence, credentials, operational configuration, customer
   identifiers, and source metadata as evidence only. Publish only approved
   aggregates or descriptions and never reproduce non-public implementation
   details.
8. Set new or unapproved pairs to `draft: true` and `noindex: true`. Change both
   flags in both languages only after Marco explicitly approves the claims,
   translations, attribution, and confidentiality boundary.

## Validation

Run from the repository root:

```sh
node .agents/skills/add-localized-content/scripts/check-localized-pairs.mjs
pnpm format:check
pnpm check
pnpm build
```

Before publication or a broad handoff, run `pnpm verify:site`. Do not weaken a
schema, safety scan, or publication rule to make an entry pass.

## Handoff

Report the evidence used, claims deliberately omitted, translation or
attribution decisions still needing review, publication flags, changed files,
and validation results. Leave changes uncommitted until Marco approves an exact
commit message and scope.
