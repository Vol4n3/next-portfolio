"use client";

import { CenteredContainer } from "../commons/components/container/centered-container";
import { Button } from "../commons/components/button/button";
import { useIntersectionObserver } from "../commons/components/intersection-observer/intersection-observer";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const listener = useIntersectionObserver();
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const element2 = ref2.current;
    if (!element || !element2) return;
    const unobserve = listener({
      element,
      callback: (arg) => {
        console.log("1", arg);
      },
    });
    const unobserve2 = listener({
      element: element2,
      callback: (arg) => {
        console.log("2", arg);
      },
    });
    return () => {
      unobserve();
      unobserve2();
    };
  }, [ref, ref2, listener]);
  return (
    <CenteredContainer maxWidth={"1280px"}>
      <Button theme={"primary"}>Hello</Button>
      <div ref={ref} style={{ height: "2000px", background: "yellow" }}></div>
      <main ref={ref2} style={{ height: "2000px", background: "pink" }}></main>
    </CenteredContainer>
  );
}
