"use client";
import { useEffect, useState } from "react";
import { ArrayUtils, KeyframesUtils } from "jcv-ts-utils";
import { InOut } from "@components/in-out/in-out";

export function TextAnimationLoop({ textes }: { textes: string[] }) {
  const [showTitleAnimation, setShowTitleAnimation] = useState<boolean>(true);
  const [title, setTitle] = useState<string>(textes[0]);
  useEffect(() => {
    let turn = 0;
    let intervalRef: number;
    const animTitle = () => {
      turn++;
      if (turn % 2 === 0) {
        setTitle(ArrayUtils.pickRandomOne(textes));
      }

      setShowTitleAnimation((prev) => !prev);
      if (turn % 2 === 1) {
        intervalRef = window.setTimeout(animTitle, 1000);
      } else {
        intervalRef = window.setTimeout(animTitle, 8000);
      }
    };
    intervalRef = window.setTimeout(animTitle, 8000);
    return () => {
      clearInterval(intervalRef);
    };
  }, [textes]);
  return (
    <>
      {title.split("").map((char, i) => (
        <InOut
          style={{ display: "inline-block" }}
          key={i + char}
          show={showTitleAnimation}
          starting={true}
          enter={{
            options: { delay: i * 50 },
            keyframes: KeyframesUtils.slideInFrom("10px", "10px"),
          }}
          exit={{
            options: { delay: i * 50 },
            keyframes: KeyframesUtils.slideOutFrom("0", "-10px"),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </InOut>
      ))}
    </>
  );
}
