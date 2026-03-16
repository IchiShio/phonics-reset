/**
 * Phonics Reset: Adult Edition
 * 大人のためのやり直し英語発音
 */

// ===== STATE =====
const STORAGE_KEY = 'phonics_reset_v1';
const XP_PER_CORRECT = 5;
const XP_PER_LEVEL = 100;
const MASTERY_THRESHOLD = 5; // correct answers to master

let state = {
  currentScreen: 'home',
  currentPhoneme: null,
  currentStep: 0,
  lessonSteps: [],
  exercises: [],
  exerciseIndex: 0,
  exerciseScore: 0,
  exerciseAnswered: false,
  sortState: null
};

// ===== PROGRESS =====
function defaultProgress() {
  return {
    phonemes: {},
    streak: { current: 0, lastDate: null },
    xp: 0,
    level: 1,
    activeDates: []
  };
}

function loadProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const p = JSON.parse(data);
      // Merge with defaults
      return { ...defaultProgress(), ...p };
    }
  } catch (e) { /* ignore */ }
  return defaultProgress();
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) { /* ignore */ }
}

function getPhonemeProgress(progress, id) {
  if (!progress.phonemes[id]) {
    progress.phonemes[id] = { attempts: 0, correct: 0, mastered: false, lastPracticed: null };
  }
  return progress.phonemes[id];
}

function getPhonemeStatus(progress, id) {
  const idx = UNLOCK_ORDER.indexOf(id);
  if (idx === -1) return 'locked';
  // First 3 phonemes are always available
  if (idx < 3) {
    const pp = getPhonemeProgress(progress, id);
    return pp.mastered ? 'mastered' : 'available';
  }
  // Others unlock when previous is mastered OR has at least 1 attempt
  const prevId = UNLOCK_ORDER[idx - 1];
  const prevPP = getPhonemeProgress(progress, prevId);
  if (prevPP.attempts > 0 || prevPP.mastered) {
    const pp = getPhonemeProgress(progress, id);
    return pp.mastered ? 'mastered' : 'available';
  }
  return 'locked';
}

