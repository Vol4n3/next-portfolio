import { PropsWithChildren, useEffect, useRef } from "react";
import styled from "styled-components";
import { Scene2d } from "../canvas2d/scene2d";
import { BlobBall } from "../canvas2d/objects/blob-ball";
import { darkPurple } from "../theme/hellipse-colors";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: ${darkPurple};
`;

export function MainTemplate({ children }: PropsWithChildren) {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }
    const scene = new Scene2d(container);
    const item = new BlobBall(
      scene.canvas.width / 2,
      scene.canvas.height / 2,
      50,
      "circle"
    );
    scene.addItem(item);
    const onClick = (ev: MouseEvent) => {
      scene.moveCamera({ distance: scene.camera.distance + 100 });
    };
    scene.canvas.addEventListener("click", onClick);

    function onMouseMove(ev: MouseEvent) {
      const calc = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
      item.hover = item.distanceTo(calc) < item.radius;
    }

    scene.canvas.addEventListener("mousemove", onMouseMove);
    return () => {
      scene.destroy();
      scene.canvas.removeEventListener("click", onClick);
    };
  }, []);
  return (
    <>
      <Container ref={refContainer}></Container>
      {children}
    </>
  );
}
