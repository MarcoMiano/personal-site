---
translationKey: cocon-vote-monitor
locale: it
title: CoCon Vote Monitor
summary: Vista web in tempo reale dello stato della riunione e dei risultati di voto ricevuti da un sistema Televic CoCon.
category: software
status: maintained
period: In corso
role: Autore — sviluppo per 3P Technologies S.r.l.
contribution: Sviluppo dell'applicazione web, mappatura delle notifiche CoCon nello stato della pagina e aggiornamenti in tempo reale per i browser collegati.
problem: Fornire una vista chiara della riunione, del punto all'ordine del giorno e dei risultati di voto correnti.
approach: L'applicazione mantiene sul server lo stato della riunione e della votazione e invia uno snapshot completo a ogni nuovo display collegato. I WebSocket trasportano gli aggiornamenti successivi e la vista standard può aprire il flusso di stampa del browser alla chiusura della votazione.
technology:
  - Python
  - Starlette
  - Uvicorn
  - WebSocket
  - cocon_client
outcome: Applicazione pubblica e configurabile che visualizza stato della riunione, punto all'ordine del giorno, risultati per delegato e conteggi aggregati.
attribution: Sviluppato per 3P Technologies S.r.l., che ne detiene il copyright. Rilasciato con licenza AGPL-3.0-or-later. CoCon e i relativi marchi appartengono a Televic Conference NV.
links:
  - label: Repository sorgente
    url: https://github.com/3P-Technologies/cocon_vote_monitor
featured: false
draft: false
noindex: false
---

## Una vista in tempo reale di ogni votazione

Ho sviluppato il monitor come applicazione complementare a `cocon_client`. Mantenere lo stato corrente sul server permette a un nuovo display di ricevere subito la vista completa della riunione e della votazione; i display già collegati restano aggiornati tramite WebSocket, senza polling o refresh della pagina.

Alla chiusura della votazione, la vista standard può aprire automaticamente il flusso di stampa del browser. `/noautoprint` mantiene la stessa vista in tempo reale senza attivarlo.
