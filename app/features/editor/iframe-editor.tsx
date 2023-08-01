"use client";
import { useEffect, useRef, useState } from "react";
import { EditorValues } from "@commons/types/types";
import { Spinner } from "@components/spinner/spinner";

interface IframeEditorProps {
  value?: EditorValues;
  projectId?: string;
  onChange?: (v: EditorValues) => void;
}

export const IframeEditor = ({
  projectId,
  value,
  onChange,
}: IframeEditorProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState<boolean>(!!projectId);
  const [localValue, setLocalValue] = useState<EditorValues>(
    value || { js: "", css: "", html: "" },
  );

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/project/${projectId}`)
      .then<EditorValues>((blob) => blob.json())
      .then((data) => {
        setLocalValue(data);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const { html, js, css } = value || localValue;
    iframe.contentWindow?.postMessage(
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
  }, [iframeRef, value, localValue]);

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
      onChange && onChange({ js, css, html });
    }

    window.addEventListener("message", handleMessage, false);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onChange]);
  return loading ? (
    <Spinner />
  ) : (
    <iframe
      ref={iframeRef}
      style={{ width: "100%", height: "350px" }}
      src={"/editor"}
    />
  );
};
