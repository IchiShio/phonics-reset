/* =============================================
   PHONICS RESET – Light Green Theme App
   ============================================= */

// ── Globals ──
const STORAGE_KEY = 'phonics_reset_v2';
const HEARTS_MAX = 3;
const XP_PER_CORRECT = 10;
const XP_BONUS_3STAR = 20;
const XP_PER_LEVEL = 100;
const HEARTS_REFILL_MS = 30 * 60 * 1000;

let state = {};         // persisted progress
let currentScreen = 'title';
let selectedWorldIdx = null;
let selectedStageIdx = null;
let lessonState = null; // { qIdx, hearts, correct, total, worldIdx, stageIdx, showingIntro }

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateStatsUI();
  initBgCanvas();
  initTitleWave();
  bindEvents();
  showScreen('title');
  registerSW();
});

/* ═══════════════════════════════════════════════
   PERSISTENCE
   ═══════════════════════════════════════════════ */
function defaultState() {
  return {
    worlds: {},
    xp: 0,
    level: 1,
    streak: { count: 0, lastDate: null },
    heartsLastRefill: Date.now(),
    seenTitle: false
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch { state = defaultState(); }
  checkStreak();
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function getStageProgress(wId, sId) {
  if (!state.worlds[wId]) state.worlds[wId] = { stages: {} };
  if (!state.worlds[wId].stages[sId]) state.worlds[wId].stages[sId] = { stars: 0, completed: false };
  return state.worlds[wId].stages[sId];
}
function checkStreak() {
  const today = new Date().toISOString().slice(0,10);
  if (state.streak.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  if (state.streak.lastDate === yesterday) {
    state.streak.count++;
  } else if (state.streak.lastDate !== today) {
    state.streak.count = 1;
  }
  state.streak.lastDate = today;
  saveState();
}
function addXP(amount) {
  state.xp += amount;
  while (state.xp >= state.level * XP_PER_LEVEL) {
    state.xp -= state.level * XP_PER_LEVEL;
    state.level++;
  }
  saveState();
  updateStatsUI();
}
function updateStatsUI() {
  const el = (id) => document.getElementById(id);
  if (el('stats-streak')) el('stats-streak').textContent = '\uD83D\uDD25 ' + state.streak.count;
  if (el('stats-level'))  el('stats-level').textContent  = 'Lv.' + state.level;
  if (el('stats-xp'))     el('stats-xp').textContent     = state.xp + ' XP';
}

/* ═══════════════════════════════════════════════
   SCREEN MANAGEMENT
   ═══════════════════════════════════════════════ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  currentScreen = id;

  if (id === 'map') drawMap();
  if (id === 'stages') renderStages();
}

/* ═══════════════════════════════════════════════
   EVENT BINDING
   ═══════════════════════════════════════════════ */
function bindEvents() {
  // Title
  document.getElementById('btn-start').addEventListener('click', () => {
    state.seenTitle = true; saveState();
    showScreen('map');
  });

  // Map world info
  document.getElementById('btn-enter-world').addEventListener('click', () => {
    if (selectedWorldIdx != null) {
      showScreen('stages');
    }
  });
  document.getElementById('btn-close-world').addEventListener('click', () => {
    document.getElementById('world-info').classList.add('hidden');
    selectedWorldIdx = null;
  });

  // Stages back
  document.getElementById('btn-back-map').addEventListener('click', () => showScreen('map'));

  // Lesson back
  document.getElementById('btn-back-stages').addEventListener('click', () => {
    lessonState = null;
    showScreen('stages');
  });

  // Clear
  document.getElementById('btn-next-stage').addEventListener('click', () => {
    if (lessonState) {
      const w = WORLDS[lessonState.worldIdx];
      const nextIdx = lessonState.stageIdx + 1;
      if (nextIdx < w.stages.length) {
        selectedStageIdx = nextIdx;
        startLesson(lessonState.worldIdx, nextIdx);
      } else {
        showScreen('stages');
      }
    }
  });
  document.getElementById('btn-retry-stage').addEventListener('click', () => {
    if (lessonState) startLesson(lessonState.worldIdx, lessonState.stageIdx);
  });

  // Fail
  document.getElementById('btn-retry-fail').addEventListener('click', () => {
    if (lessonState) startLesson(lessonState.worldIdx, lessonState.stageIdx);
  });
  document.getElementById('btn-quit-fail').addEventListener('click', () => showScreen('stages'));

  // Ripple effect on buttons
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--ry', ((e.clientY - rect.top) / rect.height * 100) + '%');
      btn.classList.remove('rippling');
      void btn.offsetWidth;
      btn.classList.add('rippling');
      setTimeout(() => btn.classList.remove('rippling'), 600);
    });
  });

  // Map canvas tap
  document.getElementById('mapCanvas').addEventListener('click', onMapTap);
}

