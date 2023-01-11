import * as React from "react";
import { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./sticky.module.scss";

/**
 * Le parent relatif doit être window
 * @param children
 * @constructor
 */
export function TopSticky({ children }: PropsWithChildren) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stickyElement = stickyRef.current;
    const maskElement = maskRef.current;
    if (!stickyElement || !maskElement) {
      return;
    }
    const rect = stickyElement.getBoundingClientRect();
    const offset = rect.top + window.scrollY;
    const onScroll = () => {
      const clientRect = stickyElement.getBoundingClientRect();
      if (clientRect.top <= 0) {
        maskElement.style.setProperty("height", `${clientRect.height}px`);
        stickyElement.style.setProperty("position", "sticky");
        stickyElement.style.setProperty("top", "0");
      }
      if (window.scrollY <= offset) {
        maskElement.style.removeProperty("height");
        stickyElement.style.setProperty("position", "relative");
        stickyElement.style.removeProperty("top");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickyRef, maskRef]);
  return (
    <>
      <div className={styles.sticky} ref={stickyRef}>
        {children}
      </div>
      <div ref={maskRef} />
    </>
  );
}
