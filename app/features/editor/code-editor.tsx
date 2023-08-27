"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorValues } from "@commons/types/types";
import { Spinner } from "@components/spinner/spinner";

interface CodeEditorProps {
  defaultValue?: EditorValues;
  projectId?: string;
  onChange?: (v: EditorValues) => void;
}

export const CodeEditor = ({
  projectId,
  defaultValue,
  onChange,
}: CodeEditorProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState<boolean>(!!projectId);
  const sendMessage = useCallback(
    (val: EditorValues) => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      setTimeout(() => {
        iframe.contentWindow?.postMessage(
          {
            source: "editorSetValue",
            payload: val,
          },
          window.location.origin,
        );
      }, 250);
    },
    [iframeRef],
  );
  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/project/${projectId}`)
      .then<EditorValues>((blob) => blob.json())
      .then((data) => {
        sendMessage(data);
      })
      .finally(() => setLoading(false));
  }, [projectId, sendMessage]);

  useEffect(() => {
    if (!defaultValue) {
      return;
    }
    sendMessage(defaultValue);
  }, [defaultValue, sendMessage]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (
        !event.data.source ||
        !event.data.payload ||
        event.data.source !== "editorChange"
      ) {
        return;
      }
      onChange && onChange(event.data.payload);
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