function updateStreak(progress) {
  const today = new Date().toISOString().slice(0, 10);
  if (progress.streak.lastDate === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (progress.streak.lastDate === yesterday) {
    progress.streak.current++;
  } else if (progress.streak.lastDate !== today) {
    progress.streak.current = 1;
  }
  progress.streak.lastDate = today;

  if (!progress.activeDates) progress.activeDates = [];
  if (!progress.activeDates.includes(today)) {
    progress.activeDates.push(today);
    // Keep last 60 days
    if (progress.activeDates.length > 60) {
      progress.activeDates = progress.activeDates.slice(-60);
    }
  }
}

function addXP(progress, amount) {
  progress.xp += amount;
  while (progress.xp >= progress.level * XP_PER_LEVEL) {
    progress.xp -= progress.level * XP_PER_LEVEL;
    progress.level++;
  }
}

function getOverallCompletion(progress) {
  const total = UNLOCK_ORDER.length;
  let mastered = 0;
  for (const id of UNLOCK_ORDER) {
    if (getPhonemeProgress(progress, id).mastered) mastered++;
  }
  return Math.round((mastered / total) * 100);
}

// ===== SPEECH =====
function speak(text, rate = 0.8, onEnd = null) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = rate;
  u.pitch = 1;

  // Try to get an English voice
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en-US')) ||
                  voices.find(v => v.lang.startsWith('en'));
  if (enVoice) u.voice = enVoice;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

// Preload voices
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ===== SCREEN MANAGEMENT =====
function showScreen(name) {
  const prev = document.querySelector('.screen.active');
  const next = document.getElementById('screen-' + name);
  if (!next || next === prev) return;

  if (prev) {
    prev.classList.remove('active');
    prev.style.opacity = '0';
    prev.style.transform = 'translateY(8px)';
  }

  state.currentScreen = name;

  // Update screen content before showing
  if (name === 'home') updateHomeScreen();
  if (name === 'soundmap') updateSoundMap();
  if (name === 'progress') updateProgressScreen();

  requestAnimationFrame(() => {
    next.classList.add('active');
    requestAnimationFrame(() => {
      next.style.opacity = '1';
      next.style.transform = 'translateY(0)';
    });
  });
}

// ===== HOME SCREEN =====
function updateHomeScreen() {
  const progress = loadProgress();
  const pct = getOverallCompletion(progress);
  const circumference = 2 * Math.PI * 70;

  document.getElementById('homeProgressPercent').textContent = pct + '%';
  const ring = document.getElementById('homeProgressRing');
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = circumference - (circumference * pct / 100);

  document.getElementById('homeStreakCount').textContent = progress.streak.current;

  document.getElementById('homeLevelNum').textContent = progress.level;
  const xpNeeded = progress.level * XP_PER_LEVEL;
  document.getElementById('homeLevelXP').textContent = progress.xp + ' / ' + xpNeeded + ' XP';
  document.getElementById('homeLevelBar').style.width = (progress.xp / xpNeeded * 100) + '%';
}

// ===== SOUND MAP =====
function updateSoundMap() {
  const progress = loadProgress();
  const container = document.getElementById('soundmapContainer');
  container.innerHTML = '';

  const categories = ['vowel', 'diphthong', 'consonant', 'trouble'];

  for (const cat of categories) {
    const catData = CATEGORIES[cat];
    const phonemeIds = UNLOCK_ORDER.filter(id => PHONEMES[id] && PHONEMES[id].category === cat);
    if (phonemeIds.length === 0) continue;

    const section = document.createElement('div');
    section.className = 'soundmap-category';

    const title = document.createElement('div');
    title.className = 'soundmap-category-title';
    title.style.color = catData.color;
    title.textContent = catData.nameJa + ' ' + catData.nameEn;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'soundmap-grid';
    if (cat === 'trouble') {
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }

    for (const id of phonemeIds) {
      const phoneme = PHONEMES[id];
      const status = getPhonemeStatus(progress, id);

      const tile = document.createElement('div');
      tile.className = 'soundmap-tile ' + status;
      if (cat === 'trouble') tile.classList.add('trouble-tile');

      const ipa = document.createElement('div');
      ipa.className = 'tile-ipa';
      ipa.textContent = phoneme.ipa;
      tile.appendChild(ipa);

      if (phoneme.exampleWords && phoneme.exampleWords.length > 0) {
        const word = document.createElement('div');
        word.className = 'tile-word';
        word.textContent = phoneme.exampleWords[0].word.split(' / ')[0];
        tile.appendChild(word);
      }

      if (status !== 'locked') {
        tile.addEventListener('click', () => startLesson(id));
      }

      grid.appendChild(tile);
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

// ===== LESSON =====
function startLesson(phonemeId) {
  const phoneme = PHONEMES[phonemeId];
  if (!phoneme) return;

  state.currentPhoneme = phonemeId;
  state.currentStep = 0;

  document.getElementById('lessonTitle').textContent = phoneme.ipa;
  buildLessonCards(phoneme);
  updateLessonDots();
  updateLessonNav();
  showScreen('lesson');
}

function buildLessonCards(phoneme) {
  const container = document.getElementById('lessonCardContainer');
  container.innerHTML = '';
  state.lessonSteps = [];

  // Step 1: Intro
  const introCard = createLessonCard('STEP 1 - イントロ', `
    <div class="lesson-ipa-large">${phoneme.ipa}</div>
    <div class="lesson-name-ja">${phoneme.nameJa}</div>
    <div class="lesson-description">${phoneme.description}</div>
  `);
  container.appendChild(introCard);
  state.lessonSteps.push('intro');

  // Step 2: Mouth Position
  const mouthCard = createLessonCard('STEP 2 - 口の形', `
    <div class="mouth-diagram">
      ${generateMouthSVG(phoneme.id)}
    </div>
    <div class="mouth-description">${phoneme.mouthPosition.replace(/\n/g, '<br>')}</div>
  `);
  container.appendChild(mouthCard);
  state.lessonSteps.push('mouth');

  // Step 3: Listen
  let exampleWordsHTML = '';
  if (phoneme.exampleWords) {
    for (const w of phoneme.exampleWords) {
      const word = w.word.split(' / ')[0];
      exampleWordsHTML += `
        <div class="example-word" onclick="speak('${w.audioText}', 0.75)">
          <div class="example-word-text">
            <div class="example-word-en">${highlightWord(w.word, w.highlight)}</div>
            <div class="example-word-phonetic">${w.phonetic}</div>
          </div>
          <div class="example-word-ja">${w.meaning}</div>
          <div class="example-word-speaker">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </div>
        </div>`;
    }
  }

  const firstWord = phoneme.exampleWords ? phoneme.exampleWords[0].audioText : '';
  const listenCard = createLessonCard('STEP 3 - 聞いてみよう', `
    <button class="listen-play-btn" onclick="speak('${firstWord}', 0.6)">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#fff">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
    <div class="example-words">${exampleWordsHTML}</div>
  `);
  container.appendChild(listenCard);
  state.lessonSteps.push('listen');

  // Step 4: Compare
  const compareCard = createLessonCard('STEP 4 - よくある間違い', `
    <div class="compare-block">
      <div class="compare-wrong">
        <div class="compare-label">NG</div>
        <div class="compare-text">${phoneme.katakanaWrong}</div>
      </div>
      <div class="compare-arrow">&rarr;</div>
      <div class="compare-right">
        <div class="compare-label">OK</div>
        <div class="compare-text">${phoneme.ipa}</div>
      </div>
    </div>
    <div class="mistake-explanation">${phoneme.commonMistake.replace(/\n/g, '<br>')}</div>
  `);
  container.appendChild(compareCard);
  state.lessonSteps.push('compare');

  // Step 5: Practice prompt
  const practiceCard = createLessonCard('STEP 5 - 練習', `
    <div style="text-align:center; padding: 20px 0;">
      <div class="lesson-ipa-large" style="font-size:2.5rem; margin-bottom:16px;">${phoneme.ipa}</div>
      <p class="lesson-description" style="text-align:center; margin-bottom:24px;">
        学んだことを練習で確認しましょう。<br>5問のクイズに挑戦します。
      </p>
      <button class="btn-primary" onclick="startPractice('${phoneme.id}')">
        練習を始める
      </button>
    </div>
  `);
  container.appendChild(practiceCard);
  state.lessonSteps.push('practice');

  updateLessonPosition(false);
}

function createLessonCard(stepLabel, contentHTML) {
  const card = document.createElement('div');
  card.className = 'lesson-card';
  card.innerHTML = `
    <div class="lesson-card-inner">
      <div class="lesson-step-label">${stepLabel}</div>
      ${contentHTML}
    </div>
  `;
  return card;
}

function highlightWord(word, highlight) {
  if (!highlight || highlight.length < 2) return word;
  const clean = word.split(' / ')[0];
  const [start, end] = highlight;
  if (start >= clean.length) return clean;
  const s = Math.min(start, clean.length);
  const e = Math.min(end, clean.length);
  return clean.slice(0, s) +
    '<span class="text-accent" style="font-weight:800">' + clean.slice(s, e) + '</span>' +
    clean.slice(e);
}

function updateLessonDots() {
  const dots = document.getElementById('lessonDots');
  dots.innerHTML = '';
  for (let i = 0; i < state.lessonSteps.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'lesson-dot';
    if (i === state.currentStep) dot.classList.add('active');
    else if (i < state.currentStep) dot.classList.add('completed');
    dots.appendChild(dot);
  }
}

function updateLessonNav() {
  const prevBtn = document.getElementById('lessonPrev');
  const nextBtn = document.getElementById('lessonNext');
  const nextLabel = document.getElementById('lessonNextLabel');

  prevBtn.style.visibility = state.currentStep === 0 ? 'hidden' : 'visible';

  if (state.currentStep === state.lessonSteps.length - 1) {
    nextBtn.style.visibility = 'hidden';
  } else {
    nextBtn.style.visibility = 'visible';
    nextLabel.textContent = '次へ';
  }
}

function updateLessonPosition(animate = true) {
  const cards = document.querySelectorAll('#lessonCardContainer .lesson-card');
  cards.forEach((card, i) => {
    card.style.transition = animate ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    card.style.transform = `translateX(${(i - state.currentStep) * 100}%)`;
  });
}

function lessonNext() {
  if (state.currentStep < state.lessonSteps.length - 1) {
    state.currentStep++;
    updateLessonPosition();
    updateLessonDots();
    updateLessonNav();
  }
}

function lessonPrev() {
  if (state.currentStep > 0) {
    state.currentStep--;
    updateLessonPosition();
    updateLessonDots();
    updateLessonNav();
  }
}

function exitLesson() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  showScreen('soundmap');
}

// Touch swipe support for lesson cards
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  if (state.currentScreen !== 'lesson') return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (state.currentScreen !== 'lesson') return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx < 0) lessonNext();
    else lessonPrev();
  }
}, { passive: true });

