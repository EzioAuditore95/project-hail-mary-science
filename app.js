const C = 299792458;
const G0 = 9.80665;
const YEAR = 365.25 * 24 * 3600;

const modules = {
  stellar: {
    status: 'real', label: 'SCIENZA REALE', field: 'Astrofisica', title: 'Quanto è luminosa una stella?', summary: 'Due relazioni spiegano gran parte del problema: quanto una stella emette e quanto di quell’energia arriva a una certa distanza.',
    blocks: [
      ['Corpo nero e temperatura', 'Una stella non è un corpo nero perfetto, ma l’approssimazione è molto utile. La potenza irradiata per unità di superficie cresce con la quarta potenza della temperatura.', 'L = 4πR²σT⁴'],
      ['La distanza conta al quadrato', 'L’energia si distribuisce su superfici sferiche sempre più grandi. Per questo il flusso ricevuto da un pianeta diminuisce con il quadrato della distanza.', 'F = L / (4πd²)'],
      ['Perché è importante nel romanzo', 'Se l’output di una stella cala anche di pochi punti percentuali per un tempo sufficientemente lungo, cambia l’equilibrio energetico del pianeta. La conseguenza climatica non è istantanea: oceani, atmosfera e ghiacci introducono inerzia e feedback.', null]
    ]
  },
  dimming: {
    status: 'plausible', label: 'REALE → PLAUSIBILE', field: 'Astronomia osservativa', title: 'Come capiamo che una stella si sta oscurando?', summary: 'Una diminuzione di luminosità non basta a dirci la causa. Serve combinare misure fotometriche, spettroscopiche e temporali.',
    blocks: [
      ['Fotometria', 'Misuriamo il flusso della stella nel tempo. La forma della curva di luce può rivelare transiti, pulsazioni, macchie stellari o assorbimento lungo la linea di vista.', 'ΔF / F'],
      ['Spettroscopia', 'Scomponendo la luce per lunghezza d’onda possiamo cercare firme chimiche e capire se l’attenuazione dipende dal colore. Un assorbitore selettivo lascia una traccia diversa da un semplice calo intrinseco della stella.', 'I(λ) = I₀(λ)e^{-τ(λ)}'],
      ['Diagnosi per esclusione', 'La parte realistica è il metodo: misurare un’anomalia, formulare cause alternative e scartarle con osservazioni indipendenti. La causa specifica proposta dal romanzo è invece narrativa.', null]
    ]
  },
  energy: {
    status: 'speculative', label: 'SPECULATIVO', field: 'Energetica', title: 'Una forma di vita può immagazzinare energia stellare?', summary: 'La domanda corretta non è solo quanta energia contiene, ma con quale meccanismo viene catturata, confinata e rilasciata.',
    blocks: [
      ['Densità di energia', 'Ogni sistema energetico deve rispettare conservazione dell’energia e limiti dei materiali. Più energia concentri in poco volume, più diventano difficili stabilità, raffreddamento e contenimento.', 'u = E / V'],
      ['Conversione massa–energia', 'E = mc² stabilisce una scala estrema: una piccola massa equivale a un’enorme energia. Ma l’equazione non fornisce automaticamente un meccanismo biologico per convertire massa ed energia a piacere.', 'E = mc²'],
      ['Confine tra fisica e invenzione', 'Il romanzo costruisce una tecnologia biologica attorno a proprietà non note della materia. È una licenza narrativa potente perché le conseguenze vengono poi trattate con logica quantitativa.', null]
    ],
    spoilers: {
      medium: 'Spoiler moderato: la risorsa energetica centrale del romanzo viene trattata come un organismo capace di accumulare e rilasciare quantità eccezionali di energia.',
      full: 'Spoiler completo: le proprietà dell’Astrophage, incluso il suo ruolo come combustibile, non hanno un analogo biologico conosciuto. Il realismo sta soprattutto nella contabilità energetica e nelle conseguenze ingegneristiche.'
    }
  },
  relativity: {
    status: 'real', label: 'SCIENZA REALE', field: 'Relatività speciale', title: 'Cosa succede accelerando verso un’altra stella?', summary: 'A velocità molto alte, velocità, tempo, distanza ed energia non seguono più le approssimazioni newtoniane.',
    blocks: [
      ['Fattore di Lorentz', 'La quantità γ misura quanto diventano importanti gli effetti relativistici. Per velocità molto inferiori a c vale circa 1; avvicinandosi a c cresce rapidamente.', 'γ = 1 / √(1 − v²/c²)'],
      ['Tempo proprio', 'L’orologio a bordo misura il tempo proprio. Per un osservatore esterno, il viaggio dura di più. Questo non è un effetto ottico: è geometria dello spazio-tempo.', 'Δt = γΔτ'],
      ['Accelerazione costante', 'Mantenere circa 1 g di accelerazione propria è concettualmente attraente: produce una sensazione simile al peso terrestre e permette di raggiungere velocità relativistiche. Il vero problema è l’energia necessaria.', null]
    ]
  },
  gravity: {
    status: 'real', label: 'SCIENZA REALE', field: 'Meccanica', title: 'Come si simula la gravità nello spazio?', summary: 'Una struttura rotante può produrre un’accelerazione apparente verso l’esterno che, per chi è a bordo, funziona come un peso.',
    blocks: [
      ['Accelerazione centripeta', 'Per muoversi in cerchio serve un’accelerazione diretta verso l’asse. Nel sistema rotante, l’equipaggio interpreta la reazione del pavimento come gravità artificiale.', 'a = ω²r'],
      ['Raggio contro velocità', 'A parità di gravità, un raggio più grande permette una rotazione più lenta. Questo riduce gradienti testa-piedi e disturbi vestibolari.', 'ω = √(a/r)'],
      ['Ingegneria reale', 'Non richiede nuova fisica. Richiede invece strutture robuste, bilanciamento, controllo delle vibrazioni e una geometria compatibile con la missione.', null]
    ]
  },
  life: {
    status: 'plausible', label: 'PLAUSIBILE → SPECULATIVO', field: 'Astrobiologia', title: 'Quanto può essere aliena la vita?', summary: 'La vita terrestre offre un solo esempio. Alcune regole sembrano generali; altre potrebbero essere semplicemente contingenti.',
    blocks: [
      ['Vincoli probabilmente universali', 'Un organismo deve mantenersi lontano dall’equilibrio termodinamico, ottenere energia, conservare informazione, replicarsi con variazione ed essere soggetto a selezione.', 'energia + informazione + replicazione + selezione'],
      ['Chimica non necessariamente universale', 'Carbonio e acqua sono candidati molto forti per ragioni chimiche, ma non possiamo dimostrare che siano gli unici. Anche la dipendenza dall’ossigeno è terrestre: molti organismi vivono senza usarlo.', null],
      ['Convergenza evolutiva', 'Ambienti simili possono favorire soluzioni funzionali simili, ma non garantiscono anatomie identiche. L’evoluzione lavora con la storia disponibile, non progetta da zero.', null]
    ],
    spoilers: {
      medium: 'Spoiler moderato: il romanzo usa differenze ambientali estreme per costruire fisiologie radicalmente differenti.',
      full: 'Spoiler completo: Erid e Rocky sono un esperimento di world-building astrobiologico. Pressione, temperatura, atmosfera e sensi vengono concatenati in modo internamente coerente, pur restando largamente speculativi.'
    }
  }
};

