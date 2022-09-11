import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useEffect, useRef } from "react";
import { Scene2d } from "../../features/canvas2d/scene2d";
import { BlobBall } from "../../features/canvas2d/objects/blob-ball";
import styled from "styled-components";
import { darkPurple } from "../../features/theme/hellipse-colors";
import {
  Cercle,
  Hellipsien,
  Role,
} from "../../features/notion/notion-api-type";
import * as Process from "process";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background: ${darkPurple};
`;

interface HellipsePageProps {
  hellipsiens: Hellipsien[];
  roles: Role[];
  cercles: Cercle[];
}

const HellipsePage: NextPage<HellipsePageProps> = ({
  cercles,
  roles,
  hellipsiens,
}: HellipsePageProps) => {
  const refContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = refContainer.current;
    if (!container) {
      return;
    }

    const scene = new Scene2d(container);
    const items = [
      ...cercles.map(
        (c, i) =>
          new BlobBall(
            (scene.canvas.width / 4) * (i + 1),
            (scene.canvas.height / 4) * (i + 1),
            80,
            c.name + c.icon.emoji
          )
      ),
      ...roles.map(
        (r, i) =>
          new BlobBall(
            scene.canvas.width - (scene.canvas.width / 16) * (i + 1),
            (scene.canvas.height / 16) * (i + 1),
            30,
            r.name + r.icon.emoji
          )
      ),
    ];
    items.forEach((item) => scene.addItem(item));
    const onClick = (ev: MouseEvent) => {
      scene.moveCamera({ distance: scene.camera.scale + 0.1 });
    };
    scene.canvas.addEventListener("click", onClick);

    function onMouseMove(ev: MouseEvent) {
      const calc = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
      items.forEach(
        (item) => (item.hover = item.distanceTo(calc) < item.radius)
      );
    }

    scene.canvas.addEventListener("mousemove", onMouseMove);
    return () => {
      scene.destroy();
      scene.canvas.removeEventListener("click", onClick);
    };
  }, []);
  return <Container ref={refContainer}></Container>;
};

export async function getServerSideProps({
  res,
}: GetServerSidePropsContext): Promise<
  GetServerSidePropsResult<HellipsePageProps>
> {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=59"
  );
  try {
    const data = await Promise.all([
      fetch(`${Process.env.API_URI}/notion/hellipsien`),
      fetch(`${Process.env.API_URI}/notion/cercle`),
      fetch(`${Process.env.API_URI}/notion/role`),
    ]);
    const dataToJson = await Promise.all(data.map((d) => d.json()));
    return {
      props: {
        hellipsiens: dataToJson[0],
        cercles: dataToJson[1],
        roles: dataToJson[2],
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default HellipsePage;
