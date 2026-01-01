# MojiEmoji

<img 
  src="./assets/logo.svg"
  style="width: 300px; display: block; margin: 0 auto; transform: translateX(-10%);"
/>

MojiEmoji は、選択した文字列から連想される絵文字を提案する Chrome 拡張機能です。

## 技術スタック

- Node.js v24.12.0
- pnpm v10.26.2
- Plasmo v0.90.5
- React v18.2.0

# 🚀 On-boarding

## 開発環境の構築と開発手順

1. 以下をを実行し、依存パッケージをインストールします
   ```
   pnpm install
   ```

2. 以下を実行し、開発サーバーを起動します
   ```
   pnpm dev
   ```

3. すると `./build/chrome-mv3-dev/` ディレクトリが作成されます
  
4. chrome://extensions/ にアクセスし、デベロッパーモードを ON にして、「パッケージ化されていない拡張機能を読み込む」ボタンを押下し `./build/chrome-mv3-dev/` ディレクトリを選択します

5. ツールバーの拡張機能一覧の中に `DEV | MojiEmoji` が確認できます

## 参考

以下の記事を参考にして、開発しています。

- [**ブラウザ拡張機能を作るためのReactフレームワーク『Plasmo』** - Zenn](https://zenn.dev/nado1001/articles/plasmo-browser-extension)
- [**Docs** - plasmo](https://docs.plasmo.com/)
- [**Chrome Extensions** - chrome for developers](https://developer.chrome.com/docs/extensions?hl=ja)