/* ═══════════════════════════════════════════════
   BACKGROUND CANVAS – PARTICLES (light green dots)
   ═══════════════════════════════════════════════ */
let bgCtx, bgW, bgH;
const particles = [];
const PARTICLE_COUNT = 60;

function initBgCanvas() {
  const c = document.getElementById('bgCanvas');
  bgCtx = c.getContext('2d');
  function resize() {
    bgW = c.width = window.innerWidth;
    bgH = c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * bgW,
      y: Math.random() * bgH,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.12,
      dy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.15 + 0.05,
    });
  }
  animBg();
}

function animBg() {
  bgCtx.clearRect(0, 0, bgW, bgH);
  for (const p of particles) {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0) p.x = bgW; if (p.x > bgW) p.x = 0;
    if (p.y < 0) p.y = bgH; if (p.y > bgH) p.y = 0;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(34,197,94,${p.a})`;
    bgCtx.fill();
  }
  requestAnimationFrame(animBg);
}

/* ═══════════════════════════════════════════════
   TITLE WAVE CANVAS (green waves)
   ═══════════════════════════════════════════════ */
let titleCtx, titleRAF;
function initTitleWave() {
  const c = document.getElementById('titleWave');
  titleCtx = c.getContext('2d');
  let t = 0;
  function draw() {
    const w = c.width, h = c.height;
    titleCtx.clearRect(0, 0, w, h);
    // Primary green wave
    titleCtx.strokeStyle = 'rgba(34,197,94,0.5)';
    titleCtx.lineWidth = 2;
    titleCtx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin((x / w) * 4 * Math.PI + t) * 18 * Math.sin(t * 0.3 + x * 0.01);
      x === 0 ? titleCtx.moveTo(x, y) : titleCtx.lineTo(x, y);
    }
    titleCtx.stroke();
    // Secondary darker green wave
    titleCtx.strokeStyle = 'rgba(5,150,105,0.3)';
    titleCtx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin((x / w) * 3 * Math.PI + t * 1.3) * 12;
      x === 0 ? titleCtx.moveTo(x, y) : titleCtx.lineTo(x, y);
    }
    titleCtx.stroke();
    t += 0.03;
    titleRAF = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════
   WORLD MAP
   ═══════════════════════════════════════════════ */
let mapCtx, mapW, mapH, mapT = 0, mapRAF;
const worldHitAreas = [];

function drawMap() {
  const c = document.getElementById('mapCanvas');
  mapCtx = c.getContext('2d');
  mapW = c.width = c.parentElement.clientWidth;
  mapH = c.height = c.parentElement.clientHeight;
  worldHitAreas.length = 0;
  if (mapRAF) cancelAnimationFrame(mapRAF);
  mapT = 0;
  animMap();
}

function animMap() {
  // Light green-white background
  mapCtx.fillStyle = '#e8f5e8';
  mapCtx.fillRect(0, 0, mapW, mapH);

  const nodeR = Math.min(mapW, mapH) * 0.045;

  // Determine unlocked worlds
  const unlocked = new Set([0]);
  for (let i = 0; i < WORLDS.length - 1; i++) {
    const w = WORLDS[i];
    if (w.stages.length === 0) continue;
    const allDone = w.stages.every(s => getStageProgress(w.id, s.id).completed);
    if (allDone) unlocked.add(i + 1);
  }

  // Draw paths
  for (let i = 0; i < WORLDS.length - 1; i++) {
    const a = WORLDS[i], b = WORLDS[i + 1];
    const ax = a.x * mapW, ay = a.y * mapH;
    const bx = b.x * mapW, by = b.y * mapH;
    const active = unlocked.has(i) && unlocked.has(i + 1);

    mapCtx.strokeStyle = active ? 'rgba(34,197,94,0.3)' : 'rgba(209,213,219,0.4)';
    mapCtx.lineWidth = 2;
    mapCtx.beginPath();
    const steps = 40;
    for (let s = 0; s <= steps; s++) {
      const t2 = s / steps;
      const mx = ax + (bx - ax) * t2;
      const my = ay + (by - ay) * t2;
      const off = Math.sin(t2 * Math.PI * 4 + mapT * 2) * 6;
      const nx = -(by - ay), ny = bx - ax;
      const len = Math.sqrt(nx * nx + ny * ny) || 1;
      const px = mx + (nx / len) * off;
      const py = my + (ny / len) * off;
      s === 0 ? mapCtx.moveTo(px, py) : mapCtx.lineTo(px, py);
    }
    mapCtx.stroke();
  }

  // Draw world nodes
  worldHitAreas.length = 0;
  WORLDS.forEach((w, i) => {
    const cx = w.x * mapW, cy = w.y * mapH;
    const active = unlocked.has(i);
    const r = nodeR;

    // Soft shadow
    if (active) {
      mapCtx.shadowColor = w.color;
      mapCtx.shadowBlur = 12;
    }

    // Solid circle
    mapCtx.beginPath();
    mapCtx.arc(cx, cy, r, 0, Math.PI * 2);
    mapCtx.fillStyle = active ? w.color : '#d1d5db';
    mapCtx.fill();
    mapCtx.shadowBlur = 0;

    // White inner highlight
    if (active) {
      mapCtx.beginPath();
      mapCtx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.35, 0, Math.PI * 2);
      mapCtx.fillStyle = 'rgba(255,255,255,0.3)';
      mapCtx.fill();
    }

    // Label
    mapCtx.fillStyle = active ? '#1a2e1a' : '#9ca3af';
    mapCtx.font = '600 13px Inter, sans-serif';
    mapCtx.textAlign = 'center';
    mapCtx.fillText(w.name, cx, cy + r + 20);

    worldHitAreas.push({ cx, cy, r: r * 2, idx: i, active });
  });

  mapT += 0.015;
  mapRAF = requestAnimationFrame(animMap);
}

function onMapTap(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for (const h of worldHitAreas) {
    const dx = x - h.cx, dy = y - h.cy;
    if (dx * dx + dy * dy < h.r * h.r && h.active) {
      selectedWorldIdx = h.idx;
      const w = WORLDS[h.idx];
      document.getElementById('world-info-name').textContent = w.name;
      document.getElementById('world-info-sub').textContent = w.nameEn;
      document.getElementById('world-info').classList.remove('hidden');

      const btn = document.getElementById('btn-enter-world');
      if (w.stages.length === 0) {
        btn.textContent = 'Coming Soon';
        btn.disabled = true;
        btn.style.opacity = '0.4';
      } else {
        btn.textContent = '\u5165\u308B';
        btn.disabled = false;
        btn.style.opacity = '1';
      }
      return;
    }
  }
  document.getElementById('world-info').classList.add('hidden');
}

/* ═══════════════════════════════════════════════
   STAGE SELECT
   ═══════════════════════════════════════════════ */
function renderStages() {
  const w = WORLDS[selectedWorldIdx];
  document.getElementById('stages-world-name').textContent = w.name;
  const list = document.getElementById('stage-list');
  list.innerHTML = '';

  drawStageWave(w);

  let completedCount = 0;

  w.stages.forEach((s, i) => {
    const prog = getStageProgress(w.id, s.id);
    if (prog.completed) completedCount++;

    const unlocked = i === 0 || getStageProgress(w.id, w.stages[i - 1].id).completed;
    const isCurrent = unlocked && !prog.completed;

    const card = document.createElement('div');
    card.className = 'stage-card' + (isCurrent ? ' current' : '') + (!unlocked ? ' locked' : '');

    // Build card content
    const leftDiv = document.createElement('div');
    leftDiv.className = 'stage-left';

    // Show letter prominently for World 1 letter stages
    if (s.letter) {
      const letterEl = document.createElement('span');
      letterEl.className = 'stage-letter';
      letterEl.textContent = s.boss ? '\uD83D\uDC51' : s.letter;
      leftDiv.appendChild(letterEl);
    }

    const labelEl = document.createElement('span');
    labelEl.className = 'stage-label';
    labelEl.textContent = s.boss ? 'BOSS' : s.label;
    leftDiv.appendChild(labelEl);

    const soundsEl = document.createElement('span');
    soundsEl.className = 'stage-sounds';
    soundsEl.textContent = s.subtitle || s.sounds;
    leftDiv.appendChild(soundsEl);

    card.appendChild(leftDiv);

    // Right side: checkmark, stars, or lock
    if (prog.completed) {
      const check = document.createElement('span');
      check.className = 'stage-check';
      check.textContent = '\u2713';
      card.appendChild(check);
    } else if (!unlocked) {
      const lock = document.createElement('span');
      lock.className = 'stage-stars';
      lock.textContent = '\uD83D\uDD12';
      card.appendChild(lock);
    } else {
      const dash = document.createElement('span');
      dash.className = 'stage-stars';
      dash.textContent = '\u2014';
      card.appendChild(dash);
    }

    if (unlocked) {
      card.addEventListener('click', () => {
        selectedStageIdx = i;
        startLesson(selectedWorldIdx, i);
      });
    }
    list.appendChild(card);
  });

  // Progress bar
  const fill = document.getElementById('stage-progress-fill');
  fill.style.width = (w.stages.length > 0 ? (completedCount / w.stages.length) * 100 : 0) + '%';
}

function starStr(n) {
  return '\u2605'.repeat(n) + '\u2606'.repeat(3 - n);
}

let stageWaveRAF;
function drawStageWave(w) {
  const c = document.getElementById('stageWaveCanvas');
  const ctx = c.getContext('2d');
  c.width = c.parentElement.clientWidth;
  c.height = 120;
  if (stageWaveRAF) cancelAnimationFrame(stageWaveRAF);
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = 'rgba(34,197,94,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const stages = w.stages.length || 1;
    for (let x = 0; x < c.width; x++) {
      const norm = x / c.width;
      const amp = 25 + Math.sin(norm * stages * Math.PI) * 20;
      const y = 60 + Math.sin(norm * Math.PI * 6 + t) * amp * 0.5;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    t += 0.02;
    stageWaveRAF = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════
   LESSON ENGINE
   ═══════════════════════════════════════════════ */
function startLesson(wIdx, sIdx) {
  const w = WORLDS[wIdx];
  const s = w.stages[sIdx];
  lessonState = {
    worldIdx: wIdx,
    stageIdx: sIdx,
    qIdx: 0,
    hearts: HEARTS_MAX,
    correct: 0,
    total: s.questions.length,
    answered: false,
    showingIntro: !!(s.letter && !s.boss), // Show intro for letter stages
  };
  showScreen('lesson');
  renderHearts();
  updateLessonProgress();

  if (lessonState.showingIntro) {
    showLetterIntro(s);
  } else {
    showQuestion();
  }
}

function showLetterIntro(stage) {
  const area = document.getElementById('lesson-area');
  area.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'letter-intro';

  const bigLetter = document.createElement('div');
  bigLetter.className = 'letter-big';
  bigLetter.textContent = stage.letter + ' ' + stage.letter.toLowerCase();
  card.appendChild(bigLetter);

  const ipa = document.createElement('div');
  ipa.className = 'letter-ipa';
  ipa.textContent = LETTER_IPA[stage.letter] || '';
  card.appendChild(ipa);

  const readyBtn = document.createElement('button');
  readyBtn.className = 'btn-primary ripple-btn';
  readyBtn.textContent = 'Ready?';
  readyBtn.addEventListener('click', () => {
    lessonState.showingIntro = false;
    showQuestion();
  });
  card.appendChild(readyBtn);

  area.appendChild(card);

  // Auto-play the letter sound
  setTimeout(() => speak(stage.letter, 0.7), 400);
}

function renderHearts() {
  const el = document.getElementById('lesson-hearts');
  el.textContent = '\u2764\uFE0F'.repeat(lessonState.hearts) + '\uD83D\uDDA4'.repeat(HEARTS_MAX - lessonState.hearts);
}

function updateLessonProgress() {
  const fill = document.getElementById('lesson-progress-fill');
  fill.style.width = (lessonState.qIdx / lessonState.total * 100) + '%';
}

function showQuestion() {
  const w = WORLDS[lessonState.worldIdx];
  const s = w.stages[lessonState.stageIdx];
  if (lessonState.qIdx >= s.questions.length) {
    finishLesson();
    return;
  }
  const q = s.questions[lessonState.qIdx];
  lessonState.answered = false;
  updateLessonProgress();

  const area = document.getElementById('lesson-area');
  area.innerHTML = '';

  switch (q.type) {
    case 'listen_choose': renderListenChoose(area, q); break;
    case 'same_different': renderSameDifferent(area, q); break;
    case 'find_sound': renderFindSound(area, q); break;
    case 'speed_round': renderSpeedRound(area, q); break;
  }
}

/* ── Listen & Choose ── */
function renderListenChoose(area, q) {
  const inst = document.createElement('p');
  inst.className = 'exercise-instruction';
  inst.textContent = q.instruction || '\u805E\u3044\u3066\u9078\u3079 \u2013 \u97F3\u58F0\u3092\u805E\u3044\u3066\u6B63\u3057\u3044\u5358\u8A9E\u3092\u9078\u307C\u3046';
  area.appendChild(inst);

  const playBtn = createPlayCircle(() => speak(q.audioWord));
  area.appendChild(playBtn);

  const grid = document.createElement('div');
  grid.className = 'option-grid';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (lessonState.answered) return;
      lessonState.answered = true;
      const isCorrect = i === q.correctIndex;
      if (isCorrect) {
        btn.classList.add('correct');
        onCorrect(btn);
      } else {
        btn.classList.add('wrong');
        grid.children[q.correctIndex].classList.add('correct');
        onWrong(btn);
      }
    });
    grid.appendChild(btn);
  });
  area.appendChild(grid);

  setTimeout(() => speak(q.audioWord), 400);
}

/* ── Same or Different ── */
function renderSameDifferent(area, q) {
  const inst = document.createElement('p');
  inst.className = 'exercise-instruction';
  inst.textContent = '\u540C\u3058\uFF1F\u9055\u3046\uFF1F \u2013 2\u3064\u306E\u97F3\u58F0\u3092\u805E\u304D\u6BD4\u3079\u3088\u3046';
  area.appendChild(inst);

  const row = document.createElement('div');
  row.className = 'play-circles-row';
  row.appendChild(createPlayCircle(() => speak(q.word1)));
  row.appendChild(createPlayCircle(() => speak(q.word2)));
  area.appendChild(row);

  const btns = document.createElement('div');
  btns.className = 'sd-buttons';
  ['\u540C\u3058', '\u9055\u3046'].forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'sd-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (lessonState.answered) return;
      lessonState.answered = true;
      const userSays = i === 0;
      const isCorrect = userSays === q.isSame;
      if (isCorrect) { btn.classList.add('correct'); onCorrect(btn); }
      else {
        btn.classList.add('wrong');
        btns.children[q.isSame ? 0 : 1].classList.add('correct');
        onWrong(btn);
      }
    });
    btns.appendChild(btn);
  });
  area.appendChild(btns);

  setTimeout(() => speak(q.word1), 400);
}

/* ── Find the Sound ── */
function renderFindSound(area, q) {
  const inst = document.createElement('p');
  inst.className = 'exercise-instruction';
  inst.innerHTML = '\u3053\u306E\u5358\u8A9E\u306E\u4E2D\u306E <strong style="color:#22c55e;font-family:\'JetBrains Mono\',monospace">' + q.targetSound + '</strong> \u306F\u3069\u308C\uFF1F';
  area.appendChild(inst);

  const wordRow = document.createElement('div');
  wordRow.className = 'find-word';
  const selected = new Set();

  q.word.split('').forEach((ch, i) => {
    const el = document.createElement('div');
    el.className = 'find-letter';
    el.textContent = ch;
    el.addEventListener('click', () => {
      if (lessonState.answered) return;
      if (selected.has(i)) { selected.delete(i); el.classList.remove('selected'); }
      else { selected.add(i); el.classList.add('selected'); }
    });
    wordRow.appendChild(el);
  });
  area.appendChild(wordRow);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn-primary ripple-btn find-submit';
  submitBtn.textContent = '\u6C7A\u5B9A';
  submitBtn.addEventListener('click', () => {
    if (lessonState.answered) return;
    lessonState.answered = true;
    const correctSet = new Set(q.correctLetterIndices);
    const isCorrect = selected.size === correctSet.size && [...selected].every(x => correctSet.has(x));

    wordRow.querySelectorAll('.find-letter').forEach((el, i) => {
      if (correctSet.has(i)) el.classList.add('correct-letter');
      else if (selected.has(i)) el.classList.add('wrong-letter');
    });

    if (isCorrect) onCorrect(submitBtn);
    else onWrong(submitBtn);
  });
  area.appendChild(submitBtn);

  setTimeout(() => speak(q.word), 400);
}

/* ── Speed Round ── */
function renderSpeedRound(area, q) {
  const inst = document.createElement('p');
  inst.className = 'exercise-instruction';
  inst.textContent = '\u30B9\u30D4\u30FC\u30C9\u30E9\u30A6\u30F3\u30C9 \u2013 \u3059\u3070\u3084\u304F\u6B63\u89E3\u3092\u9078\u3079\uFF01';
  area.appendChild(inst);

  const timerBar = document.createElement('div');
  timerBar.className = 'speed-timer';
  const timerFill = document.createElement('div');
  timerFill.className = 'speed-timer-fill';
  timerFill.style.width = '100%';
  timerBar.appendChild(timerFill);
  area.appendChild(timerBar);

  const comboEl = document.createElement('div');
  comboEl.className = 'speed-combo';
  area.appendChild(comboEl);

  const grid = document.createElement('div');
  grid.className = 'option-grid';
  area.appendChild(grid);

  let pairIdx = 0;
  let combo = 0;
  let timeLeft = 100;
  let timerInterval;
  let speedDone = false;

  function showPair() {
    if (pairIdx >= q.pairs.length || speedDone) {
      clearInterval(timerInterval);
      if (combo >= Math.ceil(q.pairs.length / 2)) onCorrect(grid);
      else onWrong(grid);
      return;
    }
    const pair = q.pairs[pairIdx];
    grid.innerHTML = '';
    pair.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (speedDone) return;
        if (i === pair.correctIndex) {
          btn.classList.add('correct');
          combo++;
          comboEl.textContent = combo > 1 ? combo + ' COMBO!' : '';
          timeLeft = Math.min(100, timeLeft + 15);
        } else {
          btn.classList.add('wrong');
          grid.children[pair.correctIndex].classList.add('correct');
          combo = 0;
          comboEl.textContent = '';
        }
        pairIdx++;
        setTimeout(showPair, 500);
      });
      grid.appendChild(btn);
    });
    speak(pair.audioWord);
  }

  timerInterval = setInterval(() => {
    timeLeft -= 1.5;
    timerFill.style.width = Math.max(0, timeLeft) + '%';
    if (timeLeft <= 30) timerFill.style.background = 'var(--red)';
    if (timeLeft <= 0) {
      speedDone = true;
      clearInterval(timerInterval);
      onWrong(grid);
    }
  }, 100);

  setTimeout(showPair, 300);
  lessonState.answered = true;
}

/* ── Answer Feedback ── */
function onCorrect(el) {
  lessonState.correct++;
  addXP(XP_PER_CORRECT);
  flashScreen('green', el);
  floatXP(el, '+' + XP_PER_CORRECT + ' XP');
  // 800ms pause before next question
  setTimeout(nextQuestion, 800);
}

function onWrong(el) {
  lessonState.hearts--;
  renderHearts();
  flashScreen('red', el);
  if (lessonState.hearts <= 0) {
    setTimeout(() => showScreen('fail'), 800);
  } else {
    // 800ms pause before next question
    setTimeout(nextQuestion, 800);
  }
}

function nextQuestion() {
  lessonState.qIdx++;
  showQuestion();
}

function finishLesson() {
  const w = WORLDS[lessonState.worldIdx];
  const s = w.stages[lessonState.stageIdx];
  const accuracy = lessonState.correct / lessonState.total;
  const stars = accuracy >= 1 ? 3 : accuracy >= 0.7 ? 2 : accuracy > 0 ? 1 : 0;

  const prog = getStageProgress(w.id, s.id);
  prog.completed = true;
  prog.stars = Math.max(prog.stars, stars);
  if (stars === 3) addXP(XP_BONUS_3STAR);
  saveState();

  document.getElementById('clear-stars').textContent = starStr(stars);
  document.getElementById('clear-xp').textContent = '+' + (lessonState.correct * XP_PER_CORRECT + (stars === 3 ? XP_BONUS_3STAR : 0)) + ' XP';
  showScreen('clear');
}

/* ── Visual Feedback Helpers ── */
function flashScreen(type, refEl) {
  const overlay = document.createElement('div');
  overlay.className = 'flash-overlay flash-' + type;
  if (refEl) {
    const rect = refEl.getBoundingClientRect();
    overlay.style.setProperty('--fx', (rect.left + rect.width / 2) / window.innerWidth * 100 + '%');
    overlay.style.setProperty('--fy', (rect.top + rect.height / 2) / window.innerHeight * 100 + '%');
  }
  document.body.appendChild(overlay);
  overlay.addEventListener('animationend', () => overlay.remove());
}

function floatXP(refEl, text) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = text;
  if (refEl) {
    const rect = refEl.getBoundingClientRect();
    el.style.left = rect.left + rect.width / 2 - 30 + 'px';
    el.style.top = rect.top - 10 + 'px';
  } else {
    el.style.left = '50%';
    el.style.top = '40%';
  }
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

/* ═══════════════════════════════════════════════
   PLAY CIRCLE COMPONENT
   ═══════════════════════════════════════════════ */
function createPlayCircle(onPlay) {
  const wrap = document.createElement('div');
  wrap.className = 'play-circle';
  wrap.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const wc = document.createElement('canvas');
  wc.width = 100; wc.height = 100;
  wc.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:50%;';
  wrap.appendChild(wc);

  let playing = false;
  wrap.addEventListener('click', () => {
    if (playing) return;
    playing = true;
    wrap.classList.add('playing');
    onPlay();
    let t = 0;
    const ctx = wc.getContext('2d');
    function anim() {
      ctx.clearRect(0, 0, 100, 100);
      ctx.strokeStyle = 'rgba(34,197,94,' + (0.4 + Math.sin(t * 0.3) * 0.2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.05) {
        const r = 42 + Math.sin(a * 6 + t * 0.4) * 4;
        const x = 50 + Math.cos(a) * r;
        const y = 50 + Math.sin(a) * r;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      t++;
      if (t < 60) requestAnimationFrame(anim);
      else { ctx.clearRect(0, 0, 100, 100); wrap.classList.remove('playing'); playing = false; }
    }
    anim();
  });
  return wrap;
}

/* ═══════════════════════════════════════════════
   WEB SPEECH API
   ═══════════════════════════════════════════════ */
function speak(text, rate = 0.85) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const pref = voices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha'))
             || voices.find(v => v.lang.startsWith('en-US'))
             || voices.find(v => v.lang.startsWith('en'));
  if (pref) u.voice = pref;
  window.speechSynthesis.speak(u);
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

/* ═══════════════════════════════════════════════
   SERVICE WORKER
   ═══════════════════════════════════════════════ */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
