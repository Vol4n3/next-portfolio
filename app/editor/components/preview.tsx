import { useEffect, useRef } from "react";
import styles from "./preview.module.scss";

interface PreviewProps {
  css: string;
  html: string;
  js: string;
}

export function Preview({ js, css, html }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.innerHTML = html;
    const style = document.createElement("style");
    style.innerText = css;
    container.appendChild(style);
    try {
      eval(js);
    } catch (e) {
      console.error(e);
    }
  }, [js, html, css, containerRef]);
  return <div className={styles.preview} ref={containerRef}></div>;
}
