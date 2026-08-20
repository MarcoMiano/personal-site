# Content authoring runbook

This guide explains how to edit the bilingual CV and project content safely. It also documents the retained Notes and Lab schemas, even though those collections are not currently published.

## Terminology and language rules

The schema calls items such as `translationKey`, `draft`, and `role` **fields** or **keys**. They may feel like arguments when authoring an entry, but they are properties in JSON or YAML frontmatter.

All field names stay in English in both locale files. Do not translate keys such as `title`, `summary`, `role`, or `draft`. Translate their human-readable values:

- Italian files use `locale: it` and Italian prose.
- English files use `locale: en` and English prose.
- Stable identifiers, translation keys, categories, statuses, dates, URLs, and technology names normally remain equivalent between the pair.
- The translations must express the same approved facts, but they do not need to be literal sentence-by-sentence copies.

## Publication and evidence boundary

Publish only information Marco has reviewed for factual accuracy, attribution, translation meaning, and confidentiality. Treat private material as evidence, not as content to copy into the repository.

Never add credentials, certificate identifiers, direct personal contact data, private source metadata, customer identifiers, internal configuration, or operational procedures. Repository access, an employer name, or a public link does not prove authorship.

For employer, customer, or organizational work, keep these claims separate:

- **Role:** Marco's position or assignment.
- **Contribution:** what Marco personally did.
- **Outcome:** the approved, observable result.
- **Attribution:** who commissioned, owns, maintains, or is otherwise responsible for the work.

If any date, scope, outcome, ownership claim, translation, or confidentiality boundary is uncertain, keep the content unpublished and request review.

## Content locations

| Content | Location | Format | Pairing rule |
| --- | --- | --- | --- |
| Route and interface copy | `src/lib/` and the rendering component | TypeScript/Astro | Update Italian and English values together. |
| CV | `src/content/cv/it.json` and `src/content/cv/en.json` | JSON | Fixed `public-cv` key; matching stable IDs and order. |
| Projects | `src/content/projects/<key>-it.md` and `<key>-en.md` | Markdown with YAML frontmatter | Matching lowercase hyphenated translation key. |
| Notes | `src/content/notes/` | Markdown with YAML frontmatter | Dormant; adding a file does not publish it. |
| Lab | `src/content/lab/` | Markdown with YAML frontmatter | Dormant; adding a file does not publish it. |

`src/content.config.ts` is the schema source of truth. Astro validates field types and allowed values. The localized-pair checker validates filenames, locales, translation-key grouping, publication flags, and required public pairs.

## How a bilingual pair works

Use the same English field names, `translationKey`, stable IDs, field meaning, and item order. Change `locale` and localize only the reader-facing values. This abbreviated example demonstrates pairing; it is not a complete project entry.

Italian file, `fictional-console-it.md`:

```yaml
translationKey: fictional-console
locale: it
title: Console fittizia
summary: Interfaccia dimostrativa basata su dati sintetici.
role: Sviluppatore del prototipo
draft: true
noindex: true
```

English file, `fictional-console-en.md`:

```yaml
translationKey: fictional-console
locale: en
title: Fictional console
summary: Demonstration interface based on synthetic data.
role: Prototype developer
draft: true
noindex: true
```

The keys remain English. `fictional-console`, the field order, and the factual meaning match; the visible prose changes language.

## Shared Markdown fields

Projects, Notes, and Lab entries all include these frontmatter fields.

| Field | Type and requirement | Meaning and behavior |
| --- | --- | --- |
| `translationKey` | Non-empty string, required | Stable identity shared by the Italian and English files. Use lowercase hyphenated text and do not change it merely because the visible title changes. |
| `locale` | `it` or `en`, required | Language of reader-facing values. It must match the filename suffix. |
| `title` | Non-empty string, required | Reader-facing entry title, localized in each file. |
| `summary` | Non-empty string, required | Short localized description used by listings or introductory UI. It should state scope without unsupported claims. |
| `draft` | Boolean, defaults to `true`; repository policy requires it to be explicit | Editorial readiness. `true` means the content or its review is incomplete and it must not be published. |
| `noindex` | Boolean, defaults to `true`; repository policy requires it to be explicit | Publication/indexing permission. `true` means the entry must stay off indexable public surfaces even if its prose is otherwise complete. |

### `draft` and `noindex` are different controls

`draft` answers **“is this editorially ready?”**. `noindex` answers **“may this appear on an indexable public surface?”**. They are not interchangeable, and `noindex` is not useless when `draft` is `false`.

The current project renderers deliberately include an entry only when both fields are `false`. Projects do not have individual HTML routes today, so `noindex` is currently enforced by withholding the entry from the homepage and `/projects/`, not by adding a per-project robots meta tag.

