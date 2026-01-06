import styleLocal from "data-text:./style.css"
import logoIcon from "data-base64:~assets/logo.svg";
import arrowDown from "data-base64:~assets/arrow-down.svg";
import type { PlasmoGetStyle } from "plasmo"
import { useState, useMemo, useEffect, useRef } from "react";
import type { Pos, Emoji, EmojiSuggestReq, EmojiSuggestRes } from "~types";
import { sendToBackground } from "@plasmohq/messaging";

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

// Loading 中のスケルトンスクリーンのためのコンポーネント
const SkeletonEmojiItem = () => (
  <div
    className="
      w-full h-20
      p-3
      flex items-center 
      gap-x-[10px]
      border-b-2 border-sky-50
    "
  >
    {/* 絵文字部分 */}
    <div
      className="
        w-10 h-10
        rounded-lg
        bg-sky-50
      "
      style={{
        animation: "skeleton 1.2s ease-in-out infinite",
      }}
    />
    {/* テキスト部分 */}
    <div className="flex-1">
      <div
        className="
          h-5 w-[40%]
          mb-2
          rounded-lg
          bg-sky-50
        "
        style={{
          animation: "skeleton 1.2s ease-in-out infinite",
        }}
      />
      <div
        className="
          h-[14px] w-[70%]
          rounded-lg
          bg-sky-50
        "
        style={{
          animation: "skeleton 1.2s ease-in-out infinite",
        }}
      />
    </div>
  </div>
)

const OverlayArea = () => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false);                  // OverlayArea を表示するかどうか
  const [pos, setPos] = useState<Pos | null>(null);         // OverlayArea の表示座標
  const [text, setText] = useState("");
  const [emojiList, setEmojiList] = useState<Emoji[]>([])
  const [loading, setLoading] = useState(false);            // 絵文字の suggestion 中かどうか

  // open フラグや pos の状態により動的に変わる OverlayArea の style 
  const styleDynamic = useMemo<React.CSSProperties>(() => {
    if (!open || !pos) return {
      display: "none",
    };

    return {
      position: "absolute",
      left: pos.x,
      top: pos.y + 16, 
    };
  }, [open, pos]);

  const runSuggest = async (inputText: string) => {
    setLoading(true);
    setEmojiList([]);

    try {
      const res = await sendToBackground<EmojiSuggestReq, EmojiSuggestRes>({
        name: "emoji-suggest",
        body: { text: inputText },
      });

      setEmojiList(res.emojiList ?? []);
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

  useEffect(() => {
    // OverlayArea 以外をクリックで OverlayArea を非表示
    const onDown = (ev: MouseEvent) => {
      if (!open) return;

      const root = rootRef.current;
      if (!root) return;
      
      const path = ev.composedPath?.() ?? [];
      const isClickedInside = path.includes(root);
      if (!isClickedInside) setOpen(false);
    }
    document.addEventListener("mousedown", onDown, true);
    return () => document.removeEventListener("mousedown", onDown, true);
  }, [open])

  if (!open) return null;

  return (
    <div 
      ref={rootRef}
      style={{
        ...styleDynamic,
        width: 400, 
      }}
    >
      <div 
        className="
          bg-sky-50
          flex flex-col gap-y-3
          p-5
        "
      >
        {/* MojiEmoji ロゴマーク */}
        <img 
          src={logoIcon}
          width={150}
          className="
            ml-[100px] 
            py-2
          "
        />
        {/* 
          選択文字列
          NOTE: 2 行でトランケート
        */}
        <div 
          className="
            bg-white
            p-3
            rounded-2xl
          "
        >
          <div 
            className="
              text-base
              overflow-hidden
            "
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "2",
            }} 
          >
            {text}
          </div>
        </div>
        {/* ↓ */}
        <img 
          src={arrowDown}
          width={20}
          className="mx-auto"
        />
        {/* 提案絵文字リスト */}
        <div 
          className="
            bg-white
            rounded-3xl
            overflow-hidden
          "
        >
          {loading ? (
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonEmojiItem key={i} />
              ))}
            </div>
          ) : emojiList.map((emoji) => (
            <button 
              onClick={() => {
                // クリップボードに絵文字をコピー
                navigator.clipboard.writeText(emoji.body);
                // OverlayArea を閉じる
                setOpen(false);
              }}
              key={emoji.body}
              className="
                w-full h-20
                p-3
                flex items-center 
                gap-x-[10px]
                border-b-2 border-sky-50
                transition-all duration-300 ease-in-out
                hover:bg-gray-50 hover:text-sky-500
              "
            >
              <div 
                className="
                  text-center
                  text-[36px]
                "
              >
                {emoji.body}
              </div>
              <div 
                className="
                  text-left
                  min-w-0
                  flex-1
                "
              >
                <div 
                  className="
                    text-xl font-bold
                    truncate
                  "
                >
                  {emoji.name}
                </div>
                <div 
                  className="
                    text-sm
                    truncate
                  "
                >
                  {emoji.description}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div
          className="
            py-3
            text-xs text-gray-500 text-center
          "
        >
          クリックすることで絵文字をクリップボードにコピーします
        </div>
      </div>
    </div>
  );
};

export default OverlayArea;
