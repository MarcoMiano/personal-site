---
translationKey: personal-site
locale: it
title: miano.cloud
summary: Sito personale statico bilingue, con un'interfaccia ispirata ai terminali e un runtime volutamente ridotto.
category: software
status: maintained
period: 2026–in corso
role: Progettazione e sviluppo
contribution: Definizione dell'architettura, della struttura dei contenuti, del sistema visivo, della base di accessibilità e del flusso di verifica automatica.
problem: Presentare un percorso tecnico vario senza trasformare il sito in un modello di curriculum tradizionale o in una caricatura a tema terminale.
approach: Generare pagine statiche da contenuti bilingui tipizzati, mantenere navigazione e lettura funzionanti senza JavaScript e riservare gli script client a tema, tastiera ed effetti iniziali facoltativi.
technology:
  - Astro
  - TypeScript
  - CSS nativo
  - Playwright
  - GitHub Actions
outcome: Sito bilingue pubblicato con CV e casi di studio, supportato da controlli sull'output statico e test cross-browser.
attribution: Progetto personale ideato e realizzato da Marco Miano con sviluppo assistito da Codex. Il codice sorgente è disponibile con licenza MIT; contenuti e risorse d'identità restano copyright Marco Miano.
links:
  - label: Repository sorgente
    url: https://github.com/MarcoMiano/personal-site
featured: true
draft: false
noindex: false
---

<aside class="case-study-callout">
  <strong>[!] QUESTO SITO</strong>
  <span>Stai leggendo il progetto dall'interno del progetto.</span>
</aside>

## Statico per scelta

Ho scelto un'architettura statica perché il sito non richiede account, database o application server. Astro trasforma i contenuti bilingui in normali pagine HTML, mentre il piccolo livello client aggiunge soltanto controlli ed effetti facoltativi.

L'interfaccia riprende elementi di terminali ed editor di testo senza sostituire il comportamento abituale del web. I link restano link, le pagine funzionano senza JavaScript, le animazioni possono essere disattivate e gli stessi contenuti si adattano a schermi stretti e alla stampa.

Il repository pubblico contiene il sorgente del sito e il relativo flusso di verifica. I controlli automatici coprono formattazione, tipi, route generate, sicurezza di pubblicazione, comportamento responsive, interazione da tastiera e i tre motori browser.
