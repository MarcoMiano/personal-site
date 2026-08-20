---
translationKey: personal-site
locale: en
title: miano.cloud
summary: A bilingual static personal site with a restrained terminal-inspired interface and a deliberately small runtime.
category: software
status: maintained
period: 2026–ongoing
role: Designer and developer
contribution: Defined the architecture, content structure, visual system, accessibility baseline, and automated verification workflow.
problem: Present a varied technical background without turning the site into either a conventional résumé template or a terminal-themed novelty.
approach: Build static pages from typed bilingual content, keep navigation and reading functional without JavaScript, and reserve client scripts for optional theme, keyboard, and first-session enhancements.
technology:
  - Astro
  - TypeScript
  - Native CSS
  - Playwright
  - GitHub Actions
outcome: A deployed bilingual site with a public CV and project case studies, backed by static-output checks and cross-browser tests.
attribution: Personal project designed and built by Marco Miano with Codex-assisted development. Source code is available under the MIT License; site content and identity assets remain copyright Marco Miano.
links:
  - label: Source repository
    url: https://github.com/MarcoMiano/personal-site
featured: true
draft: false
noindex: false
---

<aside class="case-study-callout">
  <strong>[!] THIS SITE</strong>
  <span>You are reading the project from inside the project.</span>
</aside>

## Static by default

I chose a static architecture because the site does not need accounts, a database, or an application server. Astro turns the bilingual content into ordinary HTML pages, while the small client-side layer only adds optional controls and effects.

The interface borrows from terminals and text editors without replacing familiar web behaviour. Links remain links, the pages work without JavaScript, motion can be disabled, and the same content adapts to narrow screens and print.

The public repository contains the website source and its verification workflow. Automated checks cover formatting, types, generated routes, publication safety, responsive behaviour, keyboard interaction, and the three browser engines.