| `draft` | `noindex` | Valid? | Current project behavior | Intended use |
| --- | --- | --- | --- | --- |
| `true` | `true` | Yes | Hidden | Safe default for new, incomplete, unverified, or confidentially unresolved work. |
| `true` | `false` | No | Pair checker fails | Contradictory state: unfinished content cannot be approved for indexing. |
| `false` | `true` | Yes | Hidden | Reviewed content intentionally withheld while publication, attribution, timing, or route decisions remain pending. |
| `false` | `false` | Yes | Eligible to render | Fully reviewed content approved for the current public project surfaces. |

Italian and English files in a complete pair must have matching `draft` and `noindex` values. The checker requires both locales before any Markdown entry with `draft: false` can be publishable. Project policy is stricter than the checker for initial authoring: create and review both languages together.

Notes and Lab have no active renderer, so their flags currently publish nothing. Their future routes must define and test equivalent behavior before either collection is enabled.

## CV reference

The CV uses JSON. Its two files are fixed at `src/content/cv/it.json` and `src/content/cv/en.json`. Unlike Markdown collections, the CV schema does not have `draft` or `noindex`; the routes are already public, so edit both files as one reviewed change.

### CV root fields

| Field | Type and requirement | Meaning |
| --- | --- | --- |
| `translationKey` | Literal string `public-cv`, required | Fixed identity connecting both CV files. Do not invent a new key. |
| `locale` | `it` or `en`, required | Must match `it.json` or `en.json`. |
| `headline` | Non-empty string, required | Primary professional headline displayed in the profile panel. |
| `summary` | Non-empty string, required | Short professional overview. Keep scope and claims equivalent across locales. |
| `location` | Non-empty string, required | Approved public location wording; never add a street address. |
| `experience` | Array, defaults to `[]` | Ordered employer or organization groups. Preserve equivalent IDs and ordering in both files. |
| `education` | Array, defaults to `[]` | Ordered education records. |
| `certifications` | Array, defaults to `[]` | Ordered certification records; do not publish certificate numbers. |
| `skills` | Array, defaults to `[]` | Ordered groups of skills or interests. |
| `languages` | Array, defaults to `[]` | Ordered spoken-language records. |

### Experience group fields

| Field | Type and requirement | Meaning |
| --- | --- | --- |
| `id` | Non-empty string, required | Stable internal identifier shared by both locales. Prefer lowercase hyphenated text. |
| `employer` | Non-empty string, required | Approved organization name. Naming the organization does not imply ownership of its work. |
| `period` | Non-empty string, required | Localized display period, for example `03/2024–present`. The site prints it exactly as written. |
| `startMonth` | Optional `YYYY-MM` string | Machine-readable start month used to calculate and display current tenure at build time. |
| `duration` | Optional non-empty string | Fixed localized tenure when automatic calculation is inappropriate, for example `2 years`. |
| `roles` | Non-empty array, required | Ordered roles or assignments within the experience group. |

Every experience group must contain `startMonth`, `duration`, or both. Prefer `startMonth` for an ongoing role with a precise approved start month. Prefer `duration` for completed or approximate history where a fixed public statement is clearer. `period` is still required because it is the visible date range; `startMonth` and `duration` provide the separate tenure value.

### Role fields

| Field | Type and requirement | Meaning |
| --- | --- | --- |
| `id` | Non-empty string, required | Stable role identity shared across locales. |
| `title` | Non-empty string, required | Localized role or assignment title. Keep official titles unchanged when translation would be misleading. |
| `period` | Non-empty string, required | Localized visible date range for this role. |
| `assignment` | Optional non-empty string | Clarifies a project assignment, secondment, or organizational context without folding it into the job title. |
| `relatedProject` | Optional non-empty string | Must exactly equal the `translationKey` of an existing project pair. It creates the CV-to-project link. |
| `summary` | Non-empty string, required | Concise description of scope and responsibility. |
| `highlights` | String array, defaults to `[]` | Specific contributions or responsibilities. Empty is valid; every item must be a non-empty localized string. |

### Education fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | Non-empty string | Stable identity shared across locales. |
| `qualification` | Non-empty string | Localized qualification name without private document identifiers. |
| `institution` | Non-empty string | Approved institution name. |
| `period` | Non-empty string | Localized visible study period. |

### Certification fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | Non-empty string | Stable identity shared across locales. |
| `name` | Non-empty string | Public certification name. |
| `issuer` | Non-empty string | Issuing organization. The current CV view does not display this field, but it remains structured data and must be accurate. |

### Skill-group fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | Non-empty string | Stable group identity shared across locales. |
| `label` | Non-empty string | Localized visible group heading. |
| `items` | Non-empty string array | Localized skills displayed in the listed order. Product and technology names may remain unchanged. |

### Language fields

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | Non-empty string | Stable identity, such as `italian` or `english`. |
| `name` | Non-empty string | Localized language name. |
| `proficiency` | Non-empty string | Localized, approved proficiency wording. |

