import "./style.css";
import logoIcon from "data-base64:~assets/logo.svg";
import githubIcon from "data-base64:~assets/github-mark.svg";

const IndexPopup = () => {
  return (
    <>
      <div 
        style={{
          width: 300,
          padding: "12px 20px",
          backgroundColor: "var(--background)",

          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <img 
          src={logoIcon}
          style={{
            width: 200,
            padding: "8px 0",
            marginLeft: 24,
          }}
        />
        <div 
          style={{
            padding: 12,
            borderRadius: 16,
            backgroundColor: "var(--pond)",

            color: "var(--main)",
            fontSize: 14,
          }}
        >
          <p>
            選択した文字列から連想される絵文字を提案する拡張機能です。
          </p>
          <h3>
            使い方
          </h3>
          <div>
            <ol>
              <li>
                Web ページ上で文字列を選択します
              </li>
              <li>
                Ctrl + Shift + E を押下します
              </li>
              <li>
                選択文字列の近くにポップアップが表示されます
              </li>
            </ol>
          </div>
        </div>
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,

            color: "var(--sub)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <div>
            © <a
            href="https://x.com/0123tato"
            target="_blank"
            style={{
              textDecoration: "none",
              transition: "color 300ms ease-in-out",
            }}
            className="
              text-hover
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
                  svg-hover
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
