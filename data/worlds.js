/* ====================================================
   Phonics Reset – World / Stage / Question Data
   A-Z Individual Stages (27 stages in World 1)
   ==================================================== */

// IPA map for each letter
const LETTER_IPA = {
  A:'/æ/', B:'/b/', C:'/k/', D:'/d/', E:'/ɛ/', F:'/f/', G:'/ɡ/', H:'/h/',
  I:'/ɪ/', J:'/dʒ/', K:'/k/', L:'/l/', M:'/m/', N:'/n/', O:'/ɒ/', P:'/p/',
  Q:'/kw/', R:'/r/', S:'/s/', T:'/t/', U:'/ʌ/', V:'/v/', W:'/w/', X:'/ks/',
  Y:'/j/', Z:'/z/'
};

// Helper to build a letter stage
function letterStage(letter, idx, words, distractors) {
  const id = 's' + (idx + 1);
  const lc = letter.toLowerCase();
  return {
    id,
    letter: letter,
    label: letter,
    sounds: lc,
    subtitle: words[0],
    questions: [
      // Q1: listen_choose
      {
        type: 'listen_choose',
        audioWord: words[0],
        instruction: 'この音が入っている単語はどれ？',
        options: [words[0], distractors[0], distractors[1], distractors[2]],
        correctIndex: 0
      },
      // Q2: find_sound
      {
        type: 'find_sound',
        word: words[0],
        targetSound: LETTER_IPA[letter] || '/' + lc + '/',
        targetPhoneme: lc,
        correctLetterIndices: findLetterIndices(words[0], lc)
      },
      // Q3: listen_choose with different word
      {
        type: 'listen_choose',
        audioWord: words[1],
        instruction: 'この音が入っている単語はどれ？',
        options: [distractors[1], words[1], distractors[0], distractors[2]],
        correctIndex: 1
      }
    ]
  };
}

// Find indices of target letter in a word
function findLetterIndices(word, letter) {
  const indices = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i].toLowerCase() === letter.toLowerCase()) indices.push(i);
  }
  return indices.length > 0 ? indices : [0];
}

// Letter data: [letter, words[3], distractors[3]]
const LETTER_DATA = [
  ['A', ['apple','ant','alligator'], ['egg','up','ink']],
  ['B', ['ball','bat','bus'], ['dog','pen','cat']],
  ['C', ['cat','cup','car'], ['key','go','sun']],
  ['D', ['dog','duck','door'], ['ball','ten','pig']],
  ['E', ['egg','elephant','end'], ['apple','up','ink']],
  ['F', ['fish','fan','fun'], ['van','pen','hat']],
  ['G', ['go','get','gap'], ['cat','key','dog']],
  ['H', ['hat','hot','hen'], ['at','web','fun']],
  ['I', ['ink','it','in'], ['eat','up','ant']],
  ['J', ['jam','jet','jog'], ['go','yet','zip']],
  ['K', ['key','kid','kit'], ['go','cat','tea']],
  ['L', ['leg','lip','log'], ['red','win','mop']],
  ['M', ['man','map','mop'], ['net','pan','top']],
  ['N', ['net','nap','nut'], ['met','lap','but']],
  ['O', ['on','ox','octopus'], ['up','ant','egg']],
  ['P', ['pen','pig','pot'], ['ten','big','hot']],
  ['Q', ['queen','quiz','quit'], ['key','win','zip']],
  ['R', ['red','run','rat'], ['led','sun','bat']],
  ['S', ['sun','sit','six'], ['fun','fit','fix']],
  ['T', ['ten','top','tap'], ['pen','hop','map']],
  ['U', ['up','us','umbrella'], ['at','it','on']],
  ['V', ['van','vet','vest'], ['fan','bet','best']],
  ['W', ['web','win','wet'], ['vet','bin','bet']],
  ['X', ['fox','box','six'], ['dog','top','sit']],
  ['Y', ['yes','yet','yam'], ['jet','set','jam']],
  ['Z', ['zip','zoo','zap'], ['sip','too','tap']],
];

// Build World 1 stages
const w1Stages = LETTER_DATA.map((d, i) => letterStage(d[0], i, d[1], d[2]));