// ===== MOUTH SVG =====
function generateMouthSVG(phonemeId) {
  // Generate simple but informative mouth position diagrams
  const svgs = {
    // Vowels - show mouth opening and tongue position
    'ae': mouthSVG('wide-open', 'low-front', 'spread'),
    'ah': mouthSVG('medium', 'mid-center', 'neutral'),
    'er': mouthSVG('small', 'mid-center', 'round-slight'),
    'ih': mouthSVG('small', 'high-front', 'neutral'),
    'ee': mouthSVG('small', 'high-front', 'spread'),
    'uh': mouthSVG('small', 'high-back', 'round'),
    'oo': mouthSVG('small', 'high-back', 'round-strong'),
    'oh': mouthSVG('medium', 'low-back', 'round'),
    'aw': mouthSVG('medium', 'low-back', 'round-strong'),
    'schwa': mouthSVG('small', 'mid-center', 'neutral'),
    'e': mouthSVG('medium', 'mid-front', 'neutral'),
    'aa': mouthSVG('wide-open', 'low-back', 'neutral'),
    // Diphthongs
    'ei': mouthSVG('medium', 'mid-front', 'spread', true),
    'ai': mouthSVG('wide-open', 'low-center', 'neutral', true),
    // Consonants - show tongue/lip placement
    'th_voiceless': consonantSVG('tongue-teeth'),
    'th_voiced': consonantSVG('tongue-teeth-voiced'),
    'l': consonantSVG('tongue-ridge'),
    'r': consonantSVG('tongue-curl'),
    'v': consonantSVG('teeth-lip-voiced'),
    'f': consonantSVG('teeth-lip'),
    'ng': consonantSVG('tongue-back'),
    'sh': consonantSVG('tongue-palatal'),
    'ch': consonantSVG('tongue-palatal-stop'),
    'dj': consonantSVG('tongue-palatal-stop-voiced'),
    'w': consonantSVG('lips-round'),
    'j': consonantSVG('tongue-palate'),
    // Trouble pairs
    'lr': consonantSVG('lr-compare'),
    'th_s': consonantSVG('th-s-compare'),
    'vb': consonantSVG('vb-compare'),
    'fh': consonantSVG('fh-compare'),
    'ae_ah': mouthSVG('wide-open', 'low-front', 'spread'),
  };

  return svgs[phonemeId] || mouthSVG('medium', 'mid-center', 'neutral');
}

function mouthSVG(opening, tongue, lips, isDiphthong = false) {
  let mouthW, lipShape;

  // Mouth opening width
  const openings = { 'wide-open': 30, 'medium': 22, 'small': 14 };
  mouthW = openings[opening] || 22;

  // Lip shape path
  const lipSpread = lips.includes('spread') ? 15 : lips.includes('round') ? -8 : 0;

  // Tongue position
  const tonguePositions = {
    'low-front': { x: 140, y: 130 },
    'low-back': { x: 170, y: 130 },
    'low-center': { x: 155, y: 130 },
    'mid-front': { x: 140, y: 115 },
    'mid-center': { x: 155, y: 115 },
    'mid-back': { x: 170, y: 115 },
    'high-front': { x: 140, y: 100 },
    'high-back': { x: 170, y: 100 }
  };
  const tp = tonguePositions[tongue] || tonguePositions['mid-center'];

  const isRound = lips.includes('round');
  const lipColor = isRound ? '#e17055' : '#a29bfe';

  return `<svg viewBox="0 0 300 200" class="mouth-svg-container">
    <!-- Head outline -->
    <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
    <!-- Mouth cavity -->
    <ellipse cx="155" cy="${115 + mouthW/3}" rx="${40 + lipSpread}" ry="${mouthW}" fill="#1a1a2e" stroke="${lipColor}" stroke-width="2.5"/>
    ${isRound ? `<ellipse cx="155" cy="${115 + mouthW/3}" rx="${30 + lipSpread}" ry="${mouthW - 3}" fill="none" stroke="${lipColor}" stroke-width="1" opacity="0.4"/>` : ''}
    <!-- Upper teeth -->
    <rect x="135" y="${105}" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
    <!-- Tongue -->
    <ellipse cx="${tp.x}" cy="${tp.y}" rx="25" ry="10" fill="#e17055" opacity="0.6"/>
    ${isDiphthong ? `
      <!-- Arrow showing tongue movement -->
      <line x1="${tp.x}" y1="${tp.y}" x2="${tp.x - 10}" y2="${tp.y - 15}" stroke="#6c5ce7" stroke-width="2" marker-end="url(#arrowhead)"/>
      <defs><marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#6c5ce7"/></marker></defs>
    ` : ''}
    <!-- Labels -->
    <text x="155" y="25" text-anchor="middle" fill="#666" font-size="11" font-family="Inter, sans-serif">
      ${isRound ? '唇を丸める' : lips.includes('spread') ? '唇を横に引く' : '自然な唇'}
    </text>
  </svg>`;
}

