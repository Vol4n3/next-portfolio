"use client";

import { Editor } from "@features/editor/editor";
import { useEffect, useState } from "react";
import { EditorValues } from "@commons/types/types";

export default function EditorPage() {
  const [values, setValues] = useState<EditorValues>({
    js: "",
    css: "",
    html: "",
  });
  const [preview, setPreview] = useState<EditorValues>({
    js: "",
    css: "",
    html: "",
  });
  useEffect(() => {
    const { js, html, css } = values;
    window.parent.postMessage(
      {
        source: "editor",
        payload: {
          js,
          css,
          html,
        },
      },
      window.location.origin,
    );
  }, [values]);
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (
        !event.data.source ||
        !event.data.payload ||
        event.data.source !== "editor"
      ) {
        return;
      }
      const { js = "", css = "", html = "" } = event.data.payload;
      setValues({ css, js, html });
      setPreview({ css, js, html });
    }

    window.addEventListener("message", handleMessage, false);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  });
  return (
    <Editor
      preview={preview}
      value={values}
      onChange={setValues}
      onPreviewChange={setPreview}
    />
  );
}
