---
translationKey: cocon-client
locale: en
title: Televic CoCon Client
summary: An asynchronous, typed Python client for the documented Televic CoCon REST API.
category: software
status: maintained
period: Ongoing
role: Author — developed for 3P Technologies S.r.l.
contribution: Built the asynchronous client, typed notification parser, and connection and command handling.
problem: Provide one asynchronous interface for sending CoCon commands and receiving notifications without repeating transport logic in every application.
approach: Long polling and command dispatch run independently, so incoming notifications do not block outgoing commands. Supported payloads become typed dataclasses, while retries, reconnection, and re-subscription stay inside the client.
technology:
  - Python
  - asyncio
  - aiohttp
  - Typed dataclasses
  - REST/JSON
outcome: A published library used internally as the foundation for CoCon Vote Monitor.
attribution: Developed for 3P Technologies S.r.l., which holds the copyright. Available under LGPL-3.0-or-later or a commercial licence. CoCon and related trademarks belong to Televic Conference NV; the project is independent and not affiliated with Televic.
links:
  - label: Source repository
    url: https://github.com/3P-Technologies/cocon_client
featured: true
draft: false
noindex: false
---

## One boundary for CoCon

I built the client so application code can work with commands and typed events instead of managing long polling, retries, and reconnections itself. Its `async with` API handles setup and teardown, while subscriptions and callbacks keep notification handling straightforward.

The notification registry keeps support for new payload types in one place, and restored subscriptions let applications continue after a connection interruption. The same client later became the foundation for CoCon Vote Monitor.
