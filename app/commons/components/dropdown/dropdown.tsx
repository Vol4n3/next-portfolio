import * as React from "react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { InOut } from "../in-out/in-out";
import { KeyframesUtils } from "jcv-ts-utils";

interface DropdownProps {
  show: boolean;
  onClose: () => void;
  horizontalDirection?: "right" | "left";
  fulfilled?: boolean;
  offset?: number;
}

export function Dropdown({
  fulfilled,
  children,
  onClose,
  horizontalDirection,
  show,
  offset,
}: PropsWithChildren<DropdownProps>) {
  const [wrapperHeight, setWrapperHeight] = useState<number>(0);
  const [verticalDirection, setVerticalDirection] = useState<"top" | "bottom">(
    "top"
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapperRef) {
      return;
    }
    const child = wrapperRef.current as HTMLDivElement;
    if (!child) {
      return;
    }
    const parent = child.parentElement;
    if (!parent) {
      return;
    }
    const onScroll = () => {
      const rect = parent.getBoundingClientRect();
      const ratio = rect.y / window.innerHeight;
      const limit = 0.4;
      if (ratio < -0.5 || ratio > 1.5) {
        if (show) {
          onClose();
        }
      } else if (ratio > limit && verticalDirection === "top") {
        setVerticalDirection("bottom");
      } else if (ratio <= limit && verticalDirection === "bottom") {
        setVerticalDirection("top");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [wrapperRef, verticalDirection, onClose, show]);
  useEffect(() => {
    const child = wrapperRef.current as HTMLDivElement;
    if (!child) {
      return;
    }
    const parent = child.parentElement;
    if (!parent) {
      return;
    }
    const cleanUp = () => {
      window.removeEventListener("click", autoClose);
      parent.removeEventListener("keydown", keyPress, true);
    };
    const autoClose = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!parent.contains(target)) {
        onClose();
      }
    };
    const keyPress = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.code === "Tab" || event.which === 9) {
        setTimeout(() => {
          const stillBlurInto = parent.contains(document.activeElement);
          if (!stillBlurInto) {
            onClose();
          }
        }, 1);
        return;
      }
      if (
        event.key === "Escape" ||
        event.code === "Escape" ||
        event.which === 27
      ) {
        onClose();
      }
    };

    parent.style.position = "relative";
    setWrapperHeight(parent.clientHeight);
    if (show) {
      window.addEventListener("click", autoClose);
      parent.addEventListener("keydown", keyPress, true);
    } else {
      cleanUp();
    }

    return () => {
      cleanUp();
    };
  }, [onClose, wrapperRef, show]);
  return (
    <div
      style={{
        [verticalDirection]: `${wrapperHeight - (offset || 0)}px`,
        [horizontalDirection || "right"]: "0",
        width: fulfilled ? "100%" : undefined,
      }}
      ref={wrapperRef}
    >
      <div style={{ pointerEvents: "initial" }}>
        <InOut
          show={show}
          enter={{ keyframes: KeyframesUtils.slideInFrom("0", "-30px") }}
          exit={{ keyframes: [], options: { duration: 1 } }}
        >
          {children}
        </InOut>
      </div>
    </div>
  );
}