const quiz = [
  { q: 'Un pianeta passa da 1 UA a 2 UA da una stella identica. Quanto flusso riceve?', a: ['La metà', 'Un quarto', 'Il doppio', 'Lo stesso'], c: 1, e: 'Il flusso segue 1/d². Raddoppiare la distanza significa dividere il flusso per 2² = 4.' },
  { q: 'A raggio costante, una stella diventa il 10% più calda. La sua luminosità cambia di circa…', a: ['+10%', '+21%', '+46%', '+100%'], c: 2, e: 'L ∝ T⁴. 1,1⁴ ≈ 1,464: circa +46%.' },
  { q: 'Quale osservazione aiuta di più a distinguere un oscuramento “grigio” da un assorbitore selettivo?', a: ['Il colore/spettro della luce', 'La massa del pianeta', 'Il numero di lune', 'La durata del giorno'], c: 0, e: 'Un assorbitore selettivo modifica il flusso in modo dipendente dalla lunghezza d’onda.' },
  { q: 'Per ottenere 1 g con una struttura rotante, aumentando il raggio richiesto…', a: ['Gli RPM aumentano', 'Gli RPM diminuiscono', 'Gli RPM non cambiano', 'Serve una gravità reale'], c: 1, e: 'Da ω = √(a/r): aumentando r, la velocità angolare necessaria diminuisce.' },
  { q: 'Quando v si avvicina alla velocità della luce, il fattore di Lorentz γ…', a: ['Va a zero', 'Resta uguale a 1', 'Cresce', 'Diventa negativo'], c: 2, e: 'γ = 1/√(1−v²/c²); il denominatore diminuisce avvicinandosi a c.' },
  { q: 'E = mc² significa che un organismo può convertire facilmente tutta la propria massa in energia?', a: ['Sì', 'No'], c: 1, e: 'No. L’equivalenza massa–energia indica una relazione fisica, non un meccanismo pratico di conversione totale.' },
  { q: 'Quale requisito è più generale per la vita rispetto alla presenza di ossigeno?', a: ['Capacità di mantenere metabolismo ed energia', 'Avere polmoni', 'Vivere a 1 atmosfera', 'Usare luce visibile'], c: 0, e: 'L’ossigeno non è universale neppure sulla Terra; ottenere energia e mantenere processi lontani dall’equilibrio è molto più generale.' },
  { q: 'La gravità artificiale per rotazione richiede una nuova teoria della gravità?', a: ['Sì', 'No'], c: 1, e: 'No. È un effetto della dinamica in un sistema rotante ed è descritto dalla meccanica classica.' }
];

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const state = {
  visited: new Set(JSON.parse(localStorage.getItem('phmVisited') || '[]')),
  quizIndex: 0,
  quizScore: 0,
  quizLocked: false,
  spoiler: localStorage.getItem('phmSpoiler') || 'light'
};

