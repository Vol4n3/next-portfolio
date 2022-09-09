import { PropsWithChildren, useEffect, useRef } from "react";
import styled from "styled-components";
import { Scene2d } from "../canvas2d/scene2d";
import { BlobBall } from "../canvas2d/objects/blob-ball";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  pointer-events: none;
`;

export function MainTemplate({ children }: PropsWithChildren) {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container);
    const item = new BlobBall(50, 50, 50);
    scene.addItem(item);
    const onClick = () => {
      item.bounce();
    };
    window.addEventListener("click", onClick);
    return () => {
      scene.destroy();
      window.removeEventListener("click", onClick);
    };
  }, []);
  return (
    <>
      <Container color={'red'} ref={refContainer}></Container>
      {children}
    </>
  );
}
