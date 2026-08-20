---
translationKey: cocon-vote-monitor
locale: en
title: CoCon Vote Monitor
summary: A live browser view of meeting state and voting results received from a Televic CoCon system.
category: software
status: maintained
period: Ongoing
role: Author — developed for 3P Technologies S.r.l.
contribution: Built the web application, mapped CoCon notifications into page state, and added live updates for connected browsers.
problem: Provide a clear browser view of the current meeting, agenda item, and voting results.
approach: The application keeps meeting and voting state on the server and sends a complete snapshot to each newly connected display. WebSockets carry subsequent updates, and the standard view can open the browser print flow when voting closes.
technology:
  - Python
  - Starlette
  - Uvicorn
  - WebSocket
  - cocon_client
outcome: A public, configurable application that displays meeting state, agenda item, per-delegate results, and aggregate counts.
attribution: Developed for 3P Technologies S.r.l., which holds the copyright. Released under AGPL-3.0-or-later. CoCon and related trademarks belong to Televic Conference NV.
links:
  - label: Source repository
    url: https://github.com/3P-Technologies/cocon_vote_monitor
featured: false
draft: false
noindex: false
---

## A live view of each vote

I built the monitor as a focused companion to `cocon_client`. Keeping the current state on the server means a newly connected display immediately receives the full meeting and voting view; existing displays stay current through WebSocket updates instead of polling or refreshing the page.

When voting closes, the standard view can open the browser print flow automatically. `/noautoprint` keeps the same live view without triggering it.
