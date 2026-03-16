# CLAUDE.md

## プロジェクト概要
Phonics Reset – "Sound Visual" コンセプトの大人向けフォニックス学習PWA。
音が見えるUI: 波形アニメーション、パーティクル背景、ネオンサイバー美学。

## 技術スタック
- Single HTML + CSS + JS（フレームワークなし）
- Canvas 2D（波形アニメーション・パーティクル・ワールドマップ）
- Web Speech API（音声再生）
- localStorage（進捗保存、キー: `phonics_reset_v2`）
- Service Worker + manifest.json（PWA対応）
- GitHub Pages（ホスティング）

## ディレクトリ構成
```
phonics-reset/
  index.html        - メインHTML（全スクリーン含む）
  style.css         - スタイルシート（ダークサイバーテーマ）
  app.js            - アプリロジック（WaveformRenderer・画面遷移・練習エンジン）
  data/worlds.js    - ワールド/ステージ/問題データ（7ワールド、W1全8ステージ、W2は3ステージ）
  manifest.json     - PWAマニフェスト
  sw.js             - Service Worker（cache-first、CACHE_NAME: phonics-reset-v3）
```

## 画面構成
1. **Title** - "PHONICS RESET" グリッチテキスト + 波形アニメーション
2. **World Map** - 星座風ノードグラフ（7ワールド、Canvas描画）
3. **Stage Select** - 波形ピークとしてステージ表示
4. **Lesson** - 4種の練習（聞いて選べ/同じ？違う？/音を見つけて/スピードラウンド）
5. **Stage Clear** - 星評価 + XP表示
6. **Stage Fail** - 再挑戦画面

## 練習タイプ
- `listen_choose`: 音声を聞いて4択から選ぶ
- `same_different`: 2つの単語が同じか違うか判定
- `find_sound`: 単語内の特定音素の文字を選択
- `speed_round`: 制限時間内に連続正解（コンボシステム）

## 開発ルール
- コード変更後は自動でコミット＆プッシュまで行う
- APIキーは `.env` に記載し、ソースコードに直接書かない
- SW更新: `sw.js` の `CACHE_NAME` を v3→v4... とインクリメントでキャッシュ強制更新
- ワールド/ステージ追加: `data/worlds.js` の `WORLDS` 配列に追加
