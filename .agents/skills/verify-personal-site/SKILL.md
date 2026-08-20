---
name: verify-personal-site
description: Run the personal site's repeatable quality and publication-safety gate. Use before handing off broad code or content changes, after dependency or build configuration changes, before a review milestone, and when asked to verify, validate, check, or audit the Astro site.
---

# Verify Personal Site

Run the same code-quality and generated-output checks for every meaningful handoff.

## Preconditions

1. Run `node --version` and `pnpm --version`.
2. Require the versions declared in the repository-root `package.json`.
3. If either command is unavailable or incompatible, stop and report the prerequisite. Point to the root README setup section; do not install a runtime or package manager unless the user has authorized environment changes.

## Workflow

1. Read the repository-root `AGENTS.md` and honor any newer safety constraints.
2. Run from the repository root:

   ```sh
   node .agents/skills/verify-personal-site/scripts/verify-site.mjs
   ```

3. The script checks both the tracked public source and generated output. If it fails, fix only issues within the current task's scope. Do not weaken checks, approve new public data, or remove safety patterns merely to make the gate pass.
4. Rerun the script after fixes.
5. Inspect `git diff --check` and `git status --short` so the handoff distinguishes task changes from user-owned files.
6. Report results using this compact shape:

   ```text
   Quality gate: PASS|FAIL
   Output safety scan: PASS|FAIL
   Dependency audit: PASS|FAIL|NOT RUN
   Remaining issue: none|concise explanation
   ```

## Boundaries

- The bundled script runs the local deterministic checks; it does not perform the network-dependent dependency audit.
- Run `pnpm audit --audit-level high` when dependencies or the lockfile change and network access is authorized.
- Treat a clean scan as evidence only for its encoded rules, not as permission to publish source documents, contact details, or employer/client claims.
- Never modify DNS, hosting, external repositories, or production systems as part of verification.
