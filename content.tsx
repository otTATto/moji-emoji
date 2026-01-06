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
    style={{
      width: "100%",
      height: 80,
      padding: 12,
      display: "flex",
      alignItems: "center",
      columnGap: 10,
      borderBottom: "2px solid var(--background)",
    }}
  >
    {/* 絵文字部分 */}
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "var(--background)",
        animation: "skeleton 1.2s ease-in-out infinite",
      }}
    />
    {/* テキスト部分 */}
    <div style={{ flex: 1 }}>
      <div
        style={{
          height: 20,
          width: "40%",
          borderRadius: 8,
          backgroundColor: "var(--background)",
          marginBottom: 8,
          animation: "skeleton 1.2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          height: 14,
          width: "70%",
          borderRadius: 8,
          backgroundColor: "var(--background)",
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
        style={{
          backgroundColor: "var(--background)", 
          display: "flex",
          flexDirection: "column",
          rowGap: 12, 
          padding: 20,
        }}
      >
        {/* MojiEmoji ロゴマーク */}
        <img 
          src={logoIcon}
          width={150}
          style={{
            marginLeft: "100px",
            paddingTop: 8,
            paddingBottom: 8,
          }}
        />
        {/* 
          選択文字列
          NOTE: 2 行でトランケート
        */}
        <div 
          style={{
            backgroundColor: "var(--pond)", 
            padding: 12,           
            borderRadius: 16, 
          }}
        >
          <div 
            style={{
              color: "var(--main)",
              fontSize: 16,

              overflow: "hidden",
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
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        {/* 提案絵文字リスト */}
        <div 
          style={{
            backgroundColor: "var(--pond)",
            borderRadius: 24,
            overflow: "hidden",
          }}
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
              style={{
                width: "100%",
                height: 80,
                padding: 12, 

                display: "flex",
                alignItems: "center",
                columnGap: 10,

                borderBottom: "2px solid var(--background)",

                transitionProperty: "all",
                transitionDuration: "300",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--pond-sub)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--pond)"
              }}
            >
              <div 
                style={{
                  textAlign: "center",
                  fontSize: 36,
                }}
              >
                {emoji.body}
              </div>
              <div 
                style={{
                  textAlign: "left",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div 
                  style={{
                    color: "var(--main)", 
                    fontSize: 20, 
                    fontWeight: 700, 

                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {emoji.name}
                </div>
                <div 
                  style={{
                    color: "var(--sub)",    
                    fontSize: 14, 
                    
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {emoji.description}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "12 0",
            color: "var(--sub)",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          クリックすることで絵文字をクリップボードにコピーします
        </div>
      </div>
    </div>
  );
};

export default OverlayArea;