// BOSS stage (stage 27)
w1Stages.push({
  id: 's27',
  letter: '★',
  label: 'BOSS',
  sounds: 'A-Z Review',
  subtitle: 'すべての文字',
  boss: true,
  questions: [
    { type:'listen_choose', audioWord:'apple', instruction:'この音が入っている単語はどれ？', options:['apple','egg','up','ink'], correctIndex:0 },
    { type:'find_sound', word:'fish', targetSound:'/f/', targetPhoneme:'f', correctLetterIndices:[0] },
    { type:'listen_choose', audioWord:'queen', instruction:'この音が入っている単語はどれ？', options:['key','queen','win','zip'], correctIndex:1 },
    { type:'find_sound', word:'box', targetSound:'/ks/', targetPhoneme:'x', correctLetterIndices:[2] },
    { type:'listen_choose', audioWord:'zoo', instruction:'この音が入っている単語はどれ？', options:['sip','too','zoo','tap'], correctIndex:2 },
  ]
});

const WORLDS = [
  {
    id: 'w1',
    name: '基礎の森',
    nameEn: 'Forest of Basics',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    x: 0.5, y: 0.82,
    stages: w1Stages
  },

  // ═══════════════════ World 2 ═══════════════════
  {
    id: 'w2',
    name: 'ブレンド渓谷',
    nameEn: 'Blend Valley',
    color: '#059669',
    glow: 'rgba(5,150,105,0.25)',
    x: 0.28, y: 0.62,
    stages: [
      {
        id: 's1', label: 'Stage 1', sounds: 'bl, cl, fl',
        questions: [
          { type:'listen_choose', audioWord:'black', instruction:'聞いて正しい単語を選ぼう', options:['black','back','block','blank'], correctIndex:0 },
          { type:'find_sound', word:'flag', targetSound:'/fl/', targetPhoneme:'fl', correctLetterIndices:[0,1] },
          { type:'listen_choose', audioWord:'clap', instruction:'聞いて正しい単語を選ぼう', options:['cap','clap','flap','slap'], correctIndex:1 },
        ]
      },
      {
        id: 's2', label: 'Stage 2', sounds: 'br, cr, dr',
        questions: [
          { type:'listen_choose', audioWord:'brick', instruction:'聞いて正しい単語を選ぼう', options:['trick','brick','click','stick'], correctIndex:1 },
          { type:'find_sound', word:'drum', targetSound:'/dr/', targetPhoneme:'dr', correctLetterIndices:[0,1] },
          { type:'listen_choose', audioWord:'crab', instruction:'聞いて正しい単語を選ぼう', options:['cab','crab','grab','drab'], correctIndex:1 },
        ]
      },
      {
        id: 's3', label: 'Stage 3', sounds: 'st, sp, sn',
        questions: [
          { type:'listen_choose', audioWord:'stop', instruction:'聞いて正しい単語を選ぼう', options:['stop','shop','step','snap'], correctIndex:0 },
          { type:'find_sound', word:'snake', targetSound:'/sn/', targetPhoneme:'sn', correctLetterIndices:[0,1] },
          { type:'listen_choose', audioWord:'spin', instruction:'聞いて正しい単語を選ぼう', options:['sin','pin','spin','skin'], correctIndex:2 },
        ]
      },
    ]
  },

  // ═══════════════════ World 3–7 (metadata only) ═══════════════════
  {
    id: 'w3', name: 'ダイグラフ洞窟', nameEn: 'Digraph Cave',
    color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)',
    x: 0.72, y: 0.52, stages: []
  },
  {
    id: 'w4', name: 'サイレントe城', nameEn: 'Silent-e Castle',
    color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',
    x: 0.35, y: 0.38, stages: []
  },
  {
    id: 'w5', name: '母音チームの海', nameEn: 'Vowel Team Sea',
    color: '#2dd4bf', glow: 'rgba(45,212,191,0.25)',
    x: 0.65, y: 0.28, stages: []
  },
  {
    id: 'w6', name: 'Rコントロール火山', nameEn: 'R-Control Volcano',
    color: '#f97316', glow: 'rgba(249,115,22,0.25)',
    x: 0.3, y: 0.18, stages: []
  },
  {
    id: 'w7', name: '魔王の塔', nameEn: 'Final Tower',
    color: '#ff3355', glow: 'rgba(255,51,85,0.25)',
    x: 0.55, y: 0.08, stages: []
  },
];
