# Project Hail Mary — Science Lab

Un atlante interattivo in italiano per esplorare la fisica del romanzo di Andy Weir. Ogni modulo parte da un’intuizione quotidiana, propone un esperimento, esplicita il modello e collega la scienza alla storia.

## Esperienza

| Modulo | Interazione | Cosa insegna |
| --- | --- | --- |
| 01 · La luce | Distanza e temperatura stellare; curva del flusso | Inverso del quadrato e Stefan–Boltzmann |
| 02 · Il segnale | Curve sintetiche di transito, pulsazione e calo progressivo | Un’osservazione può essere compatibile con più cause |
| 03 · L’energia | Massa e frazione di energia di riposo disponibile | Scala di E = mc² e limiti della conversione |
| 04 · Il tempo | Tempo a bordo e accelerazione propria | Due durate diverse, velocità inferiore a c |
| 05 · Il peso | Raggio e peso apparente; rotazione avviabile | Accelerazione centripeta e gradiente testa–piedi |
| 06 · La vita | Ambienti terrestri e mondo ipotetico | Separare vita osservata e biologia speculativa |

L’esperimento iniziale mostra subito la legge dell’inverso del quadrato. Il quiz conserva le otto domande della V1, riformulate, con spiegazioni, risultato finale e collegamenti ai concetti da rivedere. Rimangono la domanda casuale e i tre livelli di spoiler.

Il progresso viene registrato quando il lettore segna un modulo come esplorato o passa al successivo. Le chiavi `phmVisited` e `phmSpoiler` sono compatibili con la V1. Dati locali corrotti o storage non disponibile non devono bloccare il percorso. I parametri degli esperimenti restano in memoria durante la sessione; “Ripristina” riporta il singolo laboratorio ai valori iniziali.

## Struttura e avvio

Sito statico senza dipendenze JavaScript, installazione o build:

- `index.html`: struttura semantica e metadati.
- `styles.css`: tema, impaginazione responsive, focus e movimento ridotto.
- `content.js`: spiegazioni, spoiler, quiz, ambienti e fonti.
- `physics.js`: funzioni fisiche pure con unità SI internamente.
- `app.js`: controlli, diagrammi SVG calcolati, navigazione e stato locale.
- `tests/physics.test.js`: riferimenti numerici e invarianti fisici.

Aprire `index.html` oppure servire la cartella con `python -m http.server 8000`. I font Google hanno alternative di sistema. I percorsi locali relativi mantengono la compatibilità con il sottopercorso GitHub Pages `/project-hail-mary-science/`.

GitHub Pages può continuare a pubblicare da `main`, cartella `/(root)`, con `.nojekyll`. Non sono necessari workflow aggiuntivi o migrazioni di hosting.

## Modelli e limiti

- Flusso: emissione isotropa, raggio stellare fisso, nessun assorbimento; riferimento di 1.361 W/m² fuori dall’atmosfera. La scala verticale del grafico è logaritmica ed esplicitamente etichettata. Nessuna previsione climatica.
- Oscuramento: segnali sintetici ideali con tempo arbitrario; non dati di telescopi, né diagnosi di una causa unica.
- Energia: equivalenza teorica `E = ηmc²`, non una prestazione misurata dell’Astrophage o di una tecnologia reale.
- Relatività: accelerazione propria costante da fermo, senza frenata; le durate non descrivono la missione completa. Il confronto usa un riferimento terrestre idealizzato inerziale.
- Rotazione: `a = ω²r`, struttura ideale; disegno schematico. Durante l’animazione, gli RPM corrispondono al tempo reale. La simulazione è ferma all’avvio, si arresta uscendo dal modulo o nascondendo la pagina e rispetta i cambiamenti della preferenza di movimento ridotto.
- Astrobiologia: confronto qualitativo di evidenze; nessuna percentuale di abitabilità.

La navigazione dei moduli supporta frecce, Home ed End. I controlli sono etichettati; i valori numerici affiancano i grafici e la correttezza delle risposte non è indicata soltanto dal colore. Le animazioni non partono automaticamente. I link `#module-stellar`, `#module-dimming`, `#module-energy`, `#module-relativity`, `#module-gravity` e `#module-life` aprono direttamente un modulo.

## Verifica

```sh
node --check app.js
node --check content.js
node --check physics.js
node --test tests/physics.test.js
```

I test verificano conversioni di unità, riferimenti pubblicati, legge dell’inverso del quadrato, scala degli RPM, limite della velocità della luce, invariante della traiettoria relativistica, limiti delle curve e gestione di parametri non validi. Non richiedono npm.

## Fonti principali

- [NASA: irradianza solare](https://earth.gsfc.nasa.gov/climate/projects/solar-irradiance/science).
- [OpenStax: radiazione di corpo nero](https://openstax.org/books/university-physics-volume-3/pages/6-1-blackbody-radiation).
- [NASA: transiti](https://science.nasa.gov/exoplanets/whats-a-transit/) e [caratterizzazione degli esopianeti](https://science.nasa.gov/exoplanets/how-we-find-and-characterize/).
- [OpenStax: energia relativistica](https://openstax.org/books/university-physics-volume-3/pages/5-9-relativistic-energy) e [dilatazione temporale](https://openstax.org/books/university-physics-volume-3/pages/5-3-time-dilation).
- [Gibbs/Koks, Physics FAQ presso DESY: The Relativistic Rocket](https://www.desy.de/user/projects/Physics/Relativity/SR/rocket.html).
- [Einstein Online: principio di equivalenza](https://www.einstein-online.info/en/spotlight/equivalence_principle/).
- [OpenStax: accelerazione centripeta](https://openstax.org/books/college-physics-2e/pages/6-2-centripetal-acceleration).
- [NASA Astrobiology: requisiti della vita](https://astrobiology.nasa.gov/education/alp/what-does-life-need-for-survival/) e [ruolo dell’acqua](https://astrobiology.nasa.gov/education/alp/water-so-important-for-life/).

Progetto educativo indipendente, non affiliato all’autore, all’editore o agli adattamenti cinematografici. Testi originali; nessun estratto del romanzo.
