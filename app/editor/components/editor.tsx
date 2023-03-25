import { useCallback, useEffect, useState } from "react";
import styles from "./editor.module.scss";
import { Flex } from "../../commons/components/flex/flex";
import { Labeled } from "../../commons/types/utils-type";
import MonacoWrapper from "./monaco-wrapper";
import { Preview } from "./preview";

type Tab = "js" | "html" | "css";
type EditorFile = { [key in Tab]: string };

interface EditorProps {
  projectId?: string | null;
}

function Spinner() {
  return (
    <div className={styles.spinner}>
      <svg viewBox="-3 -4 39 39" width={"100px"}>
        <polygon strokeWidth="1" points="16,0 32,32 0,32"></polygon>
      </svg>
    </div>
  );
}

export const Editor = ({ projectId }: EditorProps) => {
  const [loading, setLoading] = useState<boolean>(!!projectId);
  const [tab, setTab] = useState<Tab>("js");
  const [js, setJs] = useState<string>("");
  const [css, setCss] = useState<string>("");
  const [html, setHtml] = useState<string>("");

  const [previewState, setPreviewState] = useState<{
    js: string;
    css: string;
    html: string;
  }>({ js, css, html });

  const runPreview = useCallback(() => {
    setPreviewState({
      css,
      js,
      html,
    });
  }, [css, html, js]);
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`/api/projects?id=${projectId}`)
      .then((blob) => blob.json())
      .then(({ css, js, html }: EditorFile) => {
        setJs(js);
        setCss(css);
        setHtml(html);
        setPreviewState({
          css,
          js,
          html,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId]);
  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
        runPreview();
      }
    };
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [runPreview]);
  return (
    <div className={styles.editorGlobal}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Flex className={styles.editorBar}>
            {(
              [
                { label: "Javascript", value: "js" },
                { label: "HTML", value: "html" },
                { label: "CSS", value: "css" },
              ] as Labeled<Tab>[]
            ).map((item) => (
              <button
                key={item.value}
                onClick={() => setTab(item.value)}
                className={item.value === tab ? styles.active : undefined}
              >
                {item.label}
              </button>
            ))}
            <button title={"ctrl + s"} onClick={runPreview}>
              Run 👉
            </button>
          </Flex>
          <Flex wraps={"nowrap"}>
            {tab === "js" && (
              <MonacoWrapper
                value={js}
                onChange={setJs}
                language={"javascript"}
              />
            )}
            {tab === "html" && (
              <MonacoWrapper
                value={html}
                onChange={setHtml}
                language={"html"}
              />
            )}
            {tab === "css" && (
              <MonacoWrapper value={css} onChange={setCss} language={"css"} />
            )}

            <div className={styles.previewPanel}>
              <Preview
                css={previewState.css}
                html={previewState.html}
                js={previewState.js}
              />
            </div>
          </Flex>
        </>
      )}
    </div>
  );
};
