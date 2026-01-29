import styleLocal from "data-text:./style.css"
import logoIcon from "data-base64:~assets/logo.svg";
import arrowDown from "data-base64:~assets/arrow-down.svg";
import { Plus, RotateCw, Check } from 'lucide-react';
import type { PlasmoGetStyle } from "plasmo"
import { useState, useMemo, useEffect, useRef } from "react";
import type { Pos, Nuance, Emoji, EmojiSuggestReq, EmojiSuggestRes } from "~types";
import { NUANCES } from "~types"; 
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
  const [isLoading, setIsLoading] = useState(false);        // 絵文字の suggestion 中かどうか
  const [isNuanceOpen, setIsNuanceOpen] = useState(false); 
  const [selectedNuances, setSelectedNuances] = useState<Set<Nuance>>(new Set());

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

  const runSuggest = async (inputText: string, inputNuances?: Set<Nuance>) => {
    setIsLoading(true);
    setEmojiList([]);

    try {
      const nuances =
        inputNuances && inputNuances.size > 0
          ? Array.from(inputNuances)
          : undefined;

      const res = await sendToBackground<EmojiSuggestReq, EmojiSuggestRes>({
        name: "emoji-suggest",
        body: { text: inputText, nuances },
      });

      setEmojiList(res.emojiList ?? []);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // キー押下時に OverlayArea を表示させて suggest を走らせる
    const onKeyDown = (e: KeyboardEvent) => {
      // TODO: 仮に (Ctrl または ⌘) + Shift + E にしているが、将来的に設定で好きに変更できるようにする
      const isHit =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "e";
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
        zIndex: 2147483647, 
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
            pb-2
          "
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        {/* 
          テキストボックス
        */}
        <div 
          className="
            bg-white
            p-2
            rounded-3xl
            flex flex-col
            gap-y-3
          "
        >
          {/* 
            選択文字列
            NOTE: 2 行でトランケート
          */}
          <div 
            className="
              px-3 pt-2
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
          <div
            className="
              flex gap-x-2
              justify-end
            "
          >
            <div className="relative">
              <button
                onClick={() => setIsNuanceOpen(v => !v)}
                aria-expanded={isNuanceOpen}
                className={`
                  w-[42px] h-[40px] py-2
                  rounded-full
                  duration-300 ease-in-out
                  text-center font-bold
                  focus:outline-2 outline-white
                  focus:outline-offset-2 
                  flex flex-row 
                  justify-center items-center
                  gap-x-1 
                  ${isNuanceOpen
                    ? `
                        text-white hover:text-white
                        bg-sky-500 hover:bg-sky-400 
                      `
                    : `
                        bg-sky-50 hover:bg-sky-100
                        text-sky-500 hover:text-sky-600
                        focus:outline-sky-500
                        cursor-pointer
                      `
                  }
                `}
              >
                <Plus
                  size={16}
                  className={`
                    duration-300 ease-in-out
                    ${isNuanceOpen
                      ? 'rotate-45'
                      : ''
                    }  
                  `}
                />
              </button>
              {/* 選択中のニュアンスがあれば付くバッジ */}
              <span
                className={`
                  absolute 
                  top-0 right-0 translate-x-1/4 -translate-y-1/4
                  duration-300 ease-in-out
                  w-[10px] h-[10px] rounded-full
                  ${selectedNuances.size > 0
                    ? 'bg-sky-500 ring-4 ring-white'
                    : ''
                  }
                `}
              />
            </div>
            <button
              onClick={() => {runSuggest(text, selectedNuances)}}
              className={`
                px-4 py-2
                rounded-full
                duration-300 ease-in-out
                text-center font-bold
                focus:outline-2 outline-white
                focus:outline-offset-2 
                flex flex-row 
                justify-center items-center
                gap-x-1 
                ${isLoading 
                  ? `
                      disabled 
                      bg-gray-200 text-white
                      focus:outline-gray-200
                      cursor-not-allowed
                    ` 
                  : `
                      bg-sky-50 hover:bg-sky-100
                      text-sky-500 hover:text-sky-600
                      focus:outline-sky-500
                      cursor-pointer
                    `
                }
              `}
            >
              <RotateCw 
                size={16}
              />
              <div className="translate-y-[-1px]">
                再生成する
              </div>
            </button>
          </div>
          <div
            className={`
              overflow-hidden
              transition-all duration-300 ease-in-out
              ${
                isNuanceOpen 
                  ? 'max-h-[160px] opacity-100 mt-[-4px]' 
                  : 'max-h-0 opacity-0 pointer-events-none mt-[-12px]'
              }
            `}
          >
            <div
              className="
                p-4
                rounded-3xl
                bg-sky-50
                flex flex-wrap gap-2
              "
            >
              {NUANCES.map((nuance) => (
                <div className="relative">
                  <button
                    key={nuance}
                    onClick={() => {
                      if (isLoading) return;
                      setSelectedNuances(prev => {
                        const next = new Set(prev);
                        if (next.has(nuance)) next.delete(nuance);
                        else next.add(nuance);
                        return next;
                      });
                    }}
                    className={`
                      px-4 py-2
                      rounded-full
                      duration-300 ease-in-out
                      text-xs
                      text-center font-bold
                      bg-white
                      border-2 
                      focus:outline-2 outline-white
                      focus:outline-offset-2 focus:outline-sky-500
                      ${isLoading
                        ? 'cursor-not-allowed'
                        : 'hover:text-sky-500'
                      }
                      ${selectedNuances.has(nuance)
                        ? 'text-sky-500 border-sky-500'
                        : 'text-gray-600  border-white'
                      }
                    `}
                  >
                    {nuance}
                  </button>
                  <span
                    className={`
                      absolute 
                      top-0 left-0 -translate-x-1/4 -translate-y-1/4
                      duration-300 ease-in-out
                      w-5 h-5 rounded-full
                      flex items-center justify-center
                      ${selectedNuances.has(nuance)
                        ? 'bg-sky-500 text-white'
                        : 'text-transparent'
                      }
                    `}
                  >
                    <Check
                      size={12}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* ↓ */}
        <img 
          src={arrowDown}
          width={20}
          className="mx-auto"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        {/* 提案絵文字リスト */}
        <div 
          className="
            p-2
            bg-white
            rounded-3xl
            overflow-hidden
          "
        >
          {isLoading ? (
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
                rounded-3xl
                focus:outline-2 outline-white
                focus:outline-offset-2 
                flex items-center 
                gap-x-[10px]
                transition-all duration-300 ease-in-out
                hover:bg-sky-50 hover:text-sky-700
                focus:outline-sky-500 
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
