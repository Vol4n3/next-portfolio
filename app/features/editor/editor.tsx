"use client";
import { useEffect, useState } from "react";
import styles from "./editor.module.scss";
import MonacoWrapper from "./monaco-wrapper";
import { Preview } from "./preview";
import { InOut } from "@components/in-out/in-out";
import { EditorValues } from "@commons/types/types";
import { Labeled } from "jcv-ts-utils";

type Tab = "js" | "html" | "css";

type StateShow = "both" | "code" | "preview";
const StatesShow: StateShow[] = ["both", "code", "preview"];

interface EditorProps {
  value: EditorValues;
  onChange: (v: EditorValues) => void;
  preview: EditorValues;
  onPreviewChange: (v: EditorValues) => void;
}

export const Editor = ({
  value: { css, js, html },
  preview,
  onPreviewChange,
  onChange,
}: EditorProps) => {
  const [tab, setTab] = useState<Tab>("js");
  const [show, setShow] = useState<StateShow>("preview");
  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault();
        onPreviewChange({ css, js, html });
      }
    };
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [css, js, html, onPreviewChange]);
  return (
    <div className={styles.editorGlobal}>
      <InOut show={true} starting={true}>
        <div className={styles.editorBar}>
          {(
            [
              { label: "JS", value: "js" },
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
          <div>
            <button
              onClick={() =>
                setShow(
                  (prev) =>
                    StatesShow.at(StatesShow.indexOf(prev) - 1) as StateShow,
                )
              }
            >
              {show}
            </button>
            <button
              title={"ctrl + s"}
              onClick={() => onPreviewChange({ css, js, html })}
            >
              Run 👉
            </button>
          </div>
        </div>
        <div className={styles.editorContent}>
          {(show === "code" || show === "both") && (
            <>
              {tab === "js" && (
                <MonacoWrapper
                  value={js}
                  className={styles.editorPanel}
                  width={show === "code" ? "100%" : "50%"}
                  onChange={(value) => onChange({ css, js: value, html })}
                  language={"javascript"}
                />
              )}
              {tab === "html" && (
                <MonacoWrapper
                  value={html}
                  className={styles.editorPanel}
                  width={show === "code" ? "100%" : "50%"}
                  onChange={(value) => onChange({ css, js, html: value })}
                  language={"html"}
                />
              )}
              {tab === "css" && (
                <MonacoWrapper
                  value={css}
                  className={styles.editorPanel}
                  width={show === "code" ? "100%" : "50%"}
                  onChange={(value) => onChange({ css: value, js, html })}
                  language={"css"}
                />
              )}
            </>
          )}

          {(show === "preview" || show === "both") && (
            <div className={styles.previewPanel}>
              <Preview css={preview.css} html={preview.html} js={preview.js} />
            </div>
          )}
        </div>
      </InOut>
    </div>
  );
};
