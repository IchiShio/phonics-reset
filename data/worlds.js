/* ====================================================
   Phonics Reset – World / Stage / Question Data
   ==================================================== */

const WORLDS = [
  {
    id: 'w1',
    name: '基礎の森',
    nameEn: 'Forest of Basics',
    color: '#22ff88',
    glow: 'rgba(34,255,136,0.35)',
    x: 0.5, y: 0.82,          // normalised map coords
    stages: [
      // ── Stage 1: a b c d ──
      {
        id: 's1', label: 'Stage 1', sounds: 'a b c d',
        questions: [
          { type:'listen_choose', audioWord:'apple', ipa:'/ˈæp.əl/', options:['apple','egg','ink','up'], correctIndex:0 },
          { type:'listen_choose', audioWord:'bat', ipa:'/bæt/', options:['dog','bat','cat','hat'], correctIndex:1 },
          { type:'find_sound', word:'duck', targetSound:'/d/', targetPhoneme:'d', correctLetterIndices:[0] },
          { type:'same_different', word1:'cat', word2:'cut', isSame:false },
          { type:'listen_choose', audioWord:'cup', ipa:'/kʌp/', options:['cap','cop','cup','cub'], correctIndex:2 },
        ]
      },
      // ── Stage 2: e f g h ──
      {
        id: 's2', label: 'Stage 2', sounds: 'e f g h',
        questions: [
          { type:'listen_choose', audioWord:'egg', ipa:'/ɛɡ/', options:['egg','add','ill','odd'], correctIndex:0 },
          { type:'listen_choose', audioWord:'fish', ipa:'/fɪʃ/', options:['wish','fish','dish','fist'], correctIndex:1 },
          { type:'find_sound', word:'goat', targetSound:'/ɡ/', targetPhoneme:'g', correctLetterIndices:[0] },
          { type:'same_different', word1:'hen', word2:'hen', isSame:true },
          { type:'listen_choose', audioWord:'hat', ipa:'/hæt/', options:['hat','hot','hit','hut'], correctIndex:0 },
        ]
      },
      // ── Stage 3: i j k l ──
      {
        id: 's3', label: 'Stage 3', sounds: 'i j k l',
        questions: [
          { type:'listen_choose', audioWord:'ink', ipa:'/ɪŋk/', options:['ank','ink','unk','onk'], correctIndex:1 },
          { type:'listen_choose', audioWord:'jam', ipa:'/dʒæm/', options:['jam','ham','ram','yam'], correctIndex:0 },
          { type:'find_sound', word:'kite', targetSound:'/k/', targetPhoneme:'k', correctLetterIndices:[0] },
          { type:'same_different', word1:'lip', word2:'rip', isSame:false },
          { type:'listen_choose', audioWord:'leg', ipa:'/lɛɡ/', options:['log','lag','leg','lug'], correctIndex:2 },
        ]
      },
      // ── Stage 4: m n o p ──
      {
        id: 's4', label: 'Stage 4', sounds: 'm n o p',
        questions: [
          { type:'listen_choose', audioWord:'map', ipa:'/mæp/', options:['map','nap','tap','cap'], correctIndex:0 },
          { type:'listen_choose', audioWord:'net', ipa:'/nɛt/', options:['net','met','set','pet'], correctIndex:0 },
          { type:'find_sound', word:'hot', targetSound:'/ɒ/', targetPhoneme:'o', correctLetterIndices:[1] },
          { type:'same_different', word1:'pen', word2:'pin', isSame:false },
          { type:'listen_choose', audioWord:'pig', ipa:'/pɪɡ/', options:['big','dig','pig','wig'], correctIndex:2 },
        ]
      },
      // ── Stage 5: q r s t ──
      {
        id: 's5', label: 'Stage 5', sounds: 'q r s t',
        questions: [
          { type:'listen_choose', audioWord:'queen', ipa:'/kwiːn/', options:['keen','queen','green','seen'], correctIndex:1 },
          { type:'listen_choose', audioWord:'run', ipa:'/rʌn/', options:['run','fun','sun','bun'], correctIndex:0 },
          { type:'find_sound', word:'sun', targetSound:'/s/', targetPhoneme:'s', correctLetterIndices:[0] },
          { type:'same_different', word1:'tap', word2:'tab', isSame:false },
          { type:'speed_round', pairs:[
            { audioWord:'sit', options:['sit','set','sat'], correctIndex:0 },
            { audioWord:'top', options:['tip','tap','top'], correctIndex:2 },
            { audioWord:'rat', options:['rat','rot','rut'], correctIndex:0 },
          ]},
        ]
      },
      // ── Stage 6: u v w x ──
      {
        id: 's6', label: 'Stage 6', sounds: 'u v w x',
        questions: [
          { type:'listen_choose', audioWord:'up', ipa:'/ʌp/', options:['up','app','op','ape'], correctIndex:0 },
          { type:'listen_choose', audioWord:'van', ipa:'/væn/', options:['fan','van','ban','tan'], correctIndex:1 },
          { type:'find_sound', word:'box', targetSound:'/ks/', targetPhoneme:'x', correctLetterIndices:[2] },
          { type:'same_different', word1:'wet', word2:'vet', isSame:false },
          { type:'listen_choose', audioWord:'win', ipa:'/wɪn/', options:['win','bin','tin','pin'], correctIndex:0 },
        ]
      },
      // ── Stage 7: y z ──
      {
        id: 's7', label: 'Stage 7', sounds: 'y z',
        questions: [
          { type:'listen_choose', audioWord:'yes', ipa:'/jɛs/', options:['yes','less','mess','guess'], correctIndex:0 },
          { type:'listen_choose', audioWord:'zoo', ipa:'/zuː/', options:['sue','zoo','two','boo'], correctIndex:1 },
          { type:'find_sound', word:'yell', targetSound:'/j/', targetPhoneme:'y', correctLetterIndices:[0] },
          { type:'same_different', word1:'zip', word2:'sip', isSame:false },
          { type:'listen_choose', audioWord:'buzz', ipa:'/bʌz/', options:['bus','buzz','but','bud'], correctIndex:1 },
        ]
      },
      // ── Stage 8: BOSS Review ──
      {
        id: 's8', label: 'BOSS', sounds: 'All 26', boss: true,
        questions: [
          { type:'speed_round', pairs:[
            { audioWord:'apple', options:['apple','eagle','orange'], correctIndex:0 },
            { audioWord:'fish', options:['dish','fish','wish'], correctIndex:1 },
            { audioWord:'kite', options:['kite','bite','mite'], correctIndex:0 },
          ]},
          { type:'find_sound', word:'queen', targetSound:'/kw/', targetPhoneme:'qu', correctLetterIndices:[0,1] },
          { type:'same_different', word1:'bat', word2:'bat', isSame:true },
          { type:'listen_choose', audioWord:'van', ipa:'/væn/', options:['fan','van','ban','tan'], correctIndex:1 },
          { type:'listen_choose', audioWord:'zoo', ipa:'/zuː/', options:['sue','zoo','two','do'], correctIndex:1 },
        ]
      },
    ]
  },

  // ═══════════════════ World 2 ═══════════════════
  {
    id: 'w2',
    name: 'ブレンド渓谷',
    nameEn: 'Blend Valley',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.35)',
    x: 0.28, y: 0.62,
    stages: [
      {
        id: 's1', label: 'Stage 1', sounds: 'bl, cl, fl',
        questions: [
          { type:'listen_choose', audioWord:'black', ipa:'/blæk/', options:['black','back','block','blank'], correctIndex:0 },
          { type:'listen_choose', audioWord:'clap', ipa:'/klæp/', options:['cap','clap','flap','slap'], correctIndex:1 },
          { type:'find_sound', word:'flag', targetSound:'/fl/', targetPhoneme:'fl', correctLetterIndices:[0,1] },
          { type:'same_different', word1:'blend', word2:'bend', isSame:false },
          { type:'listen_choose', audioWord:'flip', ipa:'/flɪp/', options:['flip','clip','slip','drip'], correctIndex:0 },
        ]
      },
      {
        id: 's2', label: 'Stage 2', sounds: 'br, cr, dr',
        questions: [
          { type:'listen_choose', audioWord:'brick', ipa:'/brɪk/', options:['trick','brick','click','stick'], correctIndex:1 },
          { type:'listen_choose', audioWord:'crab', ipa:'/kræb/', options:['cab','crab','grab','drab'], correctIndex:1 },
          { type:'find_sound', word:'drum', targetSound:'/dr/', targetPhoneme:'dr', correctLetterIndices:[0,1] },
          { type:'same_different', word1:'brown', word2:'crown', isSame:false },
          { type:'listen_choose', audioWord:'drop', ipa:'/drɒp/', options:['drop','crop','prop','stop'], correctIndex:0 },
        ]
      },
      {
        id: 's3', label: 'Stage 3', sounds: 'st, sp, sn',
        questions: [
          { type:'listen_choose', audioWord:'stop', ipa:'/stɒp/', options:['stop','shop','step','snap'], correctIndex:0 },
          { type:'listen_choose', audioWord:'spin', ipa:'/spɪn/', options:['sin','pin','spin','skin'], correctIndex:2 },
          { type:'find_sound', word:'snake', targetSound:'/sn/', targetPhoneme:'sn', correctLetterIndices:[0,1] },
          { type:'same_different', word1:'spot', word2:'slot', isSame:false },
          { type:'speed_round', pairs:[
            { audioWord:'star', options:['star','scar','bar'], correctIndex:0 },
            { audioWord:'snap', options:['nap','snap','slap'], correctIndex:1 },
            { audioWord:'spin', options:['pin','skin','spin'], correctIndex:2 },
          ]},
        ]
      },
    ]
  },

  // ═══════════════════ World 3–7 (metadata only) ═══════════════════
  {
    id: 'w3', name: 'ダイグラフ洞窟', nameEn: 'Digraph Cave',
    color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)',
    x: 0.72, y: 0.52, stages: []
  },
  {
    id: 'w4', name: 'サイレントe城', nameEn: 'Silent-e Castle',
    color: '#fbbf24', glow: 'rgba(251,191,36,0.35)',
    x: 0.35, y: 0.38, stages: []
  },
  {
    id: 'w5', name: '母音チームの海', nameEn: 'Vowel Team Sea',
    color: '#2dd4bf', glow: 'rgba(45,212,191,0.35)',
    x: 0.65, y: 0.28, stages: []
  },
  {
    id: 'w6', name: 'Rコントロール火山', nameEn: 'R-Control Volcano',
    color: '#f97316', glow: 'rgba(249,115,22,0.35)',
    x: 0.3, y: 0.18, stages: []
  },
  {
    id: 'w7', name: '魔王の塔', nameEn: 'Final Tower',
    color: '#ff3355', glow: 'rgba(255,51,85,0.35)',
    x: 0.55, y: 0.08, stages: []
  },
];
