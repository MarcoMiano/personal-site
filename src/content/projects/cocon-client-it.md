---
translationKey: cocon-client
locale: it
title: Client Televic CoCon
summary: Client Python asincrono e tipizzato per le API REST documentate di Televic CoCon.
category: software
status: maintained
period: In corso
role: Autore — sviluppo per 3P Technologies S.r.l.
contribution: Sviluppo del client asincrono, del parser tipizzato delle notifiche e della gestione di connessioni e comandi.
problem: Fornire un'unica interfaccia asincrona per inviare comandi CoCon e ricevere notifiche, senza ripetere la gestione del trasporto in ogni applicazione.
approach: Long polling e invio dei comandi procedono separatamente, così le notifiche in ingresso non bloccano i comandi in uscita. I payload supportati diventano dataclass tipizzate, mentre retry, riconnessione e ripristino delle sottoscrizioni restano interni al client.
technology:
  - Python
  - asyncio
  - aiohttp
  - Dataclass tipizzate
  - REST/JSON
outcome: Libreria pubblicata e utilizzata internamente come base per CoCon Vote Monitor.
attribution: Sviluppato per 3P Technologies S.r.l., che ne detiene il copyright. Disponibile con licenza LGPL-3.0-or-later o commerciale. CoCon e i relativi marchi appartengono a Televic Conference NV; il progetto è indipendente e non affiliato a Televic.
links:
  - label: Repository sorgente
    url: https://github.com/3P-Technologies/cocon_client
featured: true
draft: false
noindex: false
---

## Un solo punto di accesso a CoCon

Ho sviluppato il client perché il codice applicativo potesse lavorare con comandi ed eventi tipizzati, senza occuparsi direttamente di long polling, retry e riconnessioni. L'API basata su `async with` gestisce apertura e chiusura, mentre sottoscrizioni e callback mantengono semplice la gestione delle notifiche.

Il registro delle notifiche raccoglie in un solo punto il supporto ai diversi payload, mentre il ripristino delle sottoscrizioni permette alle applicazioni di proseguire dopo un'interruzione della connessione. Lo stesso client è poi diventato la base di CoCon Vote Monitor.
