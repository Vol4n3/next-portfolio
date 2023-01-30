"use client";
import "./editor.scss";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}
export default function EditorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const lock = useRef<boolean>(false);
  useEffect(() => {
    const container = containerRef.current;
    const parent = parentRef.current;
    if (!container || !parent) {
      return;
    }
    if (lock.current) {
      return;
    }
    lock.current = true;
    window.require = { paths: { vs: "/monaco-editor/vs" } };
    const loader = document.createElement("script");
    loader.type = "text/javascript";
    loader.src = "/monaco-editor/vs/loader.js";
    parent.append(loader);
    loader.addEventListener(
      "load",
      () => {
        const nls = document.createElement("script");
        nls.type = "text/javascript";
        nls.src = "/monaco-editor/vs/editor/editor.main.nls.js";
        parent.append(nls);
        nls.addEventListener(
          "load",
          () => {
            const main = document.createElement("script");
            main.type = "text/javascript";
            main.src = "/monaco-editor/vs/editor/editor.main.js";
            parent.append(main);

            main.addEventListener(
              "load",
              () => {
                const model = window.monaco.editor.createModel(
                  [
                    "function x() {",
                    '\tconsole.log("Hello world!");',
                    "}",
                  ].join("\n"),
                  "typescript"
                );
                const instance = window.monaco.editor.create(container, {
                  model,

                  theme: "vs-dark",
                });
                instance.setModel(model);
              },
              { once: true }
            );
          },
          { once: true }
        );
      },
      { once: true }
    );

    /*    */
  }, [containerRef, parentRef]);
  return (
    <div
      style={{
        height: "100vh",
        width: "100vh",
        position: "relative",
      }}
      ref={parentRef}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          border: "1px solid #1e1e1e",
        }}
        ref={containerRef}
      />
    </div>
  );
}
