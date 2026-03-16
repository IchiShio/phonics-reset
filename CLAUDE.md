# CLAUDE.md

## プロジェクト概要
Phonics Reset: Adult Edition - 大人の日本人英語学習者向けフォニックス学習PWA。
Laliloにインスピレーションを受けつつ、大人向けに再設計したプレミアムUI/UXアプリ。

## 技術スタック
- Single HTML + CSS + JS（フレームワークなし）
- Web Speech API（音声再生）
- localStorage（進捗保存、キー: `phonics_reset_v1`）
- Service Worker + manifest.json（PWA対応）
- GitHub Pages（ホスティング）

## ディレクトリ構成
```
phonics-reset/
  index.html        - メインHTML（全スクリーン含む）
  style.css         - スタイルシート（ダークテーマ）
  app.js            - アプリロジック（状態管理・画面遷移・練習エンジン）
  data/phonemes.js  - 音素データ（24音素 + 5つの壁ペア）
  manifest.json     - PWAマニフェスト
  sw.js             - Service Worker（cache-first）
```

## 画面構成
1. **Home** - ロゴ、進捗リング、ストリーク、今日のレッスン
2. **Sound Map** - 音素グリッド（母音/二重母音/子音/日本人の壁）
3. **Lesson** - 5ステップカード（イントロ→口の形→聞く→比較→練習）
4. **Practice** - 4種類の練習問題（聞いて選ぶ/最小対/音を見つけて/仲間分け）
5. **Result** - スコア表示、XP獲得
6. **Progress** - レベル、カテゴリ進捗、弱点、カレンダー

## 開発ルール
- コード変更後は自動でコミット＆プッシュまで行う
- APIキーは `.env` に記載し、ソースコードに直接書かない
- SW更新: `sw.js` の `CACHE_NAME` を v1→v2... とインクリメントでキャッシュ強制更新
- 音素追加: `data/phonemes.js` の `PHONEMES` オブジェクトと `UNLOCK_ORDER` 配列に追加
