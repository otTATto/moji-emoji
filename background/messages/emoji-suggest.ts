import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { EmojiSuggestReq, EmojiSuggestRes } from "~types";

const handler: PlasmoMessaging.MessageHandler<
  EmojiSuggestReq,
  EmojiSuggestRes
> = async (req, res) => { 
  /**
   * API リクエストを整形
   * 
   * - text   : LLM に絵文字に変換してもらう文章（必須）を 300 文字に制限
   * - nuances: 変換してもらいたい絵文字ニュアンスが存在し配列かどうか確認
   */
  const text = String(req.body.text ?? "").trim().slice(0, 300);
  const nuances = Array.isArray(req.body?.nuances) ? req.body.nuances : undefined;

  if (!text) {
    res.send({ emojiList: [] });
    return;
  }

  try {
    const response = await fetch(
      "https://tat.0t0.jp/emoji-suggest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          nuances: nuances, 
        })
      },
    );

    const data = await response.json();

    res.send({ emojiList: data.emojis ?? [] });
  } catch (e) {
    console.error(e);
    res.send({ emojiList: [] });
  }
};

export default handler;
