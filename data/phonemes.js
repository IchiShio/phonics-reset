/**
 * Phonics Reset: Adult Edition - Phoneme Data
 * 大人のためのやり直し英語発音 音素データ
 */
const PHONEMES = {
  // ===== 母音 (Vowels) =====
  'ae': {
    id: 'ae', ipa: '/æ/', category: 'vowel',
    nameJa: '短母音 æ',
    description: '日本語の「ア」と「エ」の中間の音。口を横に大きく開き、舌を低く前に出して発音します。日本語にはない音なので、意識的に練習が必要です。',
    mouthPosition: '口を横に広げ、下顎を下げる。舌は低い位置で前寄り。「エ」の口の形で「ア」と言うイメージ。',
    katakanaWrong: 'ア',
    exampleWords: [
      { word: 'cat', phonetic: '/kæt/', meaning: '猫', audioText: 'cat', highlight: [1, 2] },
      { word: 'bad', phonetic: '/bæd/', meaning: '悪い', audioText: 'bad', highlight: [1, 2] },
      { word: 'apple', phonetic: '/ˈæpl/', meaning: 'りんご', audioText: 'apple', highlight: [0, 1] },
      { word: 'map', phonetic: '/mæp/', meaning: '地図', audioText: 'map', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['cat', 'cut'], ['bad', 'bud'], ['hat', 'hut'], ['bat', 'but']
    ],
    commonMistake: '日本人は /æ/ を「ア」(/ɑː/) で代用しがちです。"cat" が "cut" に聞こえてしまいます。口を横に引いて「エ」に近い「ア」を出しましょう。'
  },
  'ah': {
    id: 'ah', ipa: '/ʌ/', category: 'vowel',
    nameJa: '短母音 ʌ',
    description: '日本語の「ア」に近いが、もっと短く、口の奥で発音する音。リラックスした状態で短く「ア」と言います。',
    mouthPosition: '口を自然に少し開け、舌は中央付近。力を抜いてリラックスした「ア」。',
    katakanaWrong: 'ア',
    exampleWords: [
      { word: 'cup', phonetic: '/kʌp/', meaning: 'カップ', audioText: 'cup', highlight: [1, 2] },
      { word: 'but', phonetic: '/bʌt/', meaning: 'しかし', audioText: 'but', highlight: [1, 2] },
      { word: 'love', phonetic: '/lʌv/', meaning: '愛', audioText: 'love', highlight: [1, 2] },
      { word: 'sun', phonetic: '/sʌn/', meaning: '太陽', audioText: 'sun', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['cut', 'cat'], ['bud', 'bad'], ['hut', 'hat'], ['luck', 'lack']
    ],
    commonMistake: '日本人は /ʌ/ と /æ/ を区別しません。"cup" と "cap" が同じに聞こえがちです。/ʌ/ はリラックスして短く、/æ/ は口を横に引きます。'
  },
  'er': {
    id: 'er', ipa: '/ɜː/', category: 'vowel',
    nameJa: '長母音 ɜː',
    description: '日本語にない音。「アー」でも「エー」でもない中間的な長い音。舌を口の中央に浮かせて発音します。アメリカ英語ではRの色がつきます。',
    mouthPosition: '唇は軽く丸め、舌を口の中央に持ち上げる。舌はどこにも触れない。',
    katakanaWrong: 'アー',
    exampleWords: [
      { word: 'bird', phonetic: '/bɜːd/', meaning: '鳥', audioText: 'bird', highlight: [1, 3] },
      { word: 'work', phonetic: '/wɜːk/', meaning: '仕事', audioText: 'work', highlight: [1, 3] },
      { word: 'learn', phonetic: '/lɜːn/', meaning: '学ぶ', audioText: 'learn', highlight: [1, 4] },
      { word: 'first', phonetic: '/fɜːst/', meaning: '最初の', audioText: 'first', highlight: [1, 3] }
    ],
    minimalPairs: [
      ['bird', 'bard'], ['fur', 'far'], ['hurt', 'heart'], ['were', 'war']
    ],
    commonMistake: '「バード」「ワーク」のように「アー」で代用しがちですが、/ɜː/ は舌を持ち上げた独特の音です。口をあまり開けず、舌を浮かせて発音しましょう。'
  },
  'ih': {
    id: 'ih', ipa: '/ɪ/', category: 'vowel',
    nameJa: '短母音 ɪ',
    description: '日本語の「イ」より短く、力が抜けた音。口をあまり横に引かず、リラックスして発音します。',
    mouthPosition: '口を軽く開け、唇はリラックス。舌は前寄りの高い位置だが、/iː/ ほど高くない。',
    katakanaWrong: 'イ',
    exampleWords: [
      { word: 'sit', phonetic: '/sɪt/', meaning: '座る', audioText: 'sit', highlight: [1, 2] },
      { word: 'big', phonetic: '/bɪɡ/', meaning: '大きい', audioText: 'big', highlight: [1, 2] },
      { word: 'fish', phonetic: '/fɪʃ/', meaning: '魚', audioText: 'fish', highlight: [1, 2] },
      { word: 'hit', phonetic: '/hɪt/', meaning: '打つ', audioText: 'hit', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['sit', 'seat'], ['bit', 'beat'], ['hit', 'heat'], ['ship', 'sheep']
    ],
    commonMistake: '日本語の「イ」は常に長くて緊張していますが、英語の /ɪ/ は短くリラックスした音です。"ship" が "sheep" に聞こえないよう注意。'
  },
  'ee': {
    id: 'ee', ipa: '/iː/', category: 'vowel',
    nameJa: '長母音 iː',
    description: '日本語の「イー」に似ていますが、もっと口を横に引いて緊張させた長い音。唇を横に引っ張ります。',
    mouthPosition: '唇を横に大きく引き、舌を高く前に上げる。頬の筋肉を使う。',
    katakanaWrong: 'イー',
    exampleWords: [
      { word: 'see', phonetic: '/siː/', meaning: '見る', audioText: 'see', highlight: [1, 3] },
      { word: 'eat', phonetic: '/iːt/', meaning: '食べる', audioText: 'eat', highlight: [0, 2] },
      { word: 'deep', phonetic: '/diːp/', meaning: '深い', audioText: 'deep', highlight: [1, 3] },
      { word: 'beach', phonetic: '/biːtʃ/', meaning: '浜辺', audioText: 'beach', highlight: [1, 4] }
    ],
    minimalPairs: [
      ['seat', 'sit'], ['beat', 'bit'], ['sheep', 'ship'], ['feel', 'fill']
    ],
    commonMistake: '/iː/ と /ɪ/ の区別が重要。/iː/ は長くて緊張、/ɪ/ は短くてリラックス。"beach" と "bitch" を間違えると大変です！'
  },
  'uh': {
    id: 'uh', ipa: '/ʊ/', category: 'vowel',
    nameJa: '短母音 ʊ',
    description: '日本語の「ウ」に似ていますが、もっと口を丸めて短く発音します。唇を軽く突き出します。',
    mouthPosition: '唇を丸めて軽く突き出す。舌は後ろ寄りの高めの位置。短く力を抜いて。',
    katakanaWrong: 'ウ',
    exampleWords: [
      { word: 'book', phonetic: '/bʊk/', meaning: '本', audioText: 'book', highlight: [1, 3] },
      { word: 'good', phonetic: '/ɡʊd/', meaning: '良い', audioText: 'good', highlight: [1, 3] },
      { word: 'put', phonetic: '/pʊt/', meaning: '置く', audioText: 'put', highlight: [1, 2] },
      { word: 'look', phonetic: '/lʊk/', meaning: '見る', audioText: 'look', highlight: [1, 3] }
    ],
    minimalPairs: [
      ['pull', 'pool'], ['full', 'fool'], ['look', 'Luke'], ['could', 'cooed']
    ],
    commonMistake: '日本語の「ウ」は唇をあまり丸めませんが、英語の /ʊ/ はしっかり唇を丸めます。また /uː/ との長さの区別も大切です。'
  },
  'oo': {
    id: 'oo', ipa: '/uː/', category: 'vowel',
    nameJa: '長母音 uː',
    description: '唇を丸く突き出して長く「ウー」と発音します。日本語の「ウ」より唇の丸めが強い音です。',
    mouthPosition: '唇を強く丸めて前に突き出す。舌は後ろの高い位置。長く伸ばす。',
    katakanaWrong: 'ウー',
    exampleWords: [
      { word: 'food', phonetic: '/fuːd/', meaning: '食べ物', audioText: 'food', highlight: [1, 3] },
      { word: 'moon', phonetic: '/muːn/', meaning: '月', audioText: 'moon', highlight: [1, 3] },
      { word: 'blue', phonetic: '/bluː/', meaning: '青い', audioText: 'blue', highlight: [2, 4] },
      { word: 'shoe', phonetic: '/ʃuː/', meaning: '靴', audioText: 'shoe', highlight: [2, 4] }
    ],
    minimalPairs: [
      ['pool', 'pull'], ['fool', 'full'], ['Luke', 'look'], ['suit', 'soot']
    ],
    commonMistake: '/uː/ は /ʊ/ より長くて唇の突き出しも強い。"pool"（プール）と "pull"（引く）を区別しましょう。'
  },
  'oh': {
    id: 'oh', ipa: '/ɒ/', category: 'vowel',
    nameJa: '短母音 ɒ',
    description: 'イギリス英語の短い「オ」。口を丸く開けて短く発音します。アメリカ英語では /ɑː/ に近くなります。',
    mouthPosition: '口を丸く開け、舌を低く後ろに。短く発音する。',
    katakanaWrong: 'オ',
    exampleWords: [
      { word: 'hot', phonetic: '/hɒt/', meaning: '熱い', audioText: 'hot', highlight: [1, 2] },
      { word: 'dog', phonetic: '/dɒɡ/', meaning: '犬', audioText: 'dog', highlight: [1, 2] },
      { word: 'stop', phonetic: '/stɒp/', meaning: '止まる', audioText: 'stop', highlight: [2, 3] },
      { word: 'got', phonetic: '/ɡɒt/', meaning: '得た', audioText: 'got', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['hot', 'hat'], ['cot', 'cat'], ['not', 'nut'], ['lock', 'luck']
    ],
    commonMistake: '日本語の「オ」より口を大きく丸く開けます。また短い音なので伸ばさないようにしましょう。'
  },
  'aw': {
    id: 'aw', ipa: '/ɔː/', category: 'vowel',
    nameJa: '長母音 ɔː',
    description: '口を丸く開けて長く「オー」と発音します。日本語の「オー」より唇の丸めが強い音です。',
    mouthPosition: '唇を丸めて口を開け、舌は低い後ろの位置。長く伸ばす。',
    katakanaWrong: 'オー',
    exampleWords: [
      { word: 'all', phonetic: '/ɔːl/', meaning: '全て', audioText: 'all', highlight: [0, 2] },
      { word: 'law', phonetic: '/lɔː/', meaning: '法律', audioText: 'law', highlight: [1, 3] },
      { word: 'caught', phonetic: '/kɔːt/', meaning: '捕まえた', audioText: 'caught', highlight: [1, 5] },
      { word: 'door', phonetic: '/dɔː/', meaning: 'ドア', audioText: 'door', highlight: [1, 3] }
    ],
    minimalPairs: [
      ['caught', 'cot'], ['law', 'low'], ['saw', 'so'], ['port', 'pot']
    ],
    commonMistake: '/ɔː/ は長い「オー」ですが、唇をしっかり丸めること。日本語の「オー」は唇がフラットすぎます。'
  },
  'schwa': {
    id: 'schwa', ipa: '/ə/', category: 'vowel',
    nameJa: 'シュワー ə',
    description: '英語で最も多く出現する音。あいまいで弱い母音です。力を完全に抜いて、口の中央付近で「ァ」と軽く発音します。',
    mouthPosition: '口は自然な位置、完全にリラックス。舌は中央。力を入れない。',
    katakanaWrong: 'ア',
    exampleWords: [
      { word: 'about', phonetic: '/əˈbaʊt/', meaning: '〜について', audioText: 'about', highlight: [0, 1] },
      { word: 'banana', phonetic: '/bəˈnɑːnə/', meaning: 'バナナ', audioText: 'banana', highlight: [1, 2] },
      { word: 'sofa', phonetic: '/ˈsəʊfə/', meaning: 'ソファ', audioText: 'sofa', highlight: [3, 4] },
      { word: 'the', phonetic: '/ðə/', meaning: 'その', audioText: 'the', highlight: [2, 3] }
    ],
    minimalPairs: [
      ['affect', 'effect'], ['accept', 'except'], ['a', 'the']
    ],
    commonMistake: '日本人は全ての母音をはっきり発音しがちですが、英語は弱い音節をシュワーに変えます。"banana" は「バナナ」ではなく「ブナーナ」に近いのです。'
  },
  'e': {
    id: 'e', ipa: '/e/', category: 'vowel',
    nameJa: '短母音 e',
    description: '日本語の「エ」に近いですが、もう少し口を開けて発音します。短い音です。',
    mouthPosition: '口を中程度に開け、唇は自然な位置。舌は前寄りの中くらいの高さ。',
    katakanaWrong: 'エ',
    exampleWords: [
      { word: 'bed', phonetic: '/bed/', meaning: 'ベッド', audioText: 'bed', highlight: [1, 2] },
      { word: 'ten', phonetic: '/ten/', meaning: '10', audioText: 'ten', highlight: [1, 2] },
      { word: 'red', phonetic: '/red/', meaning: '赤い', audioText: 'red', highlight: [1, 2] },
      { word: 'said', phonetic: '/sed/', meaning: '言った', audioText: 'said', highlight: [1, 3] }
    ],
    minimalPairs: [
      ['bed', 'bad'], ['set', 'sat'], ['pen', 'pan'], ['met', 'mat']
    ],
    commonMistake: '日本語の「エ」とほぼ同じですが、/e/ と /æ/ の区別が大切。/æ/ はもっと口を開きます。'
  },
  'aa': {
    id: 'aa', ipa: '/ɑː/', category: 'vowel',
    nameJa: '長母音 ɑː',
    description: '口を大きく開けて長く「アー」と発音します。喉の奥から出す深い音です。',
    mouthPosition: '口を大きく開け、舌を低く後ろに。顎を下げて深い「アー」。',
    katakanaWrong: 'アー',
    exampleWords: [
      { word: 'car', phonetic: '/kɑːr/', meaning: '車', audioText: 'car', highlight: [1, 2] },
      { word: 'far', phonetic: '/fɑːr/', meaning: '遠い', audioText: 'far', highlight: [1, 2] },
      { word: 'heart', phonetic: '/hɑːrt/', meaning: '心臓', audioText: 'heart', highlight: [1, 4] },
      { word: 'father', phonetic: '/ˈfɑːðər/', meaning: '父', audioText: 'father', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['cart', 'cut'], ['heart', 'hurt'], ['far', 'fur'], ['barn', 'burn']
    ],
    commonMistake: '日本語の「アー」に比べて口をもっと大きく開け、喉の奥を意識して発音します。'
  },

  // ===== 二重母音 (Diphthongs) =====
  'ei': {
    id: 'ei', ipa: '/eɪ/', category: 'diphthong',
    nameJa: '二重母音 eɪ',
    description: '「エ」から「イ」に滑らかに移動する音。日本語の「エイ」に似ていますが、一息で滑らかにつなぎます。',
    mouthPosition: '「エ」の位置から始めて、口を横に引きながら「イ」に向かって舌を上げる。',
    katakanaWrong: 'エー',
    exampleWords: [
      { word: 'day', phonetic: '/deɪ/', meaning: '日', audioText: 'day', highlight: [1, 3] },
      { word: 'make', phonetic: '/meɪk/', meaning: '作る', audioText: 'make', highlight: [1, 3] },
      { word: 'rain', phonetic: '/reɪn/', meaning: '雨', audioText: 'rain', highlight: [1, 3] },
      { word: 'late', phonetic: '/leɪt/', meaning: '遅い', audioText: 'late', highlight: [1, 3] }
    ],
    minimalPairs: [
      ['late', 'let'], ['mate', 'met'], ['fate', 'fat'], ['pain', 'pen']
    ],
    commonMistake: '日本人は「エー」と一つの音で発音しがちですが、/eɪ/ は「エ→イ」と変化する二重母音です。'
  },
  'ai': {
    id: 'ai', ipa: '/aɪ/', category: 'diphthong',
    nameJa: '二重母音 aɪ',
    description: '「ア」から「イ」に滑らかに移動する音。口を大きく開けた「ア」から、素早く「イ」に向かいます。',
    mouthPosition: '口を大きく開けた「ア」から始め、口を閉じながら「イ」に移動する。',
    katakanaWrong: 'アイ',
    exampleWords: [
      { word: 'time', phonetic: '/taɪm/', meaning: '時間', audioText: 'time', highlight: [1, 3] },
      { word: 'like', phonetic: '/laɪk/', meaning: '好き', audioText: 'like', highlight: [1, 3] },
      { word: 'my', phonetic: '/maɪ/', meaning: '私の', audioText: 'my', highlight: [1, 2] },
      { word: 'night', phonetic: '/naɪt/', meaning: '夜', audioText: 'night', highlight: [1, 4] }
    ],
    minimalPairs: [
      ['time', 'team'], ['like', 'leak'], ['bite', 'beat'], ['mine', 'mean']
    ],
    commonMistake: '日本語の「アイ」は2つの独立した音ですが、英語の /aɪ/ は滑らかに一息でつなぎます。'
  },

  // ===== 子音 (Consonants) =====
  'th_voiceless': {
    id: 'th_voiceless', ipa: '/θ/', category: 'consonant',
    nameJa: '無声歯摩擦音 θ',
    description: '舌先を上の前歯の先端に軽く当てて、その隙間から息を出す音。声帯は振動させません。日本語に存在しない音です。',
    mouthPosition: '舌先を上の前歯の裏側または先端に軽く触れさせる。舌と歯の隙間から息を漏らす。',
    katakanaWrong: 'ス',
    exampleWords: [
      { word: 'think', phonetic: '/θɪŋk/', meaning: '考える', audioText: 'think', highlight: [0, 2] },
      { word: 'three', phonetic: '/θriː/', meaning: '3', audioText: 'three', highlight: [0, 2] },
      { word: 'bath', phonetic: '/bɑːθ/', meaning: 'お風呂', audioText: 'bath', highlight: [2, 4] },
      { word: 'tooth', phonetic: '/tuːθ/', meaning: '歯', audioText: 'tooth', highlight: [3, 5] }
    ],
    minimalPairs: [
      ['think', 'sink'], ['three', 'free'], ['thick', 'sick'], ['math', 'mass']
    ],
    commonMistake: '日本人は /θ/ を「ス」(/s/) で代用します。"think" が "sink" に聞こえてしまいます。舌を歯に付けることを忘れずに！'
  },
  'th_voiced': {
    id: 'th_voiced', ipa: '/ð/', category: 'consonant',
    nameJa: '有声歯摩擦音 ð',
    description: '/θ/ と同じ口の形で、声帯を振動させる音。"the", "this", "that" などの超頻出単語に使われます。',
    mouthPosition: '舌先を上の前歯に軽く当てて、声を出しながら息を漏らす。喉に手を当てると振動を感じる。',
    katakanaWrong: 'ザ・ダ',
    exampleWords: [
      { word: 'the', phonetic: '/ðə/', meaning: 'その', audioText: 'the', highlight: [0, 2] },
      { word: 'this', phonetic: '/ðɪs/', meaning: 'これ', audioText: 'this', highlight: [0, 2] },
      { word: 'that', phonetic: '/ðæt/', meaning: 'あれ', audioText: 'that', highlight: [0, 2] },
      { word: 'mother', phonetic: '/ˈmʌðər/', meaning: '母', audioText: 'mother', highlight: [2, 4] }
    ],
    minimalPairs: [
      ['they', 'day'], ['then', 'den'], ['than', 'Dan'], ['the', 'duh']
    ],
    commonMistake: '日本人は /ð/ を「ザ」(/z/) や「ダ」(/d/) で代用します。"the" を「ザ」と言いがち。舌を歯に付けて声を出しましょう。'
  },
  'l': {
    id: 'l', ipa: '/l/', category: 'consonant',
    nameJa: '側面接近音 l',
    description: '舌先を上の歯茎（前歯のすぐ後ろの盛り上がり）にしっかり付けて、舌の横から息を流す音。日本語のラ行とは全く違います。',
    mouthPosition: '舌先を歯茎にしっかりと押し付ける。空気は舌の両側を通る。舌先は離さない。',
    katakanaWrong: 'ラ行',
    exampleWords: [
      { word: 'light', phonetic: '/laɪt/', meaning: '光', audioText: 'light', highlight: [0, 1] },
      { word: 'love', phonetic: '/lʌv/', meaning: '愛', audioText: 'love', highlight: [0, 1] },
      { word: 'all', phonetic: '/ɔːl/', meaning: '全て', audioText: 'all', highlight: [1, 3] },
      { word: 'feel', phonetic: '/fiːl/', meaning: '感じる', audioText: 'feel', highlight: [3, 4] }
    ],
    minimalPairs: [
      ['light', 'right'], ['long', 'wrong'], ['lead', 'read'], ['lice', 'rice']
    ],
    commonMistake: '日本語のラ行は舌を弾くフラップ音で、英語の /l/ とも /r/ とも違います。/l/ は舌先を歯茎に「付けたまま」声を出すのがポイント。'
  },
  'r': {
    id: 'r', ipa: '/r/', category: 'consonant',
    nameJa: '接近音 r',
    description: '舌先をどこにも付けずに、舌を丸めて口の奥に引く音。唇も少し丸めます。日本語のラ行とは全く異なります。',
    mouthPosition: '舌先を丸めて後ろに引く（どこにも触れない）。唇を軽く丸める。',
    katakanaWrong: 'ラ行',
    exampleWords: [
      { word: 'right', phonetic: '/raɪt/', meaning: '正しい', audioText: 'right', highlight: [0, 1] },
      { word: 'red', phonetic: '/red/', meaning: '赤い', audioText: 'red', highlight: [0, 1] },
      { word: 'run', phonetic: '/rʌn/', meaning: '走る', audioText: 'run', highlight: [0, 1] },
      { word: 'very', phonetic: '/ˈveri/', meaning: 'とても', audioText: 'very', highlight: [2, 3] }
    ],
    minimalPairs: [
      ['right', 'light'], ['wrong', 'long'], ['read', 'lead'], ['rice', 'lice']
    ],
    commonMistake: '日本語のラ行は舌が歯茎を弾きますが、英語の /r/ は舌がどこにも触れません。舌を丸めて後ろに引くだけです。「ゥラ」のように小さい「ゥ」を前に付けるイメージ。'
  },
  'v': {
    id: 'v', ipa: '/v/', category: 'consonant',
    nameJa: '有声唇歯摩擦音 v',
    description: '上の前歯を下唇の内側に軽く当てて、声を出しながら息を漏らす音。日本語の「バ行」とは違います。',
    mouthPosition: '上の前歯を下唇の内側に軽く触れさせる。声を出しながら、歯と唇の隙間から息を漏らす。',
    katakanaWrong: 'バ行',
    exampleWords: [
      { word: 'very', phonetic: '/ˈveri/', meaning: 'とても', audioText: 'very', highlight: [0, 1] },
      { word: 'voice', phonetic: '/vɔɪs/', meaning: '声', audioText: 'voice', highlight: [0, 1] },
      { word: 'love', phonetic: '/lʌv/', meaning: '愛', audioText: 'love', highlight: [2, 4] },
      { word: 'live', phonetic: '/lɪv/', meaning: '住む', audioText: 'live', highlight: [2, 4] }
    ],
    minimalPairs: [
      ['very', 'berry'], ['vest', 'best'], ['van', 'ban'], ['vow', 'bow']
    ],
    commonMistake: '日本人は /v/ を「バ行」で代用します。"very" が "berry" に聞こえます。歯を下唇に当てることが大切です。'
  },
  'f': {
    id: 'f', ipa: '/f/', category: 'consonant',
    nameJa: '無声唇歯摩擦音 f',
    description: '上の前歯を下唇に軽く当て、その隙間から息だけを出す音。声は出しません。日本語の「フ」とは異なります。',
    mouthPosition: '上の前歯を下唇の内側に軽く触れさせる。声は出さず、息だけを漏らす。',
    katakanaWrong: 'ハ行・フ',
    exampleWords: [
      { word: 'fish', phonetic: '/fɪʃ/', meaning: '魚', audioText: 'fish', highlight: [0, 1] },
      { word: 'fun', phonetic: '/fʌn/', meaning: '楽しい', audioText: 'fun', highlight: [0, 1] },
      { word: 'life', phonetic: '/laɪf/', meaning: '人生', audioText: 'life', highlight: [3, 4] },
      { word: 'after', phonetic: '/ˈɑːftər/', meaning: '〜の後', audioText: 'after', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['fan', 'han'], ['fine', 'hine'], ['feel', 'heel'], ['fought', 'hot']
    ],
    commonMistake: '日本語の「フ」は両唇を使いますが、英語の /f/ は歯と唇の摩擦で作ります。"coffee" を「コーヒー」と言うと全く違う音になります。'
  },
  'ng': {
    id: 'ng', ipa: '/ŋ/', category: 'consonant',
    nameJa: '鼻音 ŋ',
    description: '舌の奥を軟口蓋（上あごの奥の柔らかい部分）に付けて、鼻から息を出す音。「ん」の一種ですが、舌の位置が重要です。',
    mouthPosition: '舌の奥を上あごの奥に押し付ける。口は閉じず、息は鼻から出す。',
    katakanaWrong: 'ング',
    exampleWords: [
      { word: 'sing', phonetic: '/sɪŋ/', meaning: '歌う', audioText: 'sing', highlight: [2, 4] },
      { word: 'ring', phonetic: '/rɪŋ/', meaning: '指輪', audioText: 'ring', highlight: [2, 4] },
      { word: 'long', phonetic: '/lɒŋ/', meaning: '長い', audioText: 'long', highlight: [2, 4] },
      { word: 'think', phonetic: '/θɪŋk/', meaning: '考える', audioText: 'think', highlight: [2, 4] }
    ],
    minimalPairs: [
      ['sin', 'sing'], ['ran', 'rang'], ['thin', 'thing'], ['win', 'wing']
    ],
    commonMistake: '日本人は /ŋ/ の後に「グ」(/ɡ/) を付けてしまいがち。"sing" は「シング」ではなく、「グ」を言わずに鼻に抜けさせます。'
  },
  'sh': {
    id: 'sh', ipa: '/ʃ/', category: 'consonant',
    nameJa: '無声後部歯茎摩擦音 ʃ',
    description: '日本語の「シ」の子音に近いですが、唇をもっと丸めて前に出し、強い摩擦音を出します。',
    mouthPosition: '唇を丸めて前に突き出す。舌は歯茎の後ろに近づけ、その隙間から息を出す。',
    katakanaWrong: 'シ',
    exampleWords: [
      { word: 'she', phonetic: '/ʃiː/', meaning: '彼女', audioText: 'she', highlight: [0, 2] },
      { word: 'shop', phonetic: '/ʃɒp/', meaning: '店', audioText: 'shop', highlight: [0, 2] },
      { word: 'fish', phonetic: '/fɪʃ/', meaning: '魚', audioText: 'fish', highlight: [2, 4] },
      { word: 'wash', phonetic: '/wɒʃ/', meaning: '洗う', audioText: 'wash', highlight: [2, 4] }
    ],
    minimalPairs: [
      ['she', 'see'], ['ship', 'sip'], ['shoe', 'sue'], ['shore', 'sore']
    ],
    commonMistake: '/ʃ/ と /s/ を混同しがちです。/ʃ/ は唇を丸めて「シュー」、/s/ は唇を引いて「スー」。"she" と "see" を区別しましょう。'
  },
  'ch': {
    id: 'ch', ipa: '/tʃ/', category: 'consonant',
    nameJa: '無声破擦音 tʃ',
    description: '/t/ と /ʃ/ が合体した音。舌先を歯茎の後ろに付けてから一気に離し、摩擦音を出します。日本語の「チ」に近い音です。',
    mouthPosition: '舌先を歯茎後部にしっかり付けてから、一気に離す。唇は丸める。',
    katakanaWrong: 'チ',
    exampleWords: [
      { word: 'chair', phonetic: '/tʃeər/', meaning: '椅子', audioText: 'chair', highlight: [0, 2] },
      { word: 'child', phonetic: '/tʃaɪld/', meaning: '子供', audioText: 'child', highlight: [0, 2] },
      { word: 'watch', phonetic: '/wɒtʃ/', meaning: '時計', audioText: 'watch', highlight: [3, 5] },
      { word: 'teach', phonetic: '/tiːtʃ/', meaning: '教える', audioText: 'teach', highlight: [3, 5] }
    ],
    minimalPairs: [
      ['cheap', 'sheep'], ['chain', 'Shane'], ['chin', 'shin'], ['chop', 'shop']
    ],
    commonMistake: '/tʃ/ は /ʃ/ に /t/ の破裂が加わった音です。"cheap" と "sheep"、"chair" と "share" を区別しましょう。'
  },
  'dj': {
    id: 'dj', ipa: '/dʒ/', category: 'consonant',
    nameJa: '有声破擦音 dʒ',
    description: '/tʃ/ の有声版。/d/ と /ʒ/ が合体した音。舌先を歯茎の後ろに付けてから離し、声を出しながら摩擦音を出します。',
    mouthPosition: '/tʃ/ と同じ口の形で、声帯を振動させる。',
    katakanaWrong: 'ジ',
    exampleWords: [
      { word: 'job', phonetic: '/dʒɒb/', meaning: '仕事', audioText: 'job', highlight: [0, 1] },
      { word: 'just', phonetic: '/dʒʌst/', meaning: 'ちょうど', audioText: 'just', highlight: [0, 1] },
      { word: 'page', phonetic: '/peɪdʒ/', meaning: 'ページ', audioText: 'page', highlight: [2, 4] },
      { word: 'bridge', phonetic: '/brɪdʒ/', meaning: '橋', audioText: 'bridge', highlight: [4, 6] }
    ],
    minimalPairs: [
      ['Jill', 'gill'], ['joke', 'yolk'], ['jeer', 'year'], ['jet', 'yet']
    ],
    commonMistake: '日本語の「ジ」は /dʒ/ に近いですが、舌の位置がもう少し後ろです。しっかり舌を歯茎後部に付けてから離しましょう。'
  },
  'w': {
    id: 'w', ipa: '/w/', category: 'consonant',
    nameJa: '半母音 w',
    description: '唇を強く丸めて突き出してから、素早く次の母音に移動する音。日本語の「ワ」の子音より唇の丸めがずっと強いです。',
    mouthPosition: '唇を強く丸めて前に突き出す。そこから次の母音に向かって素早く唇を開く。',
    katakanaWrong: 'ウ',
    exampleWords: [
      { word: 'water', phonetic: '/ˈwɔːtər/', meaning: '水', audioText: 'water', highlight: [0, 1] },
      { word: 'want', phonetic: '/wɒnt/', meaning: '欲しい', audioText: 'want', highlight: [0, 1] },
      { word: 'week', phonetic: '/wiːk/', meaning: '週', audioText: 'week', highlight: [0, 1] },
      { word: 'why', phonetic: '/waɪ/', meaning: 'なぜ', audioText: 'why', highlight: [0, 1] }
    ],
    minimalPairs: [
      ['west', 'rest'], ['wine', 'vine'], ['wet', 'vet'], ['while', 'vile']
    ],
    commonMistake: '日本語の「ワ」は唇が弱いですが、英語の /w/ はしっかり唇を丸めて突き出します。"water" は「ウォーター」のように「ウ」の丸めから始めましょう。'
  },
  'j': {
    id: 'j', ipa: '/j/', category: 'consonant',
    nameJa: '半母音 j',
    description: '日本語の「ヤ行」の子音に近い音。舌の前部を上あごに近づけて、素早く次の母音に移ります。',
    mouthPosition: '舌の前部を硬口蓋に近づけ（付けない）、素早く次の母音に移動する。',
    katakanaWrong: 'ヤ行',
    exampleWords: [
      { word: 'yes', phonetic: '/jes/', meaning: 'はい', audioText: 'yes', highlight: [0, 1] },
      { word: 'year', phonetic: '/jɪər/', meaning: '年', audioText: 'year', highlight: [0, 1] },
      { word: 'you', phonetic: '/juː/', meaning: 'あなた', audioText: 'you', highlight: [0, 1] },
      { word: 'use', phonetic: '/juːz/', meaning: '使う', audioText: 'use', highlight: [0, 1] }
    ],
    minimalPairs: [
      ['year', 'ear'], ['yet', 'jet'], ['yolk', 'joke'], ['yes', 'Jess']
    ],
    commonMistake: '/j/ は日本語の「ヤ」とほぼ同じですが、/j/ と /dʒ/ を混同しないこと。"year" と "jeer" は違う音です。'
  },

  // ===== 日本人の壁 (Trouble Sounds) =====
  'lr': {
    id: 'lr', ipa: '/l/ vs /r/', category: 'trouble',
    nameJa: 'LとRの区別',
    description: '日本人が最も苦労する音の区別。/l/ は舌先を歯茎に付ける、/r/ は舌先をどこにも付けない。この違いを体で覚えましょう。',
    mouthPosition: '/l/: 舌先を歯茎にしっかり付ける\n/r/: 舌先を丸めて後ろに引く（どこにも触れない）',
    katakanaWrong: 'ラ行（両方同じになる）',
    exampleWords: [
      { word: 'light / right', phonetic: '/laɪt/ vs /raɪt/', meaning: '光 / 正しい', audioText: 'light versus right', highlight: [0, 1] },
      { word: 'long / wrong', phonetic: '/lɒŋ/ vs /rɒŋ/', meaning: '長い / 間違い', audioText: 'long versus wrong', highlight: [0, 1] },
      { word: 'lead / read', phonetic: '/liːd/ vs /riːd/', meaning: '導く / 読む', audioText: 'lead versus read', highlight: [0, 1] },
      { word: 'alive / arrive', phonetic: '/əˈlaɪv/ vs /əˈraɪv/', meaning: '生きている / 到着する', audioText: 'alive versus arrive', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['light', 'right'], ['long', 'wrong'], ['lead', 'read'], ['lice', 'rice'],
      ['fly', 'fry'], ['glass', 'grass'], ['collect', 'correct'], ['glamour', 'grammar']
    ],
    commonMistake: '日本語のラ行は舌を弾くフラップ音で、/l/ とも /r/ とも異なります。\n/l/のコツ: 舌先を歯茎に「付けたまま」声を出す\n/r/のコツ: 舌先を丸めて「どこにも触れずに」声を出す'
  },
  'th_s': {
    id: 'th_s', ipa: '/θ/ vs /s/', category: 'trouble',
    nameJa: 'THとSの区別',
    description: '/θ/ は舌を歯に付ける、/s/ は舌を歯茎に近づけるだけ。日本人は両方を「ス」で済ませがちですが、全く違う音です。',
    mouthPosition: '/θ/: 舌先を上の前歯に当てる\n/s/: 舌先を歯茎に近づける（歯には触れない）',
    katakanaWrong: 'ス（両方同じになる）',
    exampleWords: [
      { word: 'think / sink', phonetic: '/θɪŋk/ vs /sɪŋk/', meaning: '考える / 沈む', audioText: 'think versus sink', highlight: [0, 2] },
      { word: 'thick / sick', phonetic: '/θɪk/ vs /sɪk/', meaning: '厚い / 病気', audioText: 'thick versus sick', highlight: [0, 2] },
      { word: 'math / mass', phonetic: '/mæθ/ vs /mæs/', meaning: '数学 / 集団', audioText: 'math versus mass', highlight: [2, 4] },
      { word: 'path / pass', phonetic: '/pɑːθ/ vs /pɑːs/', meaning: '道 / 通る', audioText: 'path versus pass', highlight: [2, 4] }
    ],
    minimalPairs: [
      ['think', 'sink'], ['thick', 'sick'], ['math', 'mass'], ['path', 'pass'],
      ['thought', 'sort'], ['thaw', 'saw'], ['worth', 'worse'], ['mouth', 'mouse']
    ],
    commonMistake: '/θ/ は舌を歯に「付ける」のがポイント。鏡を見て、舌先が歯から見えていればOK。/s/ は歯に触れず、歯茎の近くで「スー」と出します。'
  },
  'vb': {
    id: 'vb', ipa: '/v/ vs /b/', category: 'trouble',
    nameJa: 'VとBの区別',
    description: '/v/ は歯と唇の摩擦音、/b/ は両唇の破裂音。日本人は両方を「バ行」で代用しがちです。',
    mouthPosition: '/v/: 上の前歯を下唇に当てて息を漏らす\n/b/: 両唇をしっかり閉じてから一気に開ける',
    katakanaWrong: 'バ行（両方同じになる）',
    exampleWords: [
      { word: 'very / berry', phonetic: '/ˈveri/ vs /ˈberi/', meaning: 'とても / ベリー', audioText: 'very versus berry', highlight: [0, 1] },
      { word: 'van / ban', phonetic: '/væn/ vs /bæn/', meaning: 'バン / 禁止', audioText: 'van versus ban', highlight: [0, 1] },
      { word: 'vest / best', phonetic: '/vest/ vs /best/', meaning: 'ベスト / 最高', audioText: 'vest versus best', highlight: [0, 1] },
      { word: 'vine / bine', phonetic: '/vaɪn/ vs /baɪn/', meaning: 'つる / ホップ', audioText: 'vine versus bine', highlight: [0, 1] }
    ],
    minimalPairs: [
      ['very', 'berry'], ['van', 'ban'], ['vest', 'best'], ['vote', 'boat'],
      ['vow', 'bow'], ['vat', 'bat'], ['vent', 'bent'], ['vile', 'bile']
    ],
    commonMistake: '/v/ は上の前歯を下唇に当てて「ヴー」と摩擦させます。/b/ は両唇を閉じて「バッ」と破裂させます。/v/ は持続音（伸ばせる）、/b/ は一瞬の音（伸ばせない）です。'
  },
  'fh': {
    id: 'fh', ipa: '/f/ vs /h/', category: 'trouble',
    nameJa: 'FとHの区別',
    description: '/f/ は歯と唇の摩擦音、/h/ は喉からの息。日本語の「フ」は両唇音で、どちらとも違います。',
    mouthPosition: '/f/: 上の前歯を下唇に当てて息を漏らす\n/h/: 口は次の母音の形にして、喉から息を出す',
    katakanaWrong: 'フ（両方同じになる）',
    exampleWords: [
      { word: 'fun / hun', phonetic: '/fʌn/ vs /hʌn/', meaning: '楽しい / フン族', audioText: 'fun versus hun', highlight: [0, 1] },
      { word: 'feel / heel', phonetic: '/fiːl/ vs /hiːl/', meaning: '感じる / かかと', audioText: 'feel versus heel', highlight: [0, 1] },
      { word: 'food / hood', phonetic: '/fuːd/ vs /hʊd/', meaning: '食べ物 / フード', audioText: 'food versus hood', highlight: [0, 1] },
      { word: 'fit / hit', phonetic: '/fɪt/ vs /hɪt/', meaning: '合う / 打つ', audioText: 'fit versus hit', highlight: [0, 1] }
    ],
    minimalPairs: [
      ['fun', 'hun'], ['feel', 'heel'], ['food', 'hood'], ['fit', 'hit'],
      ['fat', 'hat'], ['four', 'whore'], ['fair', 'hair'], ['fall', 'hall']
    ],
    commonMistake: '日本語の「フ」は両唇を近づけて出す音で、英語の /f/ とも /h/ とも違います。/f/ は必ず歯を唇に当てること。/h/ は口の形を何もせず、息だけ出します。'
  },
  'ae_ah': {
    id: 'ae_ah', ipa: '/æ/ vs /ʌ/', category: 'trouble',
    nameJa: 'æとʌの区別',
    description: '日本語ではどちらも「ア」になってしまう2つの音。/æ/ は口を横に開いた「ア」、/ʌ/ はリラックスした短い「ア」です。',
    mouthPosition: '/æ/: 口を横に大きく広げる、舌は低く前\n/ʌ/: 口は自然に少し開け、リラックス',
    katakanaWrong: 'ア（両方同じになる）',
    exampleWords: [
      { word: 'cat / cut', phonetic: '/kæt/ vs /kʌt/', meaning: '猫 / 切る', audioText: 'cat versus cut', highlight: [1, 2] },
      { word: 'bad / bud', phonetic: '/bæd/ vs /bʌd/', meaning: '悪い / つぼみ', audioText: 'bad versus bud', highlight: [1, 2] },
      { word: 'hat / hut', phonetic: '/hæt/ vs /hʌt/', meaning: '帽子 / 小屋', audioText: 'hat versus hut', highlight: [1, 2] },
      { word: 'ran / run', phonetic: '/ræn/ vs /rʌn/', meaning: '走った / 走る', audioText: 'ran versus run', highlight: [1, 2] }
    ],
    minimalPairs: [
      ['cat', 'cut'], ['bad', 'bud'], ['hat', 'hut'], ['bat', 'but'],
      ['ran', 'run'], ['cap', 'cup'], ['lack', 'luck'], ['match', 'much']
    ],
    commonMistake: '/æ/ は「エ」の口で「ア」を言う音（口を横に引く）。/ʌ/ はリラックスした自然な「ア」。"cat" と "cut" は口の形が全然違います。'
  }
};

// Category definitions for Sound Map display
const CATEGORIES = {
  vowel: { nameJa: '母音', nameEn: 'Vowels', color: '#6c5ce7' },
  diphthong: { nameJa: '二重母音', nameEn: 'Diphthongs', color: '#a29bfe' },
  consonant: { nameJa: '子音', nameEn: 'Consonants', color: '#00b894' },
  trouble: { nameJa: '日本人の壁', nameEn: 'Trouble Sounds', color: '#e17055' }
};

// Unlock order (prerequisites)
const UNLOCK_ORDER = [
  // Start with trouble sounds and most important consonants
  'th_voiceless', 'th_voiced', 'l', 'r', 'v', 'f',
  // Core vowels
  'ae', 'ah', 'ih', 'ee', 'schwa',
  // More vowels
  'uh', 'oo', 'er', 'oh', 'aw', 'e', 'aa',
  // Diphthongs
  'ei', 'ai',
  // More consonants
  'ng', 'sh', 'ch', 'dj', 'w', 'j',
  // Trouble pair exercises (unlock after individual sounds)
  'lr', 'th_s', 'vb', 'fh', 'ae_ah'
];
