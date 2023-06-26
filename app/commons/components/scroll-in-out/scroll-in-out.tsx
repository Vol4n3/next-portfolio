import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { AnimationConfig, InOut, InOutProps } from "../in-out/in-out";
import { useIntersectionObserver } from "../intersection-observer/intersection-observer";
import { KeyframesUtils } from "jcv-ts-utils";

interface ScrollInOutProps extends Omit<InOutProps, "show" | "autoScroll"> {
  enter?: AnimationConfig;
  exit?: AnimationConfig;
  defaultEnterFrom?: "left" | "right" | "top" | "bottom";
}

export const ScrollInOut = ({
  children,
  defaultEnterFrom = "bottom",
  ...inOutProps
}: PropsWithChildren<ScrollInOutProps>) => {
  const ref = useRef<HTMLDivElement>(null);
  const intersectionObserver = useIntersectionObserver();
  const [show, setShow] = useState<boolean>(true);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const unobserve = intersectionObserver({
      element,
      callback: (arg) => {
        setShow(arg.isIntersecting);
      },
    });
    return () => {
      unobserve();
    };
  }, [intersectionObserver]);
  const x =
    defaultEnterFrom === "left"
      ? "-30px"
      : defaultEnterFrom === "right"
      ? "30px"
      : "0";
  const y =
    defaultEnterFrom === "top"
      ? "-30px"
      : defaultEnterFrom === "bottom"
      ? "30px"
      : "0";
  return (
    <div ref={ref}>
      <InOut
        show={show}
        enter={{
          keyframes: KeyframesUtils.slideInFrom(x, y),
          options: { duration: 800 },
        }}
        exit={{
          keyframes: [],
          options: { duration: 0, delay: 0 },
        }}
        {...inOutProps}
      >
        {children}
      </InOut>
    </div>
  );
};
