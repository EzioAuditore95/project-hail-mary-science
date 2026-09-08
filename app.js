/* Science Lab: interfaccia statica, accessibile e senza dipendenze runtime. */
(() => {
  'use strict';
  const P = window.PhmPhysics;
  const {modules, sources, quiz, environments} = window.PHM_CONTENT;
  const keys = Object.keys(modules);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const n = (value, decimals = 1) => new Intl.NumberFormat('it-IT', {minimumFractionDigits: decimals, maximumFractionDigits: decimals}).format(value);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  let storageAvailable = true;
  function readLocal(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
    catch { return fallback; }
  }
  function saveLocal(key, value, raw = false) {
    try { localStorage.setItem(key, raw ? value : JSON.stringify(value)); }
    catch { storageAvailable = false; }
  }
  let savedSpoiler = 'light';
  try { savedSpoiler = localStorage.getItem('phmSpoiler') || 'light'; } catch { storageAvailable = false; }
  const savedVisited = readLocal('phmVisited', []);
  const defaults = {
    stellar: {distance: 1, temperature: 100},
    dimming: {mode: 'transit', depth: 2},
    energy: {mass: 1, efficiency: 100},
    relativity: {years: 1, gravity: 1},
    gravity: {radius: 20, gravity: 1},
    life: {environment: 'earth'}
  };
  const state = {
    active: 'stellar', spoiler: ['light','medium','full'].includes(savedSpoiler) ? savedSpoiler : 'light',
    visited: new Set(Array.isArray(savedVisited) ? savedVisited.filter(key => keys.includes(key)) : []),
    labs: structuredClone(defaults), heroDistance: 2, quizIndex: 0, quizScore: 0, quizLocked: false,
    quizDone: false, missed: new Set(), rotationPlaying: false
  };
  // Values from local storage are validated; they are never inserted as HTML.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let rotationFrame = 0;
  let rotationAngle = 0;
  let rotationLast = 0;
  const initialHash = () => {
    const key = location.hash.replace('#module-', '');
    return keys.includes(key) ? key : 'stellar';
  };

  function slider(id, label, min, max, step, value, units) {
    return '<div class="control"><label for="' + id + '">' + label + '<output id="' + id + 'Value" for="' + id + '"></output></label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '"><div class="range-ends"><span>' + n(min, min % 1 ? 1 : 0) + ' ' + units + '</span><span>' + n(max, max % 1 ? 1 : 0) + ' ' + units + '</span></div></div>';
  }
  function metric(id, label, units) {
    return '<div><span class="metric-label">' + label + '</span><output id="' + id + '" class="metric-value"></output><span class="metric-unit" id="' + id + 'Unit">' + units + '</span></div>';
  }
  function svgFigure(id, title, caption) {
    return '<figure class="plot-shell"><svg class="plot-svg" id="' + id + '" viewBox="0 0 600 300" role="img" aria-label="' + title + '"></svg><figcaption class="plot-caption">' + caption + '</figcaption></figure>';
  }
  function labHTML(key) {
    const v = state.labs[key];
    if (key === 'stellar') return svgFigure('stellarPlot', 'Flusso relativo in funzione della distanza', 'Curva del flusso · riferimento terrestre = 100%') +
      '<div class="controls">' + slider('distanceSlider', 'Distanza dalla stella', .4, 5, .01, v.distance, 'UA') + slider('tempSlider', 'Temperatura della stella', 80, 120, 1, v.temperature, '% del Sole') + '</div>' +
      '<div class="presets"><button class="preset" data-preset="earth">Terra · 1 UA</button><button class="preset" data-preset="double">Distanza doppia</button><button class="preset" data-preset="hotter">Stella +10% più calda</button></div>' +
      '<div class="metric-grid">' + metric('fluxValue', 'Flusso ricevuto', 'rispetto alla Terra') + metric('luminosityValue', 'Luminosità della stella', 'rispetto al Sole') + '</div>';
    if (key === 'dimming') return '<div class="segmented" role="group" aria-label="Ipotesi di oscuramento">' +
      [['transit','Transito'],['pulsation','Pulsazione'],['dimming','Calo progressivo']].map(([id,label]) => '<button type="button" data-curve="' + id + '" aria-pressed="' + (v.mode === id) + '">' + label + '</button>').join('') + '</div>' +
      svgFigure('dimmingPlot', 'Curva di luce sintetica', 'Flusso normalizzato · tempo in unità arbitrarie') +
      '<div class="controls">' + slider('depthSlider', 'Calo massimo rispetto al riferimento', .5, 10, .1, v.depth, '%') + '</div>' +
      '<div class="metric-grid">' + metric('minimumFlux', 'Minimo del flusso', 'rispetto al riferimento') + metric('curvePattern', 'Andamento', 'del modello selezionato') + '</div>';
    if (key === 'energy') return '<div class="energy-equivalence"><output id="energyGwh"></output><span>GWh</span></div><p class="micro">Energia resa disponibile nello scenario ipotetico</p>' +
      '<div class="energy-meter"><label>Frazione dell’energia di riposo utilizzata</label><div class="energy-meter-track" role="img" id="energyMeter"><div id="energyFill" class="energy-meter-fill"></div></div><div class="energy-split"><span id="convertedMass"></span><span id="remainingEnergy"></span></div></div>' +
      '<div class="controls">' + slider('massSlider', 'Massa di riferimento', .1, 10, .1, v.mass, 'g') + slider('efficiencySlider', 'Frazione resa disponibile · η', 0, 100, 1, v.efficiency, '%') + '</div>' +
      '<div class="metric-grid">' + metric('energyJoules', 'Energia', 'terajoule · 1 TJ = 10¹² J') + metric('energyHours', 'Centrale da 1 GW', 'ore alla stessa potenza') + '</div>';
    if (key === 'relativity') return svgFigure('relativityPlot', 'Confronto tra tempo terrestre e tempo a bordo', 'Asse orizzontale: anni a bordo · verticale: anni trascorsi') +
      '<div class="controls">' + slider('accelYears', 'Tempo trascorso a bordo', .1, 5, .1, v.years, 'anni') + slider('accelG', 'Accelerazione sentita a bordo', .1, 1.5, .1, v.gravity, 'g') + '</div>' +
      '<div class="presets"><button class="preset" data-preset="oneYear">1 anno a 1 g</button><button class="preset" data-preset="threeYears">3 anni a 1 g</button></div>' +
      '<div class="metric-grid">' + metric('relV', 'Velocità finale', 'della velocità della luce') + metric('relEarth', 'Tempo sulla Terra', 'anni') + metric('relShip', 'Tempo a bordo', 'anni') + metric('relDistance', 'Distanza percorsa', 'anni luce · riferimento terrestre') + '</div>';
    if (key === 'gravity') return svgFigure('gravityPlot', 'Schema di un habitat rotante con forza diretta verso l’asse', 'Vista esterna · dimensioni schematiche. Rotazione in tempo reale quando avviata.') +
      '<button id="rotationToggle" type="button" aria-pressed="false">Avvia la rotazione</button><div class="controls">' +
      slider('radiusInput', 'Raggio dal centro al pavimento', 2, 200, 1, v.radius, 'm') + slider('gravityInput', 'Peso apparente desiderato', .1, 2, .005, v.gravity, 'g') + '</div>' +
      '<div class="presets"><button class="preset" data-preset="moon">Come sulla Luna · 0,165 g</button><button class="preset" data-preset="earthGravity">Come sulla Terra · 1 g</button></div>' +
      '<div class="metric-grid">' + metric('rpmValue', 'Velocità di rotazione', 'giri al minuto') + metric('periodValue', 'Durata di un giro', 'secondi') + '</div>';
    return '<div class="segmented" role="group" aria-label="Scegli un ambiente">' +
      Object.entries(environments).map(([id, env]) => '<button type="button" data-environment="' + id + '" aria-pressed="' + (id === v.environment) + '">' + env.label + '</button>').join('') +
      '</div><div id="lifeMap" class="life-map"></div>';
  }
  function novelText(key) {
    const m = modules[key];
    return m.novel[state.spoiler] || (state.spoiler === 'full' && m.novel.medium) || m.novel.light;
  }
  function renderModule(key, updateHash = true) {
    if (!keys.includes(key)) return;
    stopRotation();
    state.active = key;
    const m = modules[key];
    const labTitles = {stellar:'Regola luce e distanza', dimming:'Confronta le ipotesi', energy:'Dai una scala a E = mc²', relativity:'Confronta i due orologi', gravity:'Progetta il tuo peso', life:'Confronta gli ambienti'};
    const last = key === keys[keys.length - 1];
    $('#modulePanel').setAttribute('aria-labelledby', 'tab-' + key);
    $('#modulePanel').innerHTML =
      '<article class="module-story"><span class="status ' + m.status + '">' + m.label + '</span><h2>' + m.title + '</h2><p class="module-intro">' + m.intro + '</p>' +
      '<div class="analogy"><p class="eyebrow">PARTI DA UN’INTUIZIONE</p><p>' + m.analogy + '</p></div><p class="concept">' + m.concept + '</p>' +
      '<aside class="novel-note"><p class="eyebrow">NEL ROMANZO</p><p id="novelText">' + novelText(key) + '</p></aside>' +
      '<details class="formula-details"><summary>Dentro la formula</summary><code class="equation">' + m.equation + '</code><p>' + m.symbols + '</p></details>' +
      '<div class="module-sources">' + m.sources.map(id => '<a href="' + sources[id].url + '" target="_blank" rel="noopener noreferrer">' + sources[id].author + ' ↗</a>').join('') + '</div></article>' +
      '<section class="lab ' + (key === 'energy' ? 'energy-lab' : '') + '" id="lab" aria-label="Laboratorio di ' + m.field.toLowerCase() + '">' +
      '<div class="lab-header"><div><p class="eyebrow">ESPERIMENTO ' + m.number + '</p><h3>' + labTitles[key] + '</h3></div><button type="button" class="reset-lab" id="resetLab">Ripristina</button></div>' + labHTML(key) +
      '<p class="lab-insight" id="labInsight"></p><p class="model-note"><strong>Il modello.</strong> ' + m.limit + '</p></section>' +
      '<div class="module-end"><span class="micro">' + m.number + ' / 06 · ' + m.field + '</span><button type="button" id="markExplored" class="button secondary">Segna come esplorato</button><button type="button" id="nextModule" class="button primary">' + (last ? 'Vai al checkpoint' : 'Prossimo esperimento') + ' <span aria-hidden="true">→</span></button></div>';
    $$('#moduleTabs button').forEach(button => {
      const selected = button.dataset.module === key;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    if (updateHash) history.replaceState(null, '', '#module-' + key);
    $('#resetLab').addEventListener('click', () => {
      state.labs[key] = structuredClone(defaults[key]);
      renderModule(key, false);
      $('#resetLab').focus({preventScroll:true});
    });
    $('#markExplored').addEventListener('click', () => { state.visited.add(key); updateProgress(); });
    $('#nextModule').addEventListener('click', () => {
      state.visited.add(key); updateProgress();
      if (last) { $('#quiz').scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth'}); $('#questionText').focus({preventScroll:true}); }
      else { const next = keys[keys.indexOf(key) + 1]; renderModule(next); $('#tab-' + next).focus({preventScroll:true}); $('#modules').scrollIntoView({behavior: reducedMotion.matches ? 'auto' : 'smooth'}); }
    });
    bindLab(key);
    updateProgress(false);
  }
  function updateProgress(persist = true) {
    const count = state.visited.size;
    $('#progressLabel').textContent = count + ' / 6 esplorati';
    $('#progressBar').value = count;
    if (persist) saveLocal('phmVisited', [...state.visited]);
    $$('#moduleTabs button').forEach(button => {
      const visited = state.visited.has(button.dataset.module);
      $('.visited-mark', button).textContent = visited ? '✓' : '';
      const module = modules[button.dataset.module];
      button.setAttribute('aria-label', module.number + ' · ' + module.field.toLowerCase() + (visited ? ' · esplorato' : ''));
    });
    if ($('#markExplored')) {
      $('#markExplored').textContent = state.visited.has(state.active) ? 'Esplorato ✓' : 'Segna come esplorato';
      $('#markExplored').disabled = state.visited.has(state.active);
    }
    $('#progressMessage').textContent = !storageAvailable ? 'Il salvataggio sul dispositivo non è disponibile. Puoi continuare in questa sessione.' : count === 6 ? 'Percorso esplorato. Metti alla prova le intuizioni nel checkpoint.' : 'Il progresso viene conservato su questo dispositivo.';
  }
  function setSpoiler(mode) {
    state.spoiler = ['light','medium','full'].includes(mode) ? mode : 'light';
    $('#spoilerMode').value = state.spoiler;
    $('#spoilerHelp').textContent = {
      light:'Spoiler minimi: solo la premessa, senza rivelazioni sulla trama.',
      medium:'Spoiler moderati: anche le idee biologiche e tecnologiche del romanzo.',
      full:'Spoiler completi: anche nomi, personaggi e dettagli del mondo narrativo.'
    }[state.spoiler];
    saveLocal('phmSpoiler', state.spoiler, true);
    if ($('#novelText')) $('#novelText').textContent = novelText(state.active);
    updateProgress(false);
  }
  function rangeValue(id, text) {
    const input = $('#' + id);
    const value = Number(input.value);
    input.style.setProperty('--fill', (value - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100 + '%');
    input.setAttribute('aria-valuetext', text);
    const output = $('#' + id + 'Value');
    if (output) output.textContent = text;
  }
  function bindInputs(map, update) {
    Object.entries(map).forEach(([id, property]) => {
      $('#' + id).addEventListener('input', event => {
        const input = event.target;
        const value = Number(input.value);
        if (!Number.isFinite(value)) return;
        state.labs[state.active][property] = Math.min(Number(input.max), Math.max(Number(input.min), value));
        update();
      });
    });
  }
  function setPreset(values, update) {
    Object.entries(values).forEach(([id,value]) => {
      const input = $('#' + id);
      if (input) { input.value = value; input.dispatchEvent(new Event('input', {bubbles:true})); }
    });
    update();
  }
  function bindLab(key) {
    const updates = {stellar:updateStellar, dimming:updateDimming, energy:updateEnergy, relativity:updateRelativity, gravity:updateGravity, life:updateLife};
    const update = updates[key];
    const maps = {
      stellar:{distanceSlider:'distance',tempSlider:'temperature'},
      dimming:{depthSlider:'depth'}, energy:{massSlider:'mass',efficiencySlider:'efficiency'},
      relativity:{accelYears:'years',accelG:'gravity'}, gravity:{radiusInput:'radius',gravityInput:'gravity'}, life:{}
    };
    bindInputs(maps[key],update);
    $$('[data-preset]').forEach(button => button.addEventListener('click', () => {
      const presets = {earth:{distanceSlider:1,tempSlider:100}, double:{distanceSlider:2,tempSlider:100}, hotter:{tempSlider:110},
        oneYear:{accelYears:1,accelG:1}, threeYears:{accelYears:3,accelG:1}, moon:{gravityInput:.165}, earthGravity:{gravityInput:1}};
      setPreset(presets[button.dataset.preset],update);
    }));
    $$('[data-curve]').forEach(button => button.addEventListener('click', () => {state.labs.dimming.mode=button.dataset.curve;update();}));
    $$('[data-environment]').forEach(button => button.addEventListener('click', () => {state.labs.life.environment=button.dataset.environment;update();}));
    if (key === 'gravity') $('#rotationToggle').addEventListener('click', () => {
      if (state.rotationPlaying) stopRotation();
      else { state.rotationPlaying=true; rotationLast=0; $('#rotationToggle').textContent='Metti in pausa'; $('#rotationToggle').setAttribute('aria-pressed','true'); rotationFrame=requestAnimationFrame(animateRotation); }
    });
    update();
  }

  const text = (x,y,content,cls='',anchor='start') => '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="' + anchor + '">' + esc(content) + '</text>';
  const line = (x1,y1,x2,y2,cls='grid') => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '"/>';
  function graphFrame(xMax,yMin,yMax,xLabel,ticks=4) {
    const left=66,right=570,top=30,bottom=235;
    const x=v=>left+(right-left)*v/xMax;
    const y=v=>bottom-(bottom-top)*(v-yMin)/(yMax-yMin);
    let svg='';
    for(let i=0;i<=ticks;i++) {
      const vx=xMax*i/ticks,vy=yMin+(yMax-yMin)*i/ticks;
      svg+=line(left,y(vy),right,y(vy));
      svg+=text(54,y(vy)+5,n(vy,Math.abs(yMax-yMin)<=10?1:0),'','end');
      svg+=text(x(vx),263,n(vx,xMax<=5?1:0),'','middle');
    }
    svg+=text(318,292,xLabel,'','middle');
    return {x,y,svg};
  }
  function pathFor(fn, xMin, xMax, count, x, y) {
    return Array.from({length:count+1},(_,i)=> {
      const vx=xMin+(xMax-xMin)*i/count;
      return (i?'L':'M')+x(vx).toFixed(2)+','+y(fn(vx)).toFixed(2);
    }).join(' ');
  }
  function updateHero() {
    const d=state.heroDistance;
    const result=P.stellar(d);
    rangeValue('heroDistance',n(d,2)+' UA');
    $('#heroFlux').innerHTML=n(result.fluxRatio*100,result.fluxRatio<.1?1:0)+'<span>%</span>';
    $('#heroInsight').textContent=Math.abs(d-1)<.005 ? 'Alla distanza della Terra, il flusso di riferimento è circa 1.361 W/m², fuori dall’atmosfera.' : d>1 ? 'La stessa energia si distribuisce su una superficie '+n(d*d,2)+' volte più grande rispetto a 1 UA.' : 'Più vicino alla stella, la stessa energia si concentra su una superficie più piccola.';
    const cx=235,cy=177,unit=52,r=d*unit,theta=-.57;
    let svg='<title id="heroOrbitTitle">La luce e la distanza dal Sole</title><desc id="heroOrbitDesc">A '+n(d,2)+' UA arriva il '+n(result.fluxRatio*100,1)+' per cento del flusso terrestre.</desc>';
    [1,2,3].forEach(i=>{ svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(unit*i)+'" fill="none" stroke="#304045" stroke-dasharray="'+(i===1?'4 5':'0')+'"/>'; });
    for(let i=0;i<24;i++) {
      const a=i*Math.PI/12;
      svg+='<line x1="'+(cx+23*Math.cos(a))+'" y1="'+(cy+23*Math.sin(a))+'" x2="'+(cx+165*Math.cos(a))+'" y2="'+(cy+165*Math.sin(a))+'" stroke="#d5f989" opacity=".13"/>';
    }
    svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#d5f989" stroke-width="1.7"/>';
    svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(theta))+'" y2="'+(cy+r*Math.sin(theta))+'" stroke="#d5f989" stroke-dasharray="4 4"/>';
    svg+='<circle cx="'+cx+'" cy="'+cy+'" r="18" fill="#ffad82"/><circle cx="'+(cx+r*Math.cos(theta))+'" cy="'+(cy+r*Math.sin(theta))+'" r="7" fill="#d5f989" stroke="#111b1e" stroke-width="3"/>';
    svg+=text(cx,cy+45,'SOLE','plot-label','middle')+text(435,112,'1 UA → 100%')+text(435,143,'2 UA → 25%','accent')+text(435,174,'3 UA → 11%');
    svg+=text(70,355,'STESSA ENERGIA · PIÙ SUPERFICIE');
    $('#heroOrbit').setAttribute('class','plot-svg');
    $('#heroOrbit').innerHTML=svg;
  }
  function updateStellar() {
    const v=state.labs.stellar, result=P.stellar(v.distance,v.temperature/100);
    rangeValue('distanceSlider',n(v.distance,2)+' UA');rangeValue('tempSlider',n(v.temperature,0)+'% del Sole');
    $('#fluxValue').textContent=n(result.fluxRatio*100,1)+'%';
    $('#fluxValueUnit').textContent=n(result.flux,0)+' W/m² fuori dall’atmosfera';
    $('#luminosityValue').textContent=n(result.luminosity*100,1)+'%';
    $('#labInsight').textContent='A '+n(v.distance,2)+' UA ricevi '+n(result.fluxRatio*100,1)+'% del flusso terrestre. La stella emette '+n(result.luminosity*100,1)+'% della potenza del Sole: distanza e luminosità agiscono insieme.';
    // Logarithmic vertical axis keeps both close and distant values readable.
    const left=66,right=570,top=35,bottom=235;
    const x=d=>left+(d-.4)/4.6*(right-left);
    const y=f=>bottom-(Math.log10(f)-0)/(4)*(bottom-top);
    let svg='<title>Flusso contro distanza, scala verticale logaritmica</title>';
    [1,10,100,1000,10000].forEach(f=>{svg+=line(left,y(f),right,y(f))+text(56,y(f)+5,({1:'1',10:'10',100:'10²',1000:'10³',10000:'10⁴'})[f],'','end');});
    [.4,1,2,3,5].forEach(d=>{svg+=text(x(d),263,n(d,d===.4?1:0),'','middle');});
    svg+='<path d="'+pathFor(d=>P.stellar(d,v.temperature/100).fluxRatio*100,.4,5,120,x,y)+'" class="data-line"/>';
    svg+=line(x(v.distance),y(result.fluxRatio*100),x(v.distance),bottom,'reference-line');
    svg+='<circle cx="'+x(v.distance)+'" cy="'+y(result.fluxRatio*100)+'" r="6" fill="#d5f989"/>';
    svg+=text(318,292,'Distanza · UA','','middle');
    $('#stellarPlot').innerHTML=svg;
    $('#stellarPlot').setAttribute('aria-label','Flusso: '+n(result.fluxRatio*100,1)+'% alla distanza di '+n(v.distance,2)+' UA. Asse verticale percentuale logaritmico da 1 a 10.000%.');
    $('.plot-caption').textContent='Flusso in % · scala verticale logaritmica: ogni linea vale 10 volte la precedente';
  }
  function updateDimming() {
    const v=state.labs.dimming;
    rangeValue('depthSlider',n(v.depth,1)+'%');
    $$('[data-curve]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.curve===v.mode)));
    const {x,y,svg}=graphFrame(3,90,100,'Tempo · unità arbitrarie',3);
    $('#dimmingPlot').innerHTML=svg+'<path class="data-line" d="'+pathFor(t=>P.lightCurve(v.mode,t,v.depth)*100,0,3,240,x,y)+'"/>';
    $('#minimumFlux').textContent=n(100-v.depth,1)+'%';
    $('#curvePattern').textContent={transit:'Periodico',pulsation:'Graduale',dimming:'In calo'}[v.mode];
    $('#labInsight').textContent={
      transit:'Tre cali simili a intervalli regolari: compatibili con un corpo che passa davanti alla stella. La forma da sola non basta a dimostrarlo.',
      pulsation:'Una variazione regolare e morbida può suggerire una pulsazione. Servono spettro e altre misure per distinguerla da cause alternative.',
      dimming:'Qui il flusso scende senza recuperare nel periodo osservato. Non puoi dedurne la causa: un calo progressivo è un segnale da indagare.'
    }[v.mode];
    $('#dimmingPlot').setAttribute('aria-label','Curva sintetica: '+v.mode+'. Minimo '+n(100-v.depth,1)+' per cento; tre unità di tempo arbitrarie.');
  }
  function updateEnergy() {
    const v=state.labs.energy,result=P.energy(v.mass,v.efficiency);
    rangeValue('massSlider',n(v.mass,1)+' g');rangeValue('efficiencySlider',n(v.efficiency,0)+'%');
    $('#energyGwh').textContent=n(result.gwh,2);
    $('#energyJoules').textContent=n(result.joules/1e12,2);
    $('#energyHours').textContent=n(result.gwh,2);
    $('#energyFill').style.width=v.efficiency+'%';
    $('#energyMeter').setAttribute('aria-label',n(v.efficiency,0)+'% dell’energia di riposo resa disponibile');
    $('#convertedMass').textContent='Utilizzata: '+n(v.efficiency,0)+'%';
    $('#remainingEnergy').textContent='Non utilizzata: '+n(100-v.efficiency,0)+'%';
    $('#labInsight').textContent=v.efficiency===0 ? 'Con una frazione disponibile pari a zero, l’energia utilizzabile è zero. L’equivalenza di riposo della massa rimane.' : n(v.mass,1)+' g al '+n(v.efficiency,0)+'% equivalgono a '+n(result.gwh,2)+' ore di produzione di una centrale ideale da 1 GW. Questo confronto dà una scala all’energia, non descrive un motore realizzabile.';
  }
  function speedLabel(beta) {
    const pct=beta*100;
    const digits=pct>99.99?5:pct>99?3:1;
    return n(pct,digits)+'%';
  }
  function updateRelativity() {
    const v=state.labs.relativity,result=P.relativity(v.years,v.gravity);
    rangeValue('accelYears',n(v.years,1)+' anni');rangeValue('accelG',n(v.gravity,1)+' g');
    $('#relV').textContent=speedLabel(result.beta);$('#relEarth').textContent=n(result.earthYears,2);
    $('#relShip').textContent=n(v.years,1);$('#relDistance').textContent=n(result.distanceLY,2);
    const maxY=Math.max(v.years*1.1,result.earthYears*1.1);
    const frame=graphFrame(v.years,0,maxY,'Anni a bordo',3);
    let svg=frame.svg;
    svg+='<path class="reference-line" d="'+pathFor(t=>t,0,v.years,2,frame.x,frame.y)+'"/>';
    svg+='<path class="data-line" d="'+pathFor(t=>P.relativity(t,v.gravity).earthYears,0,v.years,100,frame.x,frame.y)+'"/>';
    svg+='<circle cx="'+frame.x(v.years)+'" cy="'+frame.y(result.earthYears)+'" r="5" fill="#d5f989"/>';
    $('#relativityPlot').innerHTML=svg;
    $('.plot-caption').textContent='Linea chiara: Terra · tratteggio: bordo. Assi lineari in anni.';
    $('#labInsight').textContent='Per te passano '+n(v.years,1)+' anni. Nel riferimento terrestre ne passano '+n(result.earthYears,2)+'. La velocità finale resta inferiore a c. La frenata non è inclusa.';
    $('#relativityPlot').setAttribute('aria-label','Confronto temporale: '+n(v.years,1)+' anni a bordo e '+n(result.earthYears,2)+' anni sulla Terra.');
  }
  function updateGravity() {
    const v=state.labs.gravity,result=P.rotation(v.radius,v.gravity);
    rangeValue('radiusInput',n(v.radius,0)+' m');rangeValue('gravityInput',n(v.gravity,3)+' g');
    $('#rpmValue').textContent=n(result.rpm,2);$('#periodValue').textContent=n(result.period,2);
    const r=25+v.radius/200*91;
    let svg='<title>Habitat rotante, vista esterna</title><defs><marker id="forceArrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#d5f989"/></marker></defs>';
    svg+=line(145,135,455,135)+line(300,12,300,258);
    svg+='<circle cx="300" cy="135" r="'+r+'" fill="none" stroke="#304045" stroke-dasharray="5 5"/>';
    svg+='<g id="rotor" transform="rotate('+rotationAngle+' 300 135)"><line x1="'+(300-r)+'" y1="135" x2="'+(300+r)+'" y2="135" stroke="#a6b4b2" stroke-width="2"/>';
    svg+='<rect x="'+(300-r-8)+'" y="122" width="16" height="26" rx="2" fill="#d5f989"/><rect x="'+(300+r-8)+'" y="122" width="16" height="26" rx="2" fill="#d5f989"/>';
    svg+='<line x1="'+(300+r-14)+'" y1="135" x2="'+(300+r*.3)+'" y2="135" stroke="#d5f989" stroke-width="2" marker-end="url(#forceArrow)"/>';
    svg+='</g><circle cx="300" cy="135" r="5" fill="#ffad82"/>';
    svg+=text(34,44,'FORZA VERSO')+text(34,67,'L’ASSE','accent')+text(466,228,'r = '+n(v.radius,0)+' m','plot-label','middle');
    svg+=text(300,290,'Asse al centro · due estremità','','middle');
    $('#gravityPlot').innerHTML=svg;
    $('#labInsight').textContent='Per '+n(v.gravity,3)+' g a '+n(v.radius,0)+' m servono '+n(result.rpm,2)+' giri al minuto. A 1,70 m dal pavimento, verso il centro, il peso scende al '+n(result.headGravityRatio*100,1)+'% di quello ai piedi.';
  }
  function updateLife() {
    const v=state.labs.life,env=environments[v.environment];
    $$('[data-environment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.environment===v.environment)));
    $('#lifeMap').innerHTML='<h4>'+env.label+'</h4><span class="status '+env.status+'">'+env.verdict.toUpperCase()+'</span><dl>'+
      [['IL SOLVENTE',env.solvent],['L’ENERGIA',env.energy],['L’OSSIGENO',env.oxygen],['LE EVIDENZE',env.evidence]].map(([term,desc])=>'<div><dt>'+term+'</dt><dd>'+desc+'</dd></div>').join('')+'</dl>';
    $('#labInsight').textContent=env.takeaway;
  }
  function animateRotation(timestamp) {
    if (!state.rotationPlaying || state.active!=='gravity' || document.hidden) {stopRotation();return;}
    if (!rotationLast) rotationLast=timestamp;
    const dt=Math.min((timestamp-rotationLast)/1000,.1);
    rotationLast=timestamp;
    const v=state.labs.gravity;
    rotationAngle=(rotationAngle+P.rotation(v.radius,v.gravity).omega*180/Math.PI*dt)%360;
    const rotor=$('#rotor');
    if (rotor) rotor.setAttribute('transform','rotate('+rotationAngle+' 300 135)');
    rotationFrame=requestAnimationFrame(animateRotation);
  }
  function stopRotation() {
    cancelAnimationFrame(rotationFrame);
    state.rotationPlaying=false;rotationLast=0;
    if ($('#rotationToggle')) {$('#rotationToggle').textContent='Avvia la rotazione';$('#rotationToggle').setAttribute('aria-pressed','false');}
  }

  function answersHTML(item, attribute) {
    return item.a.map((answer,index)=>'<button class="answer" type="button" '+attribute+'="'+index+'"><span class="answer-key">'+String.fromCharCode(65+index)+'</span><span>'+answer+'</span></button>').join('');
  }
  function showAnswer(container,item,index,explanation) {
    $$('.answer',container).forEach((button,i)=>{
      button.disabled=true;
      if(i===item.c) {button.classList.add('correct');button.innerHTML+='<span class="answer-mark">✓ Corretta</span>';}
      else if(i===index) {button.classList.add('wrong');button.innerHTML+='<span class="answer-mark">×</span>';}
    });
    explanation.classList.toggle('incorrect',index!==item.c);
    explanation.innerHTML='<strong>'+(index===item.c?'Esatto.':'Rivediamo l’intuizione.')+'</strong>'+item.e;
    explanation.hidden=false;
  }
  function renderQuiz(focus=false) {
    const item=quiz[state.quizIndex];
    state.quizLocked=false;state.quizDone=false;
    $('#quizCount').textContent=String(state.quizIndex+1).padStart(2,'0')+' / 08';
    $('#quizScore').textContent=state.quizScore+' corrette';
    $('#quizBar').value=state.quizIndex;
    $('#questionText').textContent=item.q;
    $('#explanation').hidden=true;$('#nextQuestion').hidden=true;
    $('#answerList').innerHTML=answersHTML(item,'data-answer');
    $$('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
      if(state.quizLocked)return;
      state.quizLocked=true;
      const answer=Number(button.dataset.answer);
      if(answer===item.c)state.quizScore++;else state.missed.add(item.module);
      showAnswer($('#answerList'),item,answer,$('#explanation'));
      $('#quizScore').textContent=state.quizScore+' corrette';
      $('#quizBar').value=state.quizIndex+1;
      $('#nextQuestion').textContent=state.quizIndex===quiz.length-1?'Vedi il risultato →':'Prossima domanda →';
      $('#nextQuestion').hidden=false;
    }));
    if(focus)$('#questionText').focus({preventScroll:true});
  }
  function finishQuiz() {
    state.quizDone=true;
    $('#quizCount').textContent='CHECKPOINT COMPLETATO';$('#quizBar').value=8;
    $('#questionText').textContent=state.quizScore===8?'Le intuizioni sono al posto giusto.':'Ogni errore indica cosa esplorare.';
    $('#answerList').innerHTML='<div class="result-score">'+state.quizScore+' / 8</div><p>'+(
      state.quizScore===8?'Hai riconosciuto le leggi dietro tutti gli esperimenti.':'Riprendi i concetti che hanno messo alla prova la tua intuizione.')+'</p>'+
      (state.missed.size?'<div class="quiz-review">'+[...state.missed].map(key=>'<a href="#module-'+key+'">'+modules[key].number+' · '+modules[key].field.toLowerCase()+' ↗</a>').join('')+'</div>':'');
    $('#explanation').hidden=true;
    $('#nextQuestion').textContent='Ricomincia il checkpoint';
    $('#questionText').focus({preventScroll:true});
  }
  function showQuickQuestion() {
    const item=quiz[Math.floor(Math.random()*quiz.length)];
    $('#quickQuestion').textContent=item.q;
    $('#quickExplanation').hidden=true;
    $('#quickAnswers').innerHTML=answersHTML(item,'data-quick-answer');
    $$('[data-quick-answer]').forEach(button=>button.addEventListener('click',()=>showAnswer($('#quickAnswers'),item,Number(button.dataset.quickAnswer),$('#quickExplanation'))));
    $('#quickDialog').showModal();
  }

  $('#moduleTabs').addEventListener('click',event=>{
    const button=event.target.closest('[data-module]');
    if(button)renderModule(button.dataset.module);
  });
  $('#moduleTabs').addEventListener('keydown',event=>{
    const button=event.target.closest('[role="tab"]');
    if(!button)return;
    let i=keys.indexOf(button.dataset.module);
    if(event.key==='ArrowRight')i=(i+1)%keys.length;
    else if(event.key==='ArrowLeft')i=(i-1+keys.length)%keys.length;
    else if(event.key==='Home')i=0;
    else if(event.key==='End')i=keys.length-1;
    else return;
    event.preventDefault();renderModule(keys[i]);$('#tab-'+keys[i]).focus();
  });
  $('#resetProgress').addEventListener('click',()=>{state.visited.clear();updateProgress();});
  $('#spoilerMode').addEventListener('change',event=>setSpoiler(event.target.value));
  $('#heroDistance').addEventListener('input',event=>{state.heroDistance=Number(event.target.value);updateHero();});
  $('#heroEarth').addEventListener('click',()=>{state.heroDistance=1;$('#heroDistance').value=1;updateHero();});
  $('#nextQuestion').addEventListener('click',()=>{
    if(state.quizDone){state.quizIndex=0;state.quizScore=0;state.missed.clear();renderQuiz(true);}
    else if(state.quizIndex===quiz.length-1)finishQuiz();
    else {state.quizIndex++;renderQuiz(true);}
  });
  $('#randomQuestion').addEventListener('click',showQuickQuestion);
  $('#closeDialog').addEventListener('click',()=>$('#quickDialog').close());
  $('#quickDialog').addEventListener('click',event=>{if(event.target===$('#quickDialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
  window.addEventListener('hashchange',()=>{
    if(location.hash.startsWith('#module-')){
      renderModule(initialHash(),false);
      $('#modules').scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});
    }
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRotation();});
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)stopRotation();});
  $('#sourceList').innerHTML=Object.values(sources).map(source=>'<a href="'+source.url+'" target="_blank" rel="noopener noreferrer"><span class="source-author">'+source.author+'</span><span class="source-title">'+source.title+' ↗</span><span class="source-topic">'+source.topic+'</span></a>').join('');
  renderModule(initialHash(),false);setSpoiler(state.spoiler);updateHero();renderQuiz();
  if(location.hash.startsWith('#module-') || location.hash==='#lab')$('#modules').scrollIntoView({behavior:'auto'});
})();
