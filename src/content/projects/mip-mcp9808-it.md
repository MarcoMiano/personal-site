---
translationKey: mip-mcp9808
locale: it
title: Driver MicroPython per MCP9808
summary: Driver MicroPython installabile e in un singolo file per leggere e configurare via I2C il sensore di temperatura Microchip MCP9808.
category: software
status: maintained
period: 2024–presente
role: Autore
contribution: Progettazione e sviluppo del driver orientato ai registri e della sua API pubblica, seguiti dall'architettura v2, dalla pacchettizzazione MicroPython, dal modello simulato dei registri e dall'infrastruttura di test hardware su Pico W.
problem: Esporre temperatura, risoluzione, modalità a basso consumo e funzioni di allarme dell'MCP9808 attraverso un'interfaccia MicroPython portabile e dai costi prevedibili sui microcontrollori con risorse limitate.
approach: Modellare ogni sensore come oggetto MCP9808 associato a un bus I2C compatibile e a un indirizzo, mappare i registri a 8 e 16 bit su operazioni esplicite, riutilizzare buffer di trasferimento fissi ed esporre configurazione in cache e percorsi interi o in virgola mobile per la temperatura.
technology:
  - MicroPython
  - Python
  - I2C
  - Raspberry Pi Pico W
  - Microchip MCP9808
  - mpremote
  - Python unittest
outcome: Versione 2.0.0 pubblicata con metadati per mip e per l'inclusione come modulo frozen nel firmware, tag con versionamento semantico, test senza dipendenze basati su un modello dei registri, test hardware su Pico W e una guida implementativa al datasheet.
attribution: Progetto open source personale di Marco Miano, rilasciato con licenza MIT. MCP9808 è un prodotto di Microchip Technology; il progetto è indipendente e non è affiliato né approvato da Microchip Technology.
links:
  - label: Repository sorgente
    url: https://github.com/MarcoMiano/mip-mcp9808
featured: false
draft: false
noindex: false
---

## Modello del driver orientato ai registri

Un'istanza `MCP9808` associa un oggetto compatibile con I2C a un indirizzo esplicito a sette bit oppure calcolato dai pin A0, A1 e A2. Il modulo definisce direttamente indirizzi dei registri e maschere di configurazione, senza dipendere da classi `machine.I2C` concrete, e usa un buffer da due byte e uno da un byte per tutti i trasferimenti.

Il registro di configurazione è rappresentato come uno snapshot in cache. `refresh()` esegue una lettura esplicita e aggiorna le proprietà di isteresi, spegnimento, blocco, allarme, polarità e modalità; i setter compongono i relativi campi di bit, scrivono il registro e aggiornano lo snapshot. La verifica opzionale dell'identità legge gli identificativi Microchip del produttore e del dispositivo senza rendere obbligatorie queste transazioni per ogni percorso di inizializzazione.

La temperatura segue la rappresentazione firmata del registro in sedicesimi di grado, affiancata da un wrapper in gradi Celsius per comodità. Anche le soglie di allarme dispongono di operazioni esatte in quarti di grado oltre all'API in virgola mobile. La stessa interfaccia copre risoluzione, stato a basso consumo, isteresi, funzionamento come comparatore o interrupt, polarità, selezione delle soglie e blocchi dei registri azzerabili solo spegnendo e riaccendendo l'MCP9808.

## Infrastruttura di pacchettizzazione e test

Il repository separa distribuzione e validazione: `package.json` supporta l'installazione tramite `mip`, mentre `manifest.py` permette di includere il modulo nel firmware MicroPython con un livello di ottimizzazione che conserva i numeri di riga. Tag versionati e changelog distinguono l'API originale dall'interfaccia v2 con modifiche incompatibili.

I test host usano una mappa dei registri `FakeI2C` senza dipendenze che modella identificativi, temperature, flag di allarme, blocchi di configurazione, bit di cancellazione interrupt autoazzerante e conteggio delle transazioni. Una suite separata su Pico W esercita il ciclo di alimentazione, il sensore fisico e l'uscita di allarme; uno script sul dispositivo resta disponibile per misure ripetibili di tempo e allocazioni senza trasformare uno specifico risultato di benchmark nell'esito principale del progetto.
