import type { PlasmoMessaging } from "@plasmohq/messaging";
import type { EmojiSuggestReq, EmojiSuggestRes } from "~types";

const handler: PlasmoMessaging.MessageHandler<
  EmojiSuggestReq,
  EmojiSuggestRes
> = async (req, res) => {
  // LLM に投げる入力文を 300 文字に制限
  const text = String(req.body.text ?? "").trim().slice(0, 300);

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
