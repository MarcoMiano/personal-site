# Public repository guidance

## Project intent

- Maintain Marco Miano's bilingual personal website for employers, collaborators, and technical peers.
- Present software, low-level hardware, AV automation, and infrastructure work with a technical, dry, and occasionally playful professional voice.
- Prefer a restrained terminal/TUI character, readable information density, and ordinary web semantics over novelty effects.

## Architecture

- Use Astro static output, strict TypeScript, pnpm, native CSS, and small framework-free client scripts.
- Keep content and navigation functional without JavaScript; client code is progressive enhancement.
- Use typed Astro content collections. Markdown is the default content format.
- Keep dependencies few and document every non-trivial dependency.
- Do not add a server adapter, database, accounts, realtime service, or private API integration without a new architecture decision.

## Localization and content

- Italian is the default language and English mirrors published routes under `/en/`.
- Keep shared UI strings in typed locale dictionaries.
- Publish paired Italian and English entries with a stable translation key.
- Keep new or unresolved entries drafted and `noindex` until both languages, facts, attribution, and confidentiality are reviewed.
- Separate Marco's contribution from employer or organization ownership. Never infer authorship from repository access.

## Design and accessibility

- Preserve the Solarized Dark and Solarized Light themes, with restrained pixel-style external marks.
- Use semantic landmarks, visible focus, skip navigation, keyboard-operable controls, and responsive layouts.
- Honor `prefers-reduced-motion`; decorative effects must never delay access or obscure content.
- Keep the site fast, usable with JavaScript disabled, and free of forced sound or autoplay.

## Publication safety

- Never commit private source documents, certificates, credentials, raw source metadata, or direct personal contact data.
- The public CV omits street address, phone number, full birth date, and birthplace.
- Do not publish a claim, employer/client attribution, or project detail without Marco's review.
- Hosting-provider and runtime disclosure belongs only in the approved bilingual privacy implementation and its generated pages.
- Never commit secrets or modify production systems from this repository.

## Collaboration and change discipline

- Delegate every concrete, bounded task that a less powerful model/reasoning pair can complete reliably to an appropriate subagent, minimizing token use while preserving quality.
- Keep project management, architecture, scope, safety review, and final integration decisions with the lead agent.
- Do not delegate when coordination or verification would cost more than completing the work directly.
- Before spawning a subagent, classify the work by complexity, ambiguity, risk, and verification cost. Select both the model and reasoning effort explicitly; do not inherit the lead configuration without considering the task.
- Prefer GPT-5.6 Luna at low or medium reasoning for mechanical searches, inventories, formatting, straightforward checks, and tightly specified edits.
- Prefer GPT-5.6 Terra at medium or high reasoning for bounded implementation, debugging, translation review, test design, and audits requiring judgement.
- Reserve GPT-5.6 Sol at high reasoning or above for architecture, difficult integration, high-risk security work, or ambiguity that genuinely needs the lead model. The lead remains responsible for reviewing the result.
- Use GPT-5.3 Codex Spark only in exceptional latency-sensitive cases, when it is available and the task is narrow, mechanical, and cheaply verifiable.
- Give every subagent a concrete scope, constraints, expected output, and validation target appropriate to the selected model/reasoning pair.
- Preserve unrelated work and leave changes uncommitted until Marco approves the exact commit message and file scope. Keep commits focused and signed.

## Checks

Use the repository-local environment and run the relevant checks before every handoff. For broad changes run `pnpm verify:site` and the complete browser suite.

The repository-local `.conda` environment is deliberately Node-only. For repository-adjacent Python work such as creating or validating Codex skills, use or create a separate named Conda environment outside the checkout (for example `codex-tools`). Never install that tooling in Conda `base`, and do not add it to `environment.yml` unless it becomes part of the site's build or test path.

## Skills

The four repository-local skills under `.agents/skills/` own repeatable localized-content, case-study, dependency-update, and verification workflows. Do not turn broad repository rules into skills.