### Complete English CV example

This fictional example exercises every CV object type. It is not a claim about Marco or any real organization.

```json
{
  "translationKey": "public-cv",
  "locale": "en",
  "headline": "Software developer and systems integrator",
  "summary": "Technical professional working across software and systems integration.",
  "location": "Example City, Italy",
  "experience": [
    {
      "id": "northstar-systems",
      "employer": "Northstar Systems Ltd.",
      "period": "03/2024–present",
      "startMonth": "2024-03",
      "roles": [
        {
          "id": "northstar-platform-engineer",
          "title": "Platform Engineer",
          "period": "03/2024–present",
          "assignment": "Assignment on a fictional control project.",
          "relatedProject": "fictional-control-console",
          "summary": "Develop configuration tools for demonstration systems.",
          "highlights": [
            "Defined reusable interfaces for synthetic data.",
            "Worked with the quality team on reproducible tests."
          ]
        }
      ]
    },
    {
      "id": "example-workshop",
      "employer": "Example Workshop Cooperative",
      "period": "2021–2023",
      "duration": "2 years",
      "roles": [
        {
          "id": "workshop-junior-developer",
          "title": "Junior Developer",
          "period": "2021–2023",
          "summary": "Supported development and testing of fictional internal tools.",
          "highlights": []
        }
      ]
    }
  ],
  "education": [
    {
      "id": "technical-diploma",
      "qualification": "Technical diploma in computing",
      "institution": "Example Technical Institute",
      "period": "2016–2021"
    }
  ],
  "certifications": [
    {
      "id": "example-foundations",
      "name": "Systems Foundations",
      "issuer": "Example Learning Institute"
    }
  ],
  "skills": [
    {
      "id": "software",
      "label": "Software",
      "items": ["TypeScript", "Python", "Automated testing"]
    },
    {
      "id": "systems",
      "label": "Systems",
      "items": ["Linux", "IP networking"]
    }
  ],
  "languages": [
    { "id": "italian", "name": "Italian", "proficiency": "Native" },
    {
      "id": "english",
      "name": "English",
      "proficiency": "Professional working proficiency"
    }
  ]
}
```

JSON does not allow comments or trailing commas. Property names and string values require double quotes. A syntactically valid file can still fail schema validation if a required field is missing or a value has the wrong shape.

## Project reference

Project files use Markdown with YAML frontmatter. A translation key such as `fictional-control-console` produces:

- `src/content/projects/fictional-control-console-it.md`
- `src/content/projects/fictional-control-console-en.md`

### Project fields

| Field | Type and allowed values | Meaning and behavior |
| --- | --- | --- |
| `translationKey` | Non-empty string | Stable pair identity and generated project anchor suffix. |
| `locale` | `it` or `en` | Must match the filename suffix. |
| `title` | Non-empty string | Localized visible project title. |
| `summary` | Non-empty string | Localized listing summary. |
| `draft` | Boolean | Editorial readiness; see the publication-control table above. |
| `noindex` | Boolean | Public/indexing approval; see the publication-control table above. |
| `category` | `software`, `av-automation`, or `infrastructure` | Stable classification used by project UI and filtering decisions. Do not translate the enum value. |
| `status` | `concept`, `active`, `complete`, `maintained`, or `archived` | Stable lifecycle state. Do not translate the enum value. |
| `period` | Non-empty string | Localized visible project period. |
| `role` | Non-empty string | Marco's role, separate from ownership and contribution. |
| `contribution` | Non-empty string | Work Marco personally performed. Avoid collective claims unless the team scope is explicit. |
| `problem` | Non-empty string | Approved problem or need the project addressed. |
| `approach` | Non-empty string | High-level method and constraints, excluding confidential implementation detail. |
| `technology` | String array | Technologies relevant to understanding the work. Empty is schema-valid, but list concrete tools when they add value. |
| `outcome` | Non-empty string | Approved result; do not turn intent or partial checks into a stronger result claim. |
| `attribution` | Non-empty string | Ownership, commissioning, maintenance, organizational responsibility, and licensing where relevant. |
| `links` | Array of link objects, defaults to `[]` | Approved public references. Empty is valid. |
| `media` | Array of media objects, defaults to `[]` | Reserved approved assets. The current project page does not render this array, so adding it does not display media yet. Empty is valid. |
| `featured` | Boolean, defaults to `false` | Requests homepage placement after publication. It does not override `draft` or `noindex`. |

Status meanings:

- `concept`: planned or exploratory work without a completed implementation.
- `active`: implementation or delivery is currently in progress.
- `complete`: the defined work is finished and is not presented as ongoing maintenance.
- `maintained`: usable work that continues to receive maintenance or updates.
- `archived`: retained for historical value but no longer actively maintained.