function updateProgress() {
  const n = state.visited.size;
  $('#progressLabel').textContent = `${n}/6 moduli esplorati`;
  $('#progressBar').style.width = `${(n / 6) * 100}%`;
  $$('.module-card').forEach(card => card.classList.toggle('visited', state.visited.has(card.dataset.module)));
  localStorage.setItem('phmVisited', JSON.stringify([...state.visited]));
}

function renderModule(key) {
  const m = modules[key];
  if (!m) return;
  state.visited.add(key); updateProgress();
  const blocks = m.blocks.map(([title, text, eq]) => `<section class="detail-block"><h3>${title}</h3><p>${text}</p>${eq ? `<span class="equation">${eq}</span>` : ''}</section>`).join('');
  const spoilers = m.spoilers ? `${m.spoilers.medium ? `<div class="spoiler-text" data-level="medium"><strong>Spoiler moderato</strong><br>${m.spoilers.medium}</div>` : ''}${m.spoilers.full ? `<div class="spoiler-text" data-level="full"><strong>Spoiler completo</strong><br>${m.spoilers.full}</div>` : ''}` : '';
  $('#moduleDetail').innerHTML = `<aside class="detail-side"><span class="status ${m.status}">${m.label}</span><h2>${m.title}</h2><p>${m.summary}</p><p class="eyebrow">${m.field.toUpperCase()}</p></aside><div class="detail-main">${blocks}${spoilers}</div>`;
  $('#moduleDetailWrap').hidden = false;
  $('#moduleDetailWrap').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

$$('[data-open]').forEach(btn => btn.addEventListener('click', () => renderModule(btn.dataset.open)));
$('#resetProgress').addEventListener('click', () => { state.visited.clear(); updateProgress(); });

function setSpoiler(mode) {
  state.spoiler = mode;
  document.body.dataset.spoiler = mode;
  $('#spoilerMode').value = mode;
  localStorage.setItem('phmSpoiler', mode);
}
$('#spoilerMode').addEventListener('change', e => setSpoiler(e.target.value));
setSpoiler(state.spoiler);

function updateFlux() {
  const d = Number($('#distanceSlider').value);
  const rel = 1 / (d * d);
  $('#distanceValue').textContent = d.toFixed(2);
  $('#fluxValue').textContent = `${(rel * 100).toFixed(rel < .1 ? 1 : 0)}%`;
  $('#fluxWm').textContent = `≈ ${(1361 * rel).toFixed(0)} W/m²`;
}
$('#distanceSlider').addEventListener('input', updateFlux);

function updateTemp() {
  const pct = Number($('#tempSlider').value);
  const rel = Math.pow(pct / 100, 4);
  $('#tempValue').textContent = pct.toFixed(0);
  $('#luminosityValue').textContent = `${(rel * 100).toFixed(0)}%`;
}
$('#tempSlider').addEventListener('input', updateTemp);

function updateGravity() {
  const r = Math.max(1, Number($('#radiusInput').value) || 1);
  const g = Math.max(.01, Number($('#gravityInput').value) || .01) * G0;
  const omega = Math.sqrt(g / r);
  const rpm = omega * 60 / (2 * Math.PI);
  const period = 2 * Math.PI / omega;
  $('#rpmValue').textContent = `${rpm.toFixed(2)} RPM`;
  $('#periodValue').textContent = `periodo ≈ ${period.toFixed(1)} s`;
}
$('#radiusInput').addEventListener('input', updateGravity); $('#gravityInput').addEventListener('input', updateGravity);

function updateRelativity() {
  const tau = Number($('#accelYears').value) * YEAR;
  const a = Number($('#accelG').value) * G0;
  const x = a * tau / C;
  const beta = Math.tanh(x);
  const earthTime = (C / a) * Math.sinh(x) / YEAR;
  $('#yearsValue').textContent = Number($('#accelYears').value).toFixed(1);
  $('#accelValue').textContent = Number($('#accelG').value).toFixed(1);
  $('#relV').textContent = `${(beta * 100).toFixed(1)}% c`;
  $('#relEarth').textContent = `tempo terrestre ≈ ${earthTime.toFixed(2)} anni`;
}
$('#accelYears').addEventListener('input', updateRelativity); $('#accelG').addEventListener('input', updateRelativity);

function renderQuiz() {
  const item = quiz[state.quizIndex];
  state.quizLocked = false;
  $('#quizCount').textContent = `${state.quizIndex + 1} / ${quiz.length}`;
  $('#quizScore').textContent = `${state.quizScore} punti`;
  $('#quizBar').style.width = `${(state.quizIndex / quiz.length) * 100}%`;
  $('#questionText').textContent = item.q;
  $('#explanation').hidden = true;
  $('#nextQuestion').hidden = true;
  $('#answerList').innerHTML = item.a.map((a, i) => `<button class="answer" type="button" data-answer="${i}"><span class="answer-key">${String.fromCharCode(65+i)}</span><span>${a}</span></button>`).join('');
  $$('#answerList .answer').forEach(btn => btn.addEventListener('click', () => answerQuiz(Number(btn.dataset.answer))));
}

function answerQuiz(index) {
  if (state.quizLocked) return;
  state.quizLocked = true;
  const item = quiz[state.quizIndex];
  if (index === item.c) state.quizScore++;
  $$('#answerList .answer').forEach((btn, i) => { btn.disabled = true; if (i === item.c) btn.classList.add('correct'); else if (i === index) btn.classList.add('wrong'); });
  $('#explanation').textContent = item.e; $('#explanation').hidden = false;
  $('#quizScore').textContent = `${state.quizScore} punti`;
  $('#nextQuestion').textContent = state.quizIndex === quiz.length - 1 ? 'Ricomincia' : 'Prossima domanda';
  $('#nextQuestion').hidden = false;
}

$('#nextQuestion').addEventListener('click', () => {
  if (state.quizIndex === quiz.length - 1) { state.quizIndex = 0; state.quizScore = 0; } else state.quizIndex++;
  renderQuiz();
});

function showQuickQuestion() {
  const item = quiz[Math.floor(Math.random() * quiz.length)];
  $('#quickQuestion').textContent = item.q;
  $('#quickExplanation').hidden = true;
  $('#quickAnswers').innerHTML = item.a.map((a, i) => `<button class="answer" type="button" data-qanswer="${i}"><span class="answer-key">${String.fromCharCode(65+i)}</span><span>${a}</span></button>`).join('');
  $$('#quickAnswers .answer').forEach(btn => btn.addEventListener('click', () => {
    const selected = Number(btn.dataset.qanswer);
    $$('#quickAnswers .answer').forEach((b, i) => { b.disabled = true; if (i === item.c) b.classList.add('correct'); else if (i === selected) b.classList.add('wrong'); });
    $('#quickExplanation').textContent = item.e; $('#quickExplanation').hidden = false;
  }));
  $('#quickDialog').showModal();
}
$('#randomQuestion').addEventListener('click', showQuickQuestion);

updateProgress(); updateFlux(); updateTemp(); updateGravity(); updateRelativity(); renderQuiz();
