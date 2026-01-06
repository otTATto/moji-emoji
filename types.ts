// 座標
export type Pos = { x: number, y: number };

// 絵文字
export type Emoji = {
  body: string,         // 絵文字本体（例: '🌸'）
  name: string,         // 絵文字名（例: '桜'）
  description: string,  // 絵文字推薦理由（例: '春らしいイメージから連想'）
};

// Plasmo Messaging API のリクエスト / レスポンス形式
export type EmojiSuggestReq = { text: string };
export type EmojiSuggestRes = { emojiList: Emoji[] };
