import "./style.css";
import logoIcon from "data-base64:~assets/logo.svg";
import githubIcon from "data-base64:~assets/github-mark.svg";

const IndexPopup = () => {
  return (
    <>
      <div 
        className="
          w-[300px] 
          bg-sky-50 px-5 py-3
          flex flex-col gap-y-3
        "
      >
        <img 
          src={logoIcon}
          className="w-[200px] py-2 ml-6"
        />
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
            選択した文字列から
            <span 
              className="
                px-1 py-[2px] mx-[2px]
                rounded
                bg-sky-500
              "
            >
              <span className="text-white">
                連想される絵文字を提案する
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
              </li>
              <li>
                選択文字列の近くにポップアップが表示されます
              </li>
            </ol>
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
            >
              <img
                src={githubIcon}
                style={{
                  width: 16,
                  fill: "var(--main)",
                  transition: "fill 300ms ease-in-out",
                }}
                className="
                  w-4
                  fill-gray-500 hover:fill-sky-500
                  duration-300 ease-in-out
                "
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndexPopup;