function consonantSVG(type) {
  const diagrams = {
    'tongue-teeth': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
      <!-- Tongue touching teeth -->
      <path d="M130 140 Q150 108 160 115" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="1.5"/>
      <circle cx="152" cy="113" r="4" fill="#e17055" opacity="0.9"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌先を歯に当てる</text>
      <line x1="152" y1="30" x2="152" y2="105" stroke="#6c5ce7" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>
    </svg>`,
    'tongue-teeth-voiced': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
      <path d="M130 140 Q150 108 160 115" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="1.5"/>
      <circle cx="152" cy="113" r="4" fill="#e17055" opacity="0.9"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌先を歯に + 声を出す</text>
      <!-- Vibration lines -->
      <path d="M100 160 Q105 155 110 160 Q115 165 120 160" fill="none" stroke="#00b894" stroke-width="1.5" opacity="0.6"/>
      <path d="M190 160 Q195 155 200 160 Q205 165 210 160" fill="none" stroke="#00b894" stroke-width="1.5" opacity="0.6"/>
    </svg>`,
    'tongue-ridge': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
      <!-- Tongue tip on ridge -->
      <path d="M130 145 Q145 125 157 112" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="1.5"/>
      <circle cx="157" cy="112" r="4" fill="#e17055" opacity="0.9"/>
      <!-- Air arrows on sides -->
      <path d="M130 130 L115 125" stroke="#6c5ce7" stroke-width="1.5" marker-end="url(#arr)" opacity="0.5"/>
      <path d="M180 130 L195 125" stroke="#6c5ce7" stroke-width="1.5" marker-end="url(#arr)" opacity="0.5"/>
      <defs><marker id="arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#6c5ce7"/></marker></defs>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌先を歯茎に付ける</text>
    </svg>`,
    'tongue-curl': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
      <!-- Curled tongue not touching -->
      <path d="M130 145 Q142 130 148 125 Q152 120 148 118" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="2"/>
      <!-- Gap indicator -->
      <text x="155" y="108" text-anchor="middle" fill="#6c5ce7" font-size="9" font-family="Inter, sans-serif" opacity="0.7">触れない</text>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌を丸めて後ろに引く</text>
    </svg>`,
    'teeth-lip': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.7"/>
      <!-- Teeth on lip -->
      <rect x="142" y="120" width="8" height="6" rx="1" fill="#eee" opacity="0.8"/>
      <rect x="152" y="120" width="8" height="6" rx="1" fill="#eee" opacity="0.8"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">上の歯を下唇に当てる</text>
    </svg>`,
    'teeth-lip-voiced': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.7"/>
      <rect x="142" y="120" width="8" height="6" rx="1" fill="#eee" opacity="0.8"/>
      <rect x="152" y="120" width="8" height="6" rx="1" fill="#eee" opacity="0.8"/>
      <path d="M100 160 Q105 155 110 160 Q115 165 120 160" fill="none" stroke="#00b894" stroke-width="1.5" opacity="0.6"/>
      <path d="M190 160 Q195 155 200 160 Q205 165 210 160" fill="none" stroke="#00b894" stroke-width="1.5" opacity="0.6"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">上の歯を下唇に + 声</text>
    </svg>`,
    'tongue-back': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
      <!-- Tongue back raised -->
      <path d="M130 145 Q145 140 165 115 Q175 105 180 110" fill="#e17055" opacity="0.6" stroke="#e17055" stroke-width="1.5"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌の奥を上あごに付ける</text>
      <!-- Nose arrow -->
      <path d="M155 75 L155 60" stroke="#00b894" stroke-width="2" marker-end="url(#arr2)"/>
      <text x="175" y="60" fill="#00b894" font-size="9" font-family="Inter, sans-serif">鼻へ</text>
      <defs><marker id="arr2" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#00b894"/></marker></defs>
    </svg>`,
    'tongue-palatal': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="35" ry="16" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="137" y="114" width="36" height="9" rx="3" fill="#ddd" opacity="0.6"/>
      <path d="M130 145 Q148 125 155 118" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="1.5"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">唇を丸めて摩擦音</text>
    </svg>`,
    'tongue-palatal-stop': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="35" ry="16" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="137" y="114" width="36" height="9" rx="3" fill="#ddd" opacity="0.6"/>
      <path d="M130 145 Q148 120 158 115" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="2"/>
      <circle cx="158" cy="115" r="3" fill="#e17055"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌を付けてから離す</text>
    </svg>`,
    'tongue-palatal-stop-voiced': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="35" ry="16" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="137" y="114" width="36" height="9" rx="3" fill="#ddd" opacity="0.6"/>
      <path d="M130 145 Q148 120 158 115" fill="#e17055" opacity="0.7" stroke="#e17055" stroke-width="2"/>
      <circle cx="158" cy="115" r="3" fill="#e17055"/>
      <path d="M100 160 Q105 155 110 160 Q115 165 120 160" fill="none" stroke="#00b894" stroke-width="1.5" opacity="0.6"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌を付けて離す + 声</text>
    </svg>`,
    'lips-round': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <!-- Rounded lips emphasized -->
      <ellipse cx="155" cy="125" rx="20" ry="22" fill="#1a1a2e" stroke="#e17055" stroke-width="3"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">唇を強く丸めて突き出す</text>
    </svg>`,
    'tongue-palate': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <ellipse cx="155" cy="105" rx="90" ry="85" fill="none" stroke="#333" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="155" cy="130" rx="40" ry="18" fill="#1a1a2e" stroke="#a29bfe" stroke-width="2.5"/>
      <rect x="135" y="112" width="40" height="10" rx="3" fill="#ddd" opacity="0.6"/>
      <!-- Tongue front raised near palate -->
      <path d="M130 145 Q145 125 150 110" fill="#e17055" opacity="0.6" stroke="#e17055" stroke-width="1.5"/>
      <text x="155" y="25" text-anchor="middle" fill="#6c5ce7" font-size="12" font-family="Inter, sans-serif" font-weight="600">舌の前部を上あごに近づける</text>
    </svg>`,
    // Comparison diagrams for trouble sounds
    'lr-compare': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <text x="75" y="25" text-anchor="middle" fill="#e17055" font-size="14" font-family="Inter, sans-serif" font-weight="700">/l/</text>
      <text x="225" y="25" text-anchor="middle" fill="#6c5ce7" font-size="14" font-family="Inter, sans-serif" font-weight="700">/r/</text>
      <!-- L side -->
      <ellipse cx="75" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="75" cy="120" rx="25" ry="12" fill="#1a1a2e" stroke="#e17055" stroke-width="2"/>
      <path d="M55 135 Q68 112 80 108" fill="#e17055" opacity="0.6" stroke="#e17055" stroke-width="2"/>
      <circle cx="80" cy="108" r="3" fill="#e17055"/>
      <text x="75" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">舌が歯茎に付く</text>
      <!-- R side -->
      <ellipse cx="225" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="225" cy="120" rx="25" ry="12" fill="#1a1a2e" stroke="#6c5ce7" stroke-width="2"/>
      <path d="M205 135 Q215 122 220 118 Q224 114 220 112" fill="#6c5ce7" opacity="0.6" stroke="#6c5ce7" stroke-width="2"/>
      <text x="225" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">舌はどこにも付かない</text>
      <!-- Divider -->
      <line x1="150" y1="35" x2="150" y2="175" stroke="#333" stroke-width="1" stroke-dasharray="4,4"/>
    </svg>`,
    'th-s-compare': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <text x="75" y="25" text-anchor="middle" fill="#e17055" font-size="14" font-family="Inter, sans-serif" font-weight="700">/θ/</text>
      <text x="225" y="25" text-anchor="middle" fill="#6c5ce7" font-size="14" font-family="Inter, sans-serif" font-weight="700">/s/</text>
      <ellipse cx="75" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="75" cy="120" rx="25" ry="12" fill="#1a1a2e" stroke="#e17055" stroke-width="2"/>
      <rect x="62" y="108" width="26" height="7" rx="2" fill="#ddd" opacity="0.6"/>
      <path d="M55 135 Q68 112 76 110" fill="#e17055" opacity="0.6" stroke="#e17055" stroke-width="2"/>
      <circle cx="76" cy="110" r="3" fill="#e17055"/>
      <text x="75" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">舌が歯に当たる</text>
      <ellipse cx="225" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="225" cy="120" rx="25" ry="12" fill="#1a1a2e" stroke="#6c5ce7" stroke-width="2"/>
      <rect x="212" y="108" width="26" height="7" rx="2" fill="#ddd" opacity="0.6"/>
      <path d="M205 135 Q218 120 225 115" fill="#6c5ce7" opacity="0.6" stroke="#6c5ce7" stroke-width="2"/>
      <text x="225" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">舌は歯茎の近く</text>
      <line x1="150" y1="35" x2="150" y2="175" stroke="#333" stroke-width="1" stroke-dasharray="4,4"/>
    </svg>`,
    'vb-compare': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <text x="75" y="25" text-anchor="middle" fill="#e17055" font-size="14" font-family="Inter, sans-serif" font-weight="700">/v/</text>
      <text x="225" y="25" text-anchor="middle" fill="#6c5ce7" font-size="14" font-family="Inter, sans-serif" font-weight="700">/b/</text>
      <ellipse cx="75" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="75" cy="120" rx="25" ry="12" fill="#1a1a2e" stroke="#e17055" stroke-width="2"/>
      <rect x="66" y="113" width="6" height="5" rx="1" fill="#eee" opacity="0.8"/>
      <rect x="74" y="113" width="6" height="5" rx="1" fill="#eee" opacity="0.8"/>
      <text x="75" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">歯を唇に当てる</text>
      <ellipse cx="225" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <line x1="200" y1="120" x2="250" y2="120" stroke="#6c5ce7" stroke-width="3"/>
      <text x="225" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">両唇を閉じて破裂</text>
      <line x1="150" y1="35" x2="150" y2="175" stroke="#333" stroke-width="1" stroke-dasharray="4,4"/>
    </svg>`,
    'fh-compare': `<svg viewBox="0 0 300 200" class="mouth-svg-container">
      <text x="75" y="25" text-anchor="middle" fill="#e17055" font-size="14" font-family="Inter, sans-serif" font-weight="700">/f/</text>
      <text x="225" y="25" text-anchor="middle" fill="#6c5ce7" font-size="14" font-family="Inter, sans-serif" font-weight="700">/h/</text>
      <ellipse cx="75" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="75" cy="120" rx="25" ry="12" fill="#1a1a2e" stroke="#e17055" stroke-width="2"/>
      <rect x="66" y="113" width="6" height="5" rx="1" fill="#eee" opacity="0.8"/>
      <rect x="74" y="113" width="6" height="5" rx="1" fill="#eee" opacity="0.8"/>
      <text x="75" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">歯を唇に当てる</text>
      <ellipse cx="225" cy="110" rx="50" ry="50" fill="none" stroke="#333" stroke-width="1" opacity="0.3"/>
      <ellipse cx="225" cy="120" rx="30" ry="15" fill="#1a1a2e" stroke="#6c5ce7" stroke-width="2"/>
      <path d="M225 90 L225 75" stroke="#6c5ce7" stroke-width="2" marker-end="url(#arr3)" opacity="0.6"/>
      <defs><marker id="arr3" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#6c5ce7"/></marker></defs>
      <text x="225" y="165" text-anchor="middle" fill="#888" font-size="9" font-family="Inter, sans-serif">口の形なし、喉から息</text>
      <line x1="150" y1="35" x2="150" y2="175" stroke="#333" stroke-width="1" stroke-dasharray="4,4"/>
    </svg>`
  };

  return diagrams[type] || diagrams['tongue-teeth'];
}

// ===== PRACTICE / EXERCISES =====
function startPractice(phonemeId) {
  state.currentPhoneme = phonemeId;
  state.exercises = generateExercises(phonemeId);
  state.exerciseIndex = 0;
  state.exerciseScore = 0;

  const phoneme = PHONEMES[phonemeId];
  document.getElementById('practiceTitle').textContent = phoneme.ipa + ' 練習';
  showScreen('practice');
  renderExercise();
}

function generateExercises(phonemeId) {
  const phoneme = PHONEMES[phonemeId];
  if (!phoneme) return [];

  const types = [];
  // Available exercise types based on phoneme data
  if (phoneme.exampleWords && phoneme.exampleWords.length >= 2) {
    types.push('listenChoose');
    types.push('soundSpot');
  }
  if (phoneme.minimalPairs && phoneme.minimalPairs.length >= 2) {
    types.push('minimalPair');
  }
  if (phoneme.exampleWords && phoneme.exampleWords.length >= 3) {
    types.push('wordSort');
  }

  const exercises = [];
  for (let i = 0; i < 5; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    exercises.push(createExercise(type, phoneme, i));
  }
  return exercises;
}

function createExercise(type, phoneme, index) {
  switch (type) {
    case 'listenChoose': return createListenChoose(phoneme);
    case 'minimalPair': return createMinimalPair(phoneme);
    case 'soundSpot': return createSoundSpot(phoneme);
    case 'wordSort': return createWordSort(phoneme);
    default: return createListenChoose(phoneme);
  }
}

function createListenChoose(phoneme) {
  const words = [...phoneme.exampleWords];
  shuffle(words);
  const correct = words[0];

  // Get distractor words from other phonemes
  const distractors = [];
  const otherIds = UNLOCK_ORDER.filter(id => id !== phoneme.id && PHONEMES[id]);
  shuffle(otherIds);
  for (const id of otherIds) {
    const other = PHONEMES[id];
    if (other.exampleWords) {
      for (const w of other.exampleWords) {
        const cw = w.word.split(' / ')[0];
        if (cw !== correct.word.split(' / ')[0] && distractors.length < 2) {
          distractors.push(cw);
        }
      }
    }
    if (distractors.length >= 2) break;
  }

  const options = [correct.word.split(' / ')[0], ...distractors];
  shuffle(options);

  return {
    type: 'listenChoose',
    typeLabel: '聞いて選ぶ',
    instruction: '音声を聞いて、正しい単語を選んでください',
    audioText: correct.audioText,
    correctAnswer: correct.word.split(' / ')[0],
    options: options,
    meaning: correct.meaning
  };
}

function createMinimalPair(phoneme) {
  const pairs = [...phoneme.minimalPairs];
  shuffle(pairs);
  const pair = pairs[0];
  const isSame = Math.random() < 0.3;
  let word1, word2;

  if (isSame) {
    word1 = pair[Math.random() < 0.5 ? 0 : 1];
    word2 = word1;
  } else {
    word1 = pair[0];
    word2 = pair[1];
  }

  return {
    type: 'minimalPair',
    typeLabel: '最小対',
    instruction: '2つの単語を聞いてください。同じですか？違いますか？',
    word1: word1,
    word2: word2,
    isSame: isSame,
    correctAnswer: isSame ? 'same' : 'different',
    pair: pair
  };
}

function createSoundSpot(phoneme) {
  const words = [...phoneme.exampleWords].filter(w => !w.word.includes('/'));
  shuffle(words);
  const chosen = words[0] || phoneme.exampleWords[0];
  const word = chosen.word.split(' / ')[0];

  return {
    type: 'soundSpot',
    typeLabel: '音を見つけて',
    instruction: `この単語の中で ${phoneme.ipa} の音を作る文字をタップしてください`,
    word: word,
    highlight: chosen.highlight || [0, 1],
    audioText: chosen.audioText
  };
}

function createWordSort(phoneme) {
  // Get words that contain this phoneme
  const targetWords = phoneme.exampleWords.slice(0, 2).map(w => w.word.split(' / ')[0]);

  // Get words from a different phoneme
  const otherIds = UNLOCK_ORDER.filter(id => id !== phoneme.id && PHONEMES[id] && PHONEMES[id].exampleWords);
  shuffle(otherIds);
  const otherId = otherIds[0];
  const otherPhoneme = PHONEMES[otherId];
  const otherWords = otherPhoneme.exampleWords.slice(0, 2).map(w => w.word.split(' / ')[0]);

  const allWords = [...targetWords, ...otherWords];
  shuffle(allWords);

  return {
    type: 'wordSort',
    typeLabel: '仲間分け',
    instruction: `それぞれの単語を正しい音のグループに分けてください`,
    words: allWords,
    bucket1: { label: phoneme.ipa, words: targetWords },
    bucket2: { label: otherPhoneme.ipa, words: otherWords }
  };
}

function renderExercise() {
  const ex = state.exercises[state.exerciseIndex];
  if (!ex) return;

  state.exerciseAnswered = false;
  state.sortState = null;

  const total = state.exercises.length;
  document.getElementById('practiceCounter').textContent = (state.exerciseIndex + 1) + ' / ' + total;
  document.getElementById('practiceProgressFill').style.width = (state.exerciseIndex / total * 100) + '%';

  const content = document.getElementById('practiceContent');

  switch (ex.type) {
    case 'listenChoose': renderListenChoose(content, ex); break;
    case 'minimalPair': renderMinimalPair(content, ex); break;
    case 'soundSpot': renderSoundSpot(content, ex); break;
    case 'wordSort': renderWordSort(content, ex); break;
  }
}

function renderListenChoose(container, ex) {
  container.innerHTML = `
    <div class="practice-type-label">${ex.typeLabel}</div>
    <div class="practice-instruction">${ex.instruction}</div>
    <button class="practice-play-btn" onclick="speak('${ex.audioText}', 0.7)">
      <svg viewBox="0 0 24 24" width="36" height="36" fill="#fff">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
    <div class="practice-choices">
      ${ex.options.map((opt, i) => `
        <button class="practice-choice" data-idx="${i}" onclick="answerListenChoose(this, '${opt.replace(/'/g, "\\'")}', '${ex.correctAnswer.replace(/'/g, "\\'")}')">${opt}</button>
      `).join('')}
    </div>
    <div id="practiceFeedback"></div>
  `;
  // Auto-play
  setTimeout(() => speak(ex.audioText, 0.7), 300);
}

function answerListenChoose(btn, selected, correct) {
  if (state.exerciseAnswered) return;
  state.exerciseAnswered = true;

  const isCorrect = selected === correct;
  if (isCorrect) state.exerciseScore++;

  // Highlight buttons
  const buttons = btn.parentElement.querySelectorAll('.practice-choice');
  buttons.forEach(b => {
    const val = b.textContent.trim();
    if (val === correct) b.classList.add('correct');
    if (val === selected && !isCorrect) b.classList.add('incorrect');
    b.style.pointerEvents = 'none';
  });

  showFeedback(isCorrect, isCorrect ? '正解！' : `正解は "${correct}" です`);
}

function renderMinimalPair(container, ex) {
  container.innerHTML = `
    <div class="practice-type-label">${ex.typeLabel}</div>
    <div class="practice-instruction">${ex.instruction}</div>
    <div style="display:flex; gap:12px; justify-content:center; margin-bottom:24px;">
      <button class="practice-play-btn" style="width:64px;height:64px;" onclick="speak('${ex.word1}', 0.65)">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button class="practice-play-btn" style="width:64px;height:64px;" onclick="speak('${ex.word2}', 0.65)">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>
    <div class="practice-pair-btns">
      <button class="practice-pair-btn" onclick="answerMinimalPair(this, 'same', '${ex.correctAnswer}')">同じ</button>
      <button class="practice-pair-btn" onclick="answerMinimalPair(this, 'different', '${ex.correctAnswer}')">違う</button>
    </div>
    <div id="practiceFeedback"></div>
  `;
  // Auto-play sequence
  setTimeout(() => {
    speak(ex.word1, 0.65, () => {
      setTimeout(() => speak(ex.word2, 0.65), 500);
    });
  }, 300);
}

function answerMinimalPair(btn, answer, correct) {
  if (state.exerciseAnswered) return;
  state.exerciseAnswered = true;

  const isCorrect = answer === correct;
  if (isCorrect) state.exerciseScore++;

  const buttons = btn.parentElement.querySelectorAll('.practice-pair-btn');
  buttons.forEach(b => {
    b.style.pointerEvents = 'none';
  });
  btn.classList.add(isCorrect ? 'correct' : 'incorrect');

  const ex = state.exercises[state.exerciseIndex];
  const detail = ex.isSame ? `両方とも "${ex.word1}" でした` : `"${ex.pair[0]}" と "${ex.pair[1]}" は違う音です`;
  showFeedback(isCorrect, isCorrect ? '正解！' + detail : '不正解。' + detail);
}

function renderSoundSpot(container, ex) {
  const letters = ex.word.split('');
  container.innerHTML = `
    <div class="practice-type-label">${ex.typeLabel}</div>
    <div class="practice-instruction">${ex.instruction}</div>
    <button class="practice-play-btn" style="width:64px;height:64px;margin-bottom:20px;" onclick="speak('${ex.audioText}', 0.7)">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
    </button>
    <div class="practice-word-letters">
      ${letters.map((l, i) => `<button class="practice-letter" data-idx="${i}" onclick="toggleSoundSpotLetter(this)">${l}</button>`).join('')}
    </div>
    <button class="practice-submit-btn" id="soundSpotSubmit" onclick="submitSoundSpot()">確認する</button>
    <div id="practiceFeedback"></div>
  `;
  setTimeout(() => speak(ex.audioText, 0.7), 300);
}

function toggleSoundSpotLetter(btn) {
  if (state.exerciseAnswered) return;
  btn.classList.toggle('selected');
}

function submitSoundSpot() {
  if (state.exerciseAnswered) return;
  state.exerciseAnswered = true;

  const ex = state.exercises[state.exerciseIndex];
  const [start, end] = ex.highlight;
  const letters = document.querySelectorAll('.practice-letter');

  let allCorrect = true;
  letters.forEach((btn, i) => {
    const shouldBeSelected = i >= start && i < end;
    const isSelected = btn.classList.contains('selected');
    btn.style.pointerEvents = 'none';

    if (shouldBeSelected) {
      btn.classList.add('correct');
      if (!isSelected) allCorrect = false;
    } else if (isSelected) {
      btn.classList.add('incorrect');
      allCorrect = false;
    }
  });

  if (allCorrect) state.exerciseScore++;

  document.getElementById('soundSpotSubmit').style.display = 'none';
  showFeedback(allCorrect, allCorrect ? '正解！' : `"${ex.word}" の中で ${state.currentPhoneme ? PHONEMES[state.currentPhoneme].ipa : ''} の音は "${ex.word.slice(start, end)}" の部分です`);
}

function renderWordSort(container, ex) {
  state.sortState = {
    placements: {}, // word -> bucket (1 or 2)
    words: ex.words
  };

  container.innerHTML = `
    <div class="practice-type-label">${ex.typeLabel}</div>
    <div class="practice-instruction">${ex.instruction}</div>
    <div class="practice-buckets">
      <div class="practice-bucket" id="bucket1" onclick="cycleBucketTarget(1)">
        <div class="practice-bucket-label">${ex.bucket1.label}</div>
        <div id="bucket1Words"></div>
      </div>
      <div class="practice-bucket" id="bucket2" onclick="cycleBucketTarget(2)">
        <div class="practice-bucket-label">${ex.bucket2.label}</div>
        <div id="bucket2Words"></div>
      </div>
    </div>
    <div class="practice-sortable-words" id="sortableWords">
      ${ex.words.map((w, i) => `<button class="practice-sort-word" data-word="${w}" data-idx="${i}" onclick="tapSortWord(this)">${w}</button>`).join('')}
    </div>
    <button class="practice-submit-btn" id="sortSubmit" onclick="submitWordSort()" disabled>確認する</button>
    <div id="practiceFeedback"></div>
  `;

  // Active bucket tracker
  state.sortState.activeBucket = 1;
}

function tapSortWord(btn) {
  if (state.exerciseAnswered) return;
  const word = btn.dataset.word;
  const ss = state.sortState;

  if (ss.placements[word]) {
    // Remove from bucket
    delete ss.placements[word];
    btn.classList.remove('placed');
    updateBucketDisplay();
    return;
  }

  // Determine which bucket: alternate or use the one with fewer items
  const b1Count = Object.values(ss.placements).filter(v => v === 1).length;
  const b2Count = Object.values(ss.placements).filter(v => v === 2).length;
  const targetBucket = b1Count <= b2Count ? 1 : 2;

  ss.placements[word] = targetBucket;
  btn.classList.add('placed');
  updateBucketDisplay();

  // Enable submit when all placed
  const allPlaced = ss.words.every(w => ss.placements[w]);
  document.getElementById('sortSubmit').disabled = !allPlaced;
}

function updateBucketDisplay() {
  const ss = state.sortState;
  const b1Div = document.getElementById('bucket1Words');
  const b2Div = document.getElementById('bucket2Words');
  b1Div.innerHTML = '';
  b2Div.innerHTML = '';

  for (const [word, bucket] of Object.entries(ss.placements)) {
    const span = document.createElement('span');
    span.className = 'practice-sort-word in-bucket';
    span.textContent = word;
    span.onclick = () => {
      // Toggle bucket
      ss.placements[word] = bucket === 1 ? 2 : 1;
      updateBucketDisplay();
    };
    (bucket === 1 ? b1Div : b2Div).appendChild(span);
  }
}

function submitWordSort() {
  if (state.exerciseAnswered) return;
  state.exerciseAnswered = true;

  const ex = state.exercises[state.exerciseIndex];
  const ss = state.sortState;

  let allCorrect = true;

  // Check each word
  for (const word of ex.words) {
    const bucket = ss.placements[word];
    const inBucket1 = ex.bucket1.words.includes(word);
    const correct = (inBucket1 && bucket === 1) || (!inBucket1 && bucket === 2);
    if (!correct) allCorrect = false;
  }

  if (allCorrect) state.exerciseScore++;

  // Visual feedback
  const b1Words = document.getElementById('bucket1Words');
  const b2Words = document.getElementById('bucket2Words');
  [b1Words, b2Words].forEach((div, bIdx) => {
    div.querySelectorAll('.practice-sort-word').forEach(span => {
      const word = span.textContent;
      const correct = bIdx === 0 ? ex.bucket1.words.includes(word) : ex.bucket2.words.includes(word);
      span.classList.add(correct ? 'correct-sort' : 'incorrect-sort');
    });
  });

  document.getElementById('sortSubmit').style.display = 'none';
  document.querySelectorAll('#sortableWords .practice-sort-word').forEach(b => b.style.pointerEvents = 'none');

  showFeedback(allCorrect, allCorrect ? '正解！全て正しく分類できました。' : `${ex.bucket1.label}: ${ex.bucket1.words.join(', ')} / ${ex.bucket2.label}: ${ex.bucket2.words.join(', ')}`);
}

function showFeedback(isCorrect, message) {
  const div = document.getElementById('practiceFeedback');
  div.innerHTML = `
    <div class="practice-feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}">
      ${isCorrect ? '&#10004; ' : '&#10008; '}${message}
    </div>
    <button class="practice-next-btn" onclick="nextExercise()">
      ${state.exerciseIndex < state.exercises.length - 1 ? '次の問題' : '結果を見る'}
    </button>
  `;

  // Flash
  document.getElementById('practiceContent').classList.add(isCorrect ? 'flash-correct' : 'flash-incorrect');
  setTimeout(() => {
    document.getElementById('practiceContent').classList.remove('flash-correct', 'flash-incorrect');
  }, 600);
}

function nextExercise() {
  state.exerciseIndex++;
  if (state.exerciseIndex >= state.exercises.length) {
    finishPractice();
  } else {
    renderExercise();
  }
}

function finishPractice() {
  const score = state.exerciseScore;
  const total = state.exercises.length;
  const progress = loadProgress();
  const xpGained = score * XP_PER_CORRECT;

  // Update phoneme progress
  const pp = getPhonemeProgress(progress, state.currentPhoneme);
  pp.attempts += total;
  pp.correct += score;
  pp.lastPracticed = new Date().toISOString();
  if (pp.correct >= MASTERY_THRESHOLD && (pp.correct / pp.attempts) >= 0.7) {
    pp.mastered = true;
  }

  addXP(progress, xpGained);
  updateStreak(progress);
  saveProgress(progress);

  // Show result
  document.querySelector('.result-score-num').textContent = score;
  document.querySelector('.result-score-total').textContent = total;
  document.getElementById('resultXP').textContent = '+' + xpGained + ' XP';
  document.getElementById('resultStreak').textContent = progress.streak.current > 1 ?
    progress.streak.current + '日連続！' : '';

  if (score === total) {
    document.getElementById('resultTitle').textContent = 'パーフェクト！';
  } else if (score >= total * 0.7) {
    document.getElementById('resultTitle').textContent = 'お疲れさまでした！';
  } else {
    document.getElementById('resultTitle').textContent = 'もう少し練習しましょう';
  }

  showScreen('result');
}

function retryPractice() {
  if (state.currentPhoneme) {
    startPractice(state.currentPhoneme);
  }
}

function exitPractice() {
  window.speechSynthesis && window.speechSynthesis.cancel();
  if (state.currentPhoneme) {
    startLesson(state.currentPhoneme);
  } else {
    showScreen('home');
  }
}

// ===== PROGRESS SCREEN =====
function updateProgressScreen() {
  const progress = loadProgress();
  const container = document.getElementById('progressContainer');

  // Level & XP
  const xpNeeded = progress.level * XP_PER_LEVEL;

  // Category completion
  const catCompletion = {};
  for (const cat of ['vowel', 'diphthong', 'consonant', 'trouble']) {
    const ids = UNLOCK_ORDER.filter(id => PHONEMES[id] && PHONEMES[id].category === cat);
    const mastered = ids.filter(id => getPhonemeProgress(progress, id).mastered).length;
    catCompletion[cat] = { total: ids.length, mastered, pct: ids.length ? Math.round(mastered / ids.length * 100) : 0 };
  }

  // Weak sounds
  const weakSounds = [];
  for (const id of UNLOCK_ORDER) {
    const pp = getPhonemeProgress(progress, id);
    if (pp.attempts >= 3 && (pp.correct / pp.attempts) < 0.7) {
      weakSounds.push({ id, pct: Math.round(pp.correct / pp.attempts * 100) });
    }
  }

  // Calendar (last 28 days)
  const calendarDays = [];
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    calendarDays.push({
      date: ds,
      active: progress.activeDates && progress.activeDates.includes(ds),
      isToday: ds === todayStr
    });
  }

  container.innerHTML = `
    <div class="progress-section">
      <div class="progress-section-title">レベル & 経験値</div>
      <div class="progress-stat-card">
        <div class="progress-stat-icon" style="background:var(--accent-soft);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--accent)">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="progress-stat-text">
          <div class="progress-stat-value">Level ${progress.level}</div>
          <div class="progress-stat-label">${progress.xp} / ${xpNeeded} XP</div>
        </div>
      </div>
      <div class="progress-stat-card">
        <div class="progress-stat-icon" style="background:var(--error-soft);">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--error)">
            <path d="M12 23c-3.6 0-8-3.1-8-8.5C4 9.3 12 1 12 1s8 8.3 8 13.5c0 5.4-4.4 8.5-8 8.5z"/>
          </svg>
        </div>
        <div class="progress-stat-text">
          <div class="progress-stat-value">${progress.streak.current}日連続</div>
          <div class="progress-stat-label">ストリーク</div>
        </div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-section-title">カテゴリ別進捗</div>
      ${Object.entries(catCompletion).map(([cat, data]) => `
        <div class="progress-category-bar">
          <div class="progress-category-label">
            <span>${CATEGORIES[cat].nameJa}</span>
            <span>${data.mastered}/${data.total}</span>
          </div>
          <div class="progress-category-track">
            <div class="progress-category-fill" style="width:${data.pct}%; background:${CATEGORIES[cat].color};"></div>
          </div>
        </div>
      `).join('')}
    </div>

    ${weakSounds.length > 0 ? `
    <div class="progress-section">
      <div class="progress-section-title">弱点サウンド（正答率70%未満）</div>
      <div class="progress-weak-list">
        ${weakSounds.map(ws => `
          <div class="progress-weak-item" onclick="startPractice('${ws.id}')">
            <span class="progress-weak-ipa">${PHONEMES[ws.id].ipa}</span>
            <span class="progress-weak-percent">${ws.pct}%</span>
          </div>
        `).join('')}
      </div>
      <button class="btn-weak-practice" onclick="practiceWeakSounds()">
        弱点克服トレーニング
      </button>
    </div>` : ''}

    <div class="progress-section">
      <div class="progress-section-title">学習カレンダー（過去28日）</div>
      <div class="progress-calendar">
        ${calendarDays.map(d => `
          <div class="progress-cal-day ${d.active ? 'active' : ''} ${d.isToday ? 'today' : ''}"></div>
        `).join('')}
      </div>
    </div>
  `;
}

function practiceWeakSounds() {
  const progress = loadProgress();
  let weakest = null;
  let worstPct = 1;

  for (const id of UNLOCK_ORDER) {
    const pp = getPhonemeProgress(progress, id);
    if (pp.attempts >= 1) {
      const pct = pp.correct / pp.attempts;
      if (pct < worstPct) {
        worstPct = pct;
        weakest = id;
      }
    }
  }

  if (weakest) {
    startPractice(weakest);
  } else {
    showToast('まず何か練習してみましょう');
  }
}

// ===== TODAY'S LESSON =====
function startTodayLesson() {
  const progress = loadProgress();

  // Find the first non-mastered available phoneme
  for (const id of UNLOCK_ORDER) {
    const status = getPhonemeStatus(progress, id);
    if (status === 'available') {
      startLesson(id);
      return;
    }
  }

  // All mastered - practice weakest
  practiceWeakSounds();
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== UTILS =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== INIT =====
function init() {
  updateHomeScreen();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
