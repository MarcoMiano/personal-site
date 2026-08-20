---
name: update-site-dependencies
description: Review and safely update the personal site's pinned JavaScript dependencies and transitive security overrides. Use when checking for package updates, upgrading Astro or another direct dependency, responding to a dependency advisory, refreshing pnpm-lock.yaml, or validating Dependabot suggestions.
---

# Update Site Dependencies

Keep updates narrow, attributable, and reproducible. Never perform a blanket latest-version upgrade.

## Inspect

1. Read `AGENTS.md`, `package.json`, `pnpm-workspace.yaml`, and the relevant README dependency notes.
2. Run `git status --short` and preserve unrelated worktree changes.
3. Use the repository `.conda/` environment. Verify Node and pnpm satisfy `package.json`; never install tools into Conda `base`.
4. Query the registry for current stable versions and read official release notes. For technical decisions, use only the package registry and project-maintainer sources.
5. Classify each proposed update:
   - Apply patch and compatible minor updates independently.
   - Stop and present a migration plan before a major update or documented breaking change.
   - Ignore prereleases unless Marco explicitly requests one.

## Update

1. Preserve whether each package belongs in `dependencies` or `devDependencies`.
2. Update exact pins with pnpm, one package or tightly coupled package set at a time. Do not hand-edit lockfile resolutions.
3. Inspect the manifest and lockfile diff for unrelated churn, unexpected lifecycle scripts, new native packages, or dependency growth.
4. Run `pnpm audit --audit-level high` after any lockfile change.
5. If the audit fails, trace the dependency path. Prefer an upstream direct-package update. Use a narrow `pnpm-workspace.yaml` override only when the patched version satisfies the parent range and document why it exists in the README. Never suppress or waive an advisory merely to pass the gate.

## Validate

1. Read and run `$verify-personal-site` after the final dependency graph is installed.
2. Run `pnpm test:browser` when Astro, Playwright, build tooling, generated output, or client behavior can be affected.
3. If a new package behavior breaks repository tooling, fix the integration explicitly; do not weaken an existing check.
4. Run `git diff --check`, inspect `git status --short`, and review the complete dependency diff.

Report:

```text
Updated: package old -> new
Release review: compatible|migration required
Quality gate: PASS|FAIL
Output safety scan: PASS|FAIL
Browser tests: PASS|FAIL|NOT RUN
Dependency audit: PASS|FAIL
Remaining issue: none|concise explanation
```

Leave all changes uncommitted. Follow the repository's message-and-scope approval procedure before creating a signed commit.
