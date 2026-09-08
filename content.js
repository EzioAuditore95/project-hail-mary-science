/* Contenuti originali. I riferimenti di trama si mostrano solo al livello scelto. */
window.PHM_CONTENT = {
  sources: {
    solar: {author: 'NASA / Goddard', title: 'Quanta energia riceviamo dal Sole', url: 'https://earth.gsfc.nasa.gov/climate/projects/solar-irradiance/science', topic: 'Irradianza solare · 1.361 W/m² come riferimento'},
    radiation: {author: 'OpenStax / Rice University', title: 'Corpo nero e legge di Stefan–Boltzmann', url: 'https://openstax.org/books/university-physics-volume-3/pages/6-1-blackbody-radiation', topic: 'Temperatura, superficie e potenza emessa'},
    transit: {author: 'NASA / Exoplanets', title: 'Leggere un transito nella luce di una stella', url: 'https://science.nasa.gov/exoplanets/whats-a-transit/', topic: 'Fotometria e curve di luce'},
    spectrum: {author: 'NASA / Exoplanets', title: 'Come troviamo e studiamo gli esopianeti', url: 'https://science.nasa.gov/exoplanets/how-we-find-and-characterize/', topic: 'Spettroscopia e firme molecolari'},
    energy: {author: 'OpenStax / Rice University', title: 'Energia relativistica ed equivalenza con la massa', url: 'https://openstax.org/books/university-physics-volume-3/pages/5-9-relativistic-energy', topic: 'Energia di riposo e limite della velocità della luce'},
    time: {author: 'OpenStax / Rice University', title: 'La dilatazione del tempo', url: 'https://openstax.org/books/university-physics-volume-3/pages/5-3-time-dilation', topic: 'Tempo proprio e fattore di Lorentz'},
    rocket: {author: 'Philip Gibbs, Don Koks / Physics FAQ, DESY', title: 'Il razzo relativistico', url: 'https://www.desy.de/user/projects/Physics/Relativity/SR/rocket.html', topic: 'Accelerazione propria, tempo a bordo e distanze'},
    equivalence: {author: 'Max Planck / Einstein Online', title: 'Ascensori, razzi e principio di equivalenza', url: 'https://www.einstein-online.info/en/spotlight/equivalence_principle/', topic: 'Perché accelerare produce una sensazione di peso'},
    rotation: {author: 'OpenStax / Rice University', title: 'Accelerazione centripeta', url: 'https://openstax.org/books/college-physics-2e/pages/6-2-centripetal-acceleration', topic: 'Raggio, velocità angolare e moto circolare'},
    life: {author: 'NASA / Astrobiology', title: 'Di cosa ha bisogno la vita', url: 'https://astrobiology.nasa.gov/education/alp/what-does-life-need-for-survival/', topic: 'Acqua, materia e fonti di energia'},
    water: {author: 'NASA / Astrobiology', title: 'Il ruolo dell’acqua nella vita conosciuta', url: 'https://astrobiology.nasa.gov/education/alp/water-so-important-for-life/', topic: 'Solventi e limiti delle nostre conoscenze'}
  },
  modules: {
    stellar: {
      number: '01', field: 'ASTROFISICA', status: 'real', label: 'SCIENZA REALE',
      title: 'La stessa stella. Un’altra quantità di luce.',
      intro: 'Una stella può emettere sempre la stessa energia e sembrarti più debole. Basta allontanarti.',
      analogy: 'Pensa a una torcia: più allarghi il fascio su una parete, meno luce arriva su ogni centimetro. Nello spazio la luce si distribuisce in tutte le direzioni.',
      concept: 'Raddoppiare la distanza quadruplica la superficie su cui si distribuisce l’energia: per metro quadrato arriva un quarto della luce. Anche la temperatura della stella conta: a raggio fisso, un +10% in kelvin produce circa +46% di luminosità.',
      equation: 'F = L / (4πd²)     L = 4πR²σT⁴',
      symbols: 'F è il flusso ricevuto; L la potenza totale della stella; d la distanza; R il raggio stellare; T la temperatura assoluta in kelvin; σ la costante di Stefan–Boltzmann.',
      limit: 'Stella sferica, emissione isotropa, nessun assorbimento lungo il percorso e raggio stellare fisso. Il flusso è misurato fuori dall’atmosfera, su una superficie perpendicolare ai raggi: non è la media su tutto il pianeta.',
      novel: {light: 'L’equilibrio energetico di un pianeta dipende dalla luce che riceve. Un calo persistente cambia questo bilancio; oceani, atmosfera e ghiacci determinano come evolve il clima. Questo laboratorio non calcola la temperatura terrestre.'},
      sources: ['solar', 'radiation']
    },
    dimming: {
      number: '02', field: 'ASTRONOMIA OSSERVATIVA', status: 'real', label: 'METODO SCIENTIFICO REALE',
      title: 'Una stella si oscura. Ma perché?',
      intro: 'Il telescopio registra meno luce. È un indizio, non ancora una spiegazione.',
      analogy: 'Una lampada sembra più debole sia quando abbassi la potenza sia quando le passi davanti. Per capire cosa succede devi osservare come cambia la luce nel tempo.',
      concept: 'Un transito può lasciare un calo che si ripete; una pulsazione una variazione più graduale. Lo spettro aggiunge un altro indizio: rivela se mancano certe lunghezze d’onda. Più osservazioni indipendenti mettono alla prova la stessa ipotesi.',
      equation: 'Calo relativo = (F₀ − F) / F₀',
      symbols: 'F₀ è il flusso di riferimento e F quello misurato. Un calo di 0,01 corrisponde all’1%. In un transito ideale, la profondità è circa (raggio del pianeta / raggio della stella)².',
      limit: 'Curve sintetiche senza rumore, macchie o oscuramento al bordo. Il tempo è in unità arbitrarie. Queste forme illustrano ipotesi: da sole non identificano una causa unica e non riproducono dati del romanzo.',
      novel: {light: 'La premessa del romanzo è un’anomalia nella luce del Sole. La parte scientifica è il metodo usato per indagarla: misurare, proporre spiegazioni, cercare prove che possano smentirle.', medium: 'La causa biologica proposta dal romanzo è una licenza narrativa; le tecniche con cui si può studiare una variazione di luce sono reali.', full: 'L’Astrophage è l’assorbitore immaginato da Weir. La fotometria misura l’effetto sulla luce; attribuirlo a un organismo richiede prove ulteriori rispetto a una curva di luminosità.'},
      sources: ['transit', 'spectrum']
    },
    energy: {
      number: '03', field: 'ENERGETICA', status: 'speculative', label: 'FISICA REALE · BIOLOGIA INVENTATA',
      title: 'Un grammo. Un’enormità di energia.',
      intro: 'La formula più famosa della fisica spiega la scala del problema. Non costruisce il motore al posto nostro.',
      analogy: 'Sapere quanto denaro c’è in una cassaforte non significa avere la chiave. Allo stesso modo, l’equivalenza massa–energia non ci dice come rendere disponibile tutta quell’energia.',
      concept: 'Un grammo ha un’energia di riposo equivalente a circa 25 GWh. Il calcolatore mostra quale frazione diventerebbe disponibile in uno scenario ipotetico. Immagazzinarla, liberarla e trasformarla in spinta sono problemi distinti.',
      equation: 'E = ηmc²',
      symbols: 'm è la massa in chilogrammi, c la velocità della luce e η la frazione dell’energia di riposo resa disponibile. 1 GWh = 3.600 miliardi di joule. La densità energetica per volume è u = E/V.',
      limit: 'Equivalenza teorica, non prestazione di una tecnologia o di un organismo. Il cursore η non descrive una conversione biologica nota. Sono esclusi massa del sistema, energia di propulsione, perdite e contenimento.',
      novel: {light: 'Un viaggio interstellare richiede una riserva energetica eccezionale. Il romanzo introduce proprietà immaginarie per renderla disponibile e ne esplora le conseguenze.', medium: 'Una forma di vita viene usata come accumulatore di energia. Questo non ha un equivalente biologico noto alle densità energetiche descritte.', full: 'L’Astrophage assorbe energia e la conserva con proprietà inventate, diventando anche una risorsa per la propulsione. Non è corretto dedurre da E = mc² che un microbo reale possa fare lo stesso.'},
      sources: ['energy']
    },
    relativity: {
      number: '04', field: 'RELATIVITÀ SPECIALE', status: 'real', label: 'SCIENZA REALE',
      title: 'Stesso viaggio. Due orologi diversi.',
      intro: 'Un anno per te può durare più di un anno per chi è rimasto sulla Terra.',
      analogy: 'Immagina di partire con due orologi identici: uno rimane a casa, l’altro sale a bordo. Seguendo percorsi diversi nello spazio-tempo, non accumulano necessariamente la stessa durata.',
      concept: 'Imposta quanto tempo passa a bordo e la spinta che senti. L’astronave parte da ferma e accelera continuamente: si avvicina alla velocità della luce senza raggiungerla. Il tempo terrestre cresce più di quello a bordo.',
      equation: 'v/c = tanh(aτ/c)     t = (c/a) sinh(aτ/c)',
      symbols: 'τ è il tempo misurato a bordo; t il tempo nel riferimento terrestre; a l’accelerazione propria, quella sentita dall’equipaggio. Il fattore di Lorentz è γ = 1/√(1 − v²/c²). La relazione Δt = γΔτ vale direttamente solo a velocità costante.',
      limit: 'Solo fase di accelerazione, partenza da ferma, moto rettilineo e spaziotempo piatto. Nessuna frenata, viaggio di ritorno o verifica del combustibile. Le durate non sono quelle della missione completa del romanzo.',
      novel: {light: 'Per progettare un viaggio tra stelle bisogna distinguere il calendario di chi parte da quello di chi resta. Il divario temporale è una conseguenza della relatività, non un guasto degli orologi.'},
      sources: ['rocket', 'time']
    },
    gravity: {
      number: '05', field: 'MECCANICA', status: 'real', label: 'SCIENZA REALE',
      title: 'Per ritrovare il peso, fai un giro.',
      intro: 'Nello spazio puoi sentire un pavimento sotto i piedi anche lontano da un pianeta.',
      analogy: 'In curva, il sedile dell’auto ti spinge e cambia la tua direzione. In un habitat rotante il pavimento fa lo stesso, continuamente.',
      concept: 'Il pavimento spinge il corpo verso l’asse e lo mantiene in moto circolare. Per chi ruota con la struttura, il peso apparente è diretto verso l’esterno. A parità di peso, un raggio maggiore permette di girare più lentamente.',
      equation: 'a = ω²r     RPM = (60 / 2π) √(a/r)',
      symbols: 'a è l’accelerazione centripeta, r il raggio in metri e ω la velocità angolare. RPM significa giri al minuto; 1 g = 9,80665 m/s². Un raggio quadruplo dimezza gli RPM richiesti.',
      limit: 'Rotazione uniforme e struttura ideale. La persona è orientata con i piedi verso l’esterno. La differenza testa–piedi assume un’altezza di 1,70 m. Vibrazioni, tensioni e adattamento vestibolare non sono simulati.',
      novel: {light: 'Un habitat può creare peso con la rotazione; un veicolo con il motore acceso può ottenerlo anche accelerando in linea retta. Sono due applicazioni di fisica nota, con difficoltà ingegneristiche diverse.', full: 'La configurazione rotante della Hail Mary sfrutta questa meccanica. Il disegno qui è un modello ideale con due estremità simmetriche, non un progetto costruttivo dell’astronave.'},
      sources: ['rotation', 'equivalence']
    },
    life: {
      number: '06', field: 'ASTROBIOLOGIA', status: 'plausible', label: 'EVIDENZE TERRESTRI · IPOTESI ALIENE',
      title: 'La vita deve assomigliarci?',
      intro: 'Conosciamo un solo pianeta abitato. È un punto di partenza straordinario, ma non un campione completo dell’universo.',
      analogy: 'Aver visto una sola casa non ti dice come siano fatte tutte le case possibili. Può però insegnarti qualcosa sulle condizioni necessarie per restare in piedi.',
      concept: 'La vita conosciuta usa acqua liquida, materia ed energia. Non richiede sempre luce solare diretta: alcuni ecosistemi sfruttano energia chimica. Immaginare altri solventi è possibile, dimostrare che sostengano una biologia è un altro passo.',
      equation: 'Energia + materia + informazione + evoluzione',
      symbols: 'È una mappa concettuale, non un’equazione predittiva. Metabolismo, mantenimento dell’organizzazione e riproduzione con variazione aiutano a ragionare su sistemi viventi.',
      limit: 'Il confronto distingue ambienti osservati e ipotetici. Non assegna probabilità di vita né certifica l’abitabilità. Pressione, temperatura, chimica e disponibilità di energia vanno considerate insieme.',
      novel: {light: 'La domanda di Weir è quanto una biologia possa essere diversa dalla nostra restando coerente con il suo ambiente.', medium: 'Ambienti estremi vengono usati per immaginare sensi, materiali biologici e fisiologie molto diversi da quelli umani.', full: 'Rocky e l’ambiente di Erid mostrano come condizioni diverse possano suggerire sensi e fisiologie diversi. La coerenza del mondo inventato non dimostra l’esistenza di quella biologia.'},
      sources: ['life', 'water']
    }
  },
  environments: {
    earth: {label: 'Terra temperata', status: 'real', verdict: 'Vita osservata', solvent: 'Acqua liquida', energy: 'Luce e reazioni chimiche', oxygen: 'Usato da molte specie, non da tutte', evidence: 'Organismi e processi misurabili', takeaway: 'L’ossigeno non è un requisito universale neppure sulla Terra.'},
    vents: {label: 'Abissi terrestri', status: 'real', verdict: 'Vita osservata', solvent: 'Acqua liquida, ad alta pressione', energy: 'Energia chimica alla base di ecosistemi', oxygen: 'Varia tra organismi e microambienti', evidence: 'Ecosistemi presso sorgenti idrotermali', takeaway: 'La luce solare diretta non è indispensabile a ogni ecosistema. Le reazioni chimiche possono alimentarne la base.'},
    alien: {label: 'Mondo ipotetico', status: 'speculative', verdict: 'Biologia non dimostrata', solvent: 'Ammoniaca liquida, ipotizzata', energy: 'Servirebbero reazioni sfruttabili', oxygen: 'Non assunto come requisito', evidence: 'Nessun organismo noto di questo tipo', takeaway: 'Un liquido disponibile non basta a dimostrare la presenza di vita. Bisogna mostrare una chimica capace di sostenerla.'}
  },
  quiz: [
    {q: 'Raddoppi la distanza da una stella. Quanta luce ricevi per metro quadrato?', a: ['La metà', 'Un quarto', 'Il doppio', 'La stessa quantità'], c: 1, e: 'La luce si distribuisce su una superficie quattro volte più grande: 1/2² = 1/4.', module: 'stellar'},
    {q: 'Una stella diventa il 10% più calda in kelvin. A raggio fisso, quanto aumenta la luminosità?', a: ['Circa il 10%', 'Circa il 21%', 'Circa il 46%', 'Circa il 100%'], c: 2, e: 'La temperatura compare alla quarta potenza: 1,1⁴ ≈ 1,464. Una piccola variazione produce un effetto notevole.', module: 'stellar'},
    {q: 'Una stella perde luce. Cosa aiuta a riconoscere un assorbitore che blocca solo certi colori?', a: ['Lo spettro della luce', 'Il numero di lune', 'La durata del giorno su un pianeta'], c: 0, e: 'Lo spettro separa la luce per lunghezza d’onda: può mostrare quali parti vengono assorbite. È un indizio da confrontare con altri dati.', module: 'dimming'},
    {q: 'Quadruplichi il raggio dell’habitat mantenendo 1 g. Come cambiano i giri al minuto?', a: ['Raddoppiano', 'Si dimezzano', 'Rimangono uguali'], c: 1, e: 'Gli RPM sono proporzionali a 1/√r. Con un raggio quattro volte maggiore basta metà della velocità angolare.', module: 'gravity'},
    {q: 'Acceleri sempre di più verso la velocità della luce. Il fattore di Lorentz γ…', a: ['Si avvicina a zero', 'Resta pari a uno', 'Cresce sempre di più'], c: 2, e: 'In γ = 1/√(1 − v²/c²), il denominatore si avvicina a zero. Un corpo con massa non può raggiungere c con energia finita.', module: 'relativity'},
    {q: 'E = mc² dimostra che un organismo può trasformare facilmente tutta la sua massa in energia?', a: ['Sì: basta applicare la formula', 'No: manca un meccanismo fisico e biologico'], c: 1, e: 'L’equivalenza massa–energia è reale. Non fornisce una tecnologia di conversione, né prova l’esistenza di un organismo capace di sfruttarla così.', module: 'energy'},
    {q: 'Quale requisito è più generale dell’ossigeno per la vita conosciuta?', a: ['Una fonte di energia utilizzabile', 'La presenza di polmoni', 'Un’atmosfera uguale alla nostra'], c: 0, e: 'Molti organismi vivono senza usare ossigeno. Tutti devono sostenere i propri processi con energia e materia.', module: 'life'},
    {q: 'Per creare peso con un habitat rotante serve una nuova teoria della gravità?', a: ['Sì', 'No'], c: 1, e: 'Basta la meccanica: il pavimento esercita la forza centripeta che mantiene gli occupanti in moto circolare.', module: 'gravity'}
  ]
};
