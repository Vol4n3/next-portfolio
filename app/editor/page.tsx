"use client";

import { Editor } from "@features/editor/editor";
import { useEffect, useState } from "react";
import { EditorValues } from "@commons/types/types";

export default function EditorPage() {
  const [values, setValues] = useState<EditorValues>();
  const emitChange = (val: EditorValues) => {
    const { js, html, css } = val;
    window.parent.postMessage(
      {
        source: "editorChange",
        payload: {
          js,
          css,
          html,
        },
      },
      window.location.origin,
    );
    setValues(val);
  };

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (
        !event.data.source ||
        !event.data.payload ||
        event.data.source !== "editorSetValue"
      ) {
        return;
      }
      const { js = "", css = "", html = "" } = event.data.payload;
      setValues({ css, js, html });
    }

    window.addEventListener("message", handleMessage, false);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return <Editor value={values} onChange={emitChange} />;
}
