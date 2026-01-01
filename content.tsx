import styleLocal from "data-text:./style.css"
import logoIcon from "data-base64:~assets/logo.svg";
import arrowDown from "data-base64:~assets/arrow-down.svg";
import type { PlasmoGetStyle } from "plasmo"
import { useState, useMemo, useEffect } from "react";

// 座標
type Pos = { x: number, y: number };

// 外部 CSS ファイルの内容に style.css の内容を動的に追加
export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style");
  style.textContent = styleLocal;
  return style;
}

const getSelectedText = () => window.getSelection()?.toString() ?? "";

// 選択範囲の最初の文字の DOMRect の左上および右下の座標を返す
const getSelectionPos = (): Pos | null => {
  // Selection Object
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  // 選択範囲の最初のテキストの Range Object 全体に結びつく DOMRect Object
  const domRect = selection.getRangeAt(0).getBoundingClientRect();
  if (!domRect || domRect.width === 0 && domRect.height === 0) return null;

  return {
    x: domRect.left + window.scrollX,
    y: domRect.bottom + window.scrollY, 
  };
}; 

const OverlayArea = () => {
  const [open, setOpen] = useState(false);                  // OverlayArea を表示するかどうか
  const [pos, setPos] = useState<Pos | null>(null);         // OverlayArea の表示座標
  const [text, setText] = useState("");
  const [emojiList, setEmojiList] = useState<string[]>([])
  const [loading, setLoading] = useState(false);            // 絵文字の suggestion 中かどうか

  const style = useMemo<React.CSSProperties>(() => {
    if (!open || !pos) return {
      display: "none",
    };

    return {
      position: "absolute",
      left: pos.x,
      top: pos.y + 16, 
      width: 400, 
    };
  }, [open, pos]);

  const runSuggest = async (inputText: string) => {
    setLoading(true);
    setEmojiList([]);

    // TODO: 以下はデモ用の Mockup なので書き換える
    try {
      setEmojiList([
        "🌸", "💡", "🎉",
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // キー押下時に OverlayArea を表示させて suggest を走らせる
    const onKeyDown = (e: KeyboardEvent) => {
      // TODO: 仮に Ctrl + Shift + E にしているが、将来的に設定で好きに変更できるようにする
      const isHit = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e";
      if (!isHit) return;

      const selectedText = getSelectedText();
      const selectionPos = getSelectionPos();

      // 何も選択していなければ閉じる
      if (!selectedText || !selectionPos) {
        setOpen(false);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      setText(selectedText);
      setPos(selectionPos);
      setOpen(true);

      runSuggest(selectedText);
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  if (!open) return null;

  return (
    <div style={style}>
      <div className="
        px-5 py-3
        bg-sky-50
        flex flex-col gap-y-3
      ">
        <img 
          src={logoIcon}
          width={150}
          style={{
            marginLeft: "100px",
          }}
          className="py-2"
        />
        <div className="
            bg-white 
            p-3 
            rounded-2xl
        ">
          <div 
            className="
              text-gray-700
              text-base
            "
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "2",
            }} 
          >
            {text}
          </div>
        </div>
        <img 
          src={arrowDown}
          width={20}
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <div>
          {loading ? null : emojiList.map((emoji) => (
            <div key={emoji}>{emoji}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverlayArea;
