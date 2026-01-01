import "./style.css";
import logoIcon from "data-base64:~assets/logo.svg";
import githubIcon from "data-base64:~assets/github-mark.svg";

const IndexPopup = () => {
  return (
    <>
      <div className="
        w-[300px] 
        bg-sky-50 px-5 py-3
        flex flex-col gap-y-3
      ">
        <img 
          src={logoIcon}
          className="w-[200px] py-2 ml-6"
        />
        <div className="
          text-gray-700
          text-sm
          bg-white 
          p-3 rounded-2xl
        ">
          選択した文字列から連想される絵文字を提案する拡張機能です。
        </div>
        <div className="
          flex items-center justify-center gap-x-1
          text-gray-500 text-xs font-bold 
        ">
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
                className="
                  w-4 
                  fill-gray-500 hover:fill-sky-500 
                  duration-300 ease-in-out"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default IndexPopup;
