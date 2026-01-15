import "./style.css";
import logoIcon from "data-base64:~assets/logo.svg";
import githubIcon from "data-base64:~assets/github-mark.svg";

const IndexPopup = () => {
  return (
    <>
      <div 
        className="
          w-[400px] 
          bg-sky-50 px-5 py-3
          flex flex-col gap-y-3
        "
      >
        <div
          className="
            relative inline-block
          "
        >
          <img 
            src={logoIcon}
            alt="Logo Image of MojiEmoji"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="
              w-[200px] py-2 
              ml-[75px]
            "
          />
          <a
            href="https://github.com/otTATto/moji-emoji/releases"
            target="_blank"
            className="
              absolute 
              right-0 bottom-0
              translate-x-[-90px] translate-y-[-5px]
              font-bold
              text-gray-500 hover:text-sky-500
              duration-300 ease-in-out
            "
          >
            v.1.0.1
          </a>
        </div>
        <div 
          className="
            p-3
            bg-white
            rounded-2xl
            text-sm
            flex flex-col gap-y-3
          "
        >
          <p>
            選択した<strong 
              className="
                px-[2px]
                font-bold text-sky-500 
              "
            >
              文字
            </strong>列から
            <span 
              className="
                px-2 pt-[2px] pb-[4px] mx-[2px]
                rounded-full
                bg-sky-500
              "
            >
              <span className="text-white">
                連想される<strong className="font-bold px-[2px]">
                  絵文字
                </strong>を提案する
              </span>
            </span>
            拡張機能です。
          </p>
          <hr className="border-b-1 border-sky-50"></hr>
          <h3 
            className="
              text-xl text-sky-500 font-bold
            "
          >
            使い方 🔧
          </h3>
          <div className="pl-5">
            <ol 
              className="
                list-decimal marker:text-sky-500
                flex flex-col gap-y-1
              "
            >
              <li>
                Web ページ上で文字列を選択します
              </li>
              <li>
                <span className="
                  px-1 py-[2px] mr-[2px]
                  rounded
                  bg-gray-100 
                  text-xs
                "
                >
                  Ctrl または ⌘
                </span> 
                + 
                <span className="
                  px-1 py-[2px] mx-[2px]
                  rounded
                  bg-gray-100 
                  text-xs
                "
                >
                  Shift
                </span>
                + 
                <span className="
                  px-1 py-[2px] mx-[2px]
                  rounded
                  bg-gray-100 
                  text-xs
                "
                >
                  E
                </span>
                を押下します
                <span
                  className="
                    mx-1
                    text-rose-500 font-bold
                  "
                >※</span>
              </li>
              <li>
                選択文字列の近くにポップアップが表示されます
              </li>
            </ol>
          </div>
          <div
            className="
              p-2
              rounded-xl
              bg-rose-50
              text-rose-900 text-xs
            "
          >
            <span
              className="
                mr-1
                text-rose-500 font-bold
              "
            >
              ※
            </span>
            Web ページによっては、特定のキーボード入力が無効化されている場合があります。
            キーボード入力以外のご利用方法を、今後実装予定です。
          </div>
        </div>
        <div 
          className="
            flex items-center justify-center gap-x-1
            text-gray-500 text-xs font-bold 
          "
        >
          <div>
            © <a
            href="https://x.com/0123tato"
            target="_blank"
            className="
              hover:text-sky-500
              duration-300 ease-in-out
            ">
              たと
            </a>
          </div>
          <div>・</div>
          <div>
            <a
              href="https://github.com/otTATto/moji-emoji"
              target="_blank"
              className="
                flex flex-row space-x-1
                hover:text-sky-500
                duration-300 ease-in-out
              "
            >
              <img
                src={githubIcon}
                className="
                  w-4
                  fill-gray-500 hover:fill-sky-500
                  duration-300 ease-in-out
                "
              />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndexPopup;