Link object fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `label` | Non-empty string | Localized accessible link label. |
| `url` | Absolute valid URL | Approved public destination. Never link private evidence. |

Media object fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `src` | Non-empty string | Path to an approved public asset. The schema does not prove that the file exists; build/output review must do so. |
| `alt` | Non-empty string | Localized alternative text describing the image's relevant information. Do not repeat nearby prose mechanically. |

The Markdown body follows the closing frontmatter delimiter. Use it for narrative context that the structured fields cannot express cleanly. It may be empty, but a concise explanation is usually useful for a case study.

### Complete English project example

```md
---
translationKey: fictional-control-console
locale: en
title: Fictional control console
summary: Interface prototype for viewing the state of a demonstration system.
category: software
status: concept
period: 2026
role: Prototype developer
contribution: Defined the interface, synthetic data model, and navigation tests.
problem: Make a demonstration system's state understandable without exposing real data.
approach: Model a small set of synthetic states and present them with ordinary accessible HTML elements.
technology:
  - TypeScript
  - HTML
  - CSS
outcome: Internal prototype ready for requirements review.
attribution: Fictional example for this guide; it does not describe a real project or organization.
links:
  - label: Example documentation
    url: https://example.test/control-console
media:
  - src: /images/example-control-console.webp
    alt: Fictional mock-up of the control console
featured: false
draft: true
noindex: true
---

## State without secrets

The prototype uses synthetic data only. The page focuses on the current state and keeps controls keyboard-operable.
```

When a project pair changes from hidden to published or changes `featured`, update `featuredProjectKeys` and `publishedProjectKeys` in `scripts/verify-static-site.mjs` to match the approved generated set. Do not change those expectations merely to conceal a missing pair or unresolved claim.

## Notes reference

Notes retain a schema for future technical articles but are dormant today. In addition to the shared Markdown fields, a Note defines:

| Field | Type and requirement | Meaning |
| --- | --- | --- |
| `publishedAt` | Date-compatible value, required | Intended publication date. Astro coerces a valid value to a date. It does not publish the dormant entry by itself. |
| `updatedAt` | Optional date-compatible value | Date of a meaningful revision, not every formatting edit. |
| `tags` | String array, defaults to `[]` | Stable topic labels for a future renderer. Decide localization behavior when the collection is activated. |
| `series` | Optional non-empty string | Groups related notes in a future series. |

## Lab reference

Lab retains a schema for experiments and partial technical work but is dormant today. In addition to the shared Markdown fields, a Lab entry defines:

| Field | Type and allowed values | Meaning |
| --- | --- | --- |
| `startedAt` | Date-compatible value, required | Start date of the experiment. It does not activate publication. |
| `updatedAt` | Optional date-compatible value | Date of the latest meaningful update. |
| `status` | `idea`, `experimenting`, `paused`, or `complete` | Experiment lifecycle. Do not translate the enum value. |
| `tags` | String array, defaults to `[]` | Stable topic labels reserved for a future renderer. |
| `repository` | Optional absolute URL | Approved public source repository. |
| `demo` | Optional absolute URL | Approved public demonstration. |

## Notes and Lab activation boundary

The Notes and Lab schemas are stored in `dormantCollections`, not the exported active `collections` map. Current `/notes/`, `/lab/`, `/en/notes/`, and `/en/lab/` routes are structural placeholders and do not query or render these collections. Adding Markdown alone publishes nothing.

Enabling either collection requires a separate reviewed change covering:

- moving the collection into the active export;
- rendering and empty/error behavior;
- Italian and English navigation;
- draft/noindex and metadata semantics;
- sitemap and search-engine indexing behavior;
- localized-pair rules;
- static and browser verification expectations.

Do not bundle activation into an otherwise content-only change.

## Safe authoring workflow

1. Edit both Italian and English entries together. Preserve translation keys, stable IDs, array order, factual scope, and publication flags.
2. Run the localized-pair checker:

   ```sh
   node .agents/skills/add-localized-content/scripts/check-localized-pairs.mjs
   ```

3. Format only the files you intended to edit. For example:

   ```sh
   pnpm exec prettier src/content/cv/en.json src/content/cv/it.json --write
   ```

4. Run Astro schema and TypeScript checks, then build:

   ```sh
   pnpm check
   pnpm build
   ```

5. Review the affected Italian and English routes locally. Check wording, ordering, links, attribution, and narrow-screen layout.
6. Run the full deterministic gate and browser suite:

   ```sh
   pnpm verify:site
   pnpm test:browser:all
   ```

7. Review `draft`, `noindex`, `featured`, attribution, confidentiality, and the final diff. A passing scanner validates only its encoded rules; it does not approve a public claim.
8. Leave changes uncommitted until Marco approves the exact signed commit scope and message.

Do not weaken a schema, pair check, safety scan, or static expectation merely to make an entry pass.
