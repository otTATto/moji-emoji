// 座標
export type Pos = { x: number, y: number };

// 再生成で追加できる絵文字のニュアンス
// TODO: 将来的にはユーザーが好きな単語を自由に設定できるようにしたい
export const NUANCES = [
  "ポジティブ",
  "人", 
  "顔", 
  "動物",
  "ネガティブ", 
  "場所", 
  "道具",
  "記号", 
] as const;

export type Nuance = typeof NUANCES[number];

// 絵文字
export type Emoji = {
  body: string,         // 絵文字本体（例: '🌸'）
  name: string,         // 絵文字名（例: '桜'）
  description: string,  // 絵文字推薦理由（例: '春らしいイメージから連想'）
};

// Plasmo Messaging API のリクエスト / レスポンス形式
export type EmojiSuggestReq = { text: string, nuances?: Nuance[] };
export type EmojiSuggestRes = { emojiList: Emoji[] };
