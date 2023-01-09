import { useEffect, useState } from "react";
import { NumberRangeLoop } from "../../commons/utils/number.utils";
import { InOut } from "../../commons/components/in-out/in-out";
import { KeyframesHelper } from "../../commons/utils/keyframes.utils";

export function TextAnimationLoop({ textes }: { textes: string[] }) {
  const [showTitleAnimation, setShowTitleAnimation] = useState<boolean>(true);
  const [title, setTitle] = useState<string>(textes[0]);
  useEffect(() => {
    let turn = 0;
    let intervalRef: number;
    let idTitle = 0;
    const animTitle = () => {
      turn++;
      if (turn % 2 === 0) {
        idTitle++;
        setTitle(textes[NumberRangeLoop(0, idTitle, textes.length - 1)]);
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
            keyframes: KeyframesHelper.slideInFrom("10px", "10px"),
          }}
          exit={{
            options: { delay: i * 50 },
            keyframes: KeyframesHelper.slideOutFrom("0", "-10px"),
          }}
        >
          {char === " " ? "\u00A0" : char}
        </InOut>
      ))}
    </>
  );
}
