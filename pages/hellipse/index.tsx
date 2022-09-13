import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from "next";
import { useEffect, useRef } from "react";
import { Scene2d } from "../../features/canvas2d/scene2d";
import { BlobBall } from "../../features/canvas2d/objects/blob-ball";
import styled from "styled-components";
import {
  darkBlue,
  darkPurple,
  darkRed,
  navyBlue,
} from "../../features/theme/hellipse-colors";
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
    const hellipseRadius = 600;
    const cercleRadius = 200;
    const roleRadius = 50;
    const hellipseRadiusWithoutCercleRadius = hellipseRadius - cercleRadius * 2;
    const hellipseWithoutRoleRadius = hellipseRadius - roleRadius * 2;
    const CercleWithoutRoleRadius = cercleRadius - roleRadius * 2;

    const rolesWithoutCircle = roles.filter(
      (role) => !cercles.some((c) => c.roles.some((r) => r === role.id))
    );
    const BlobsRolesWithoutCircle = rolesWithoutCircle.map((role) => {
      return new BlobBall({
        x:
          Math.random() * hellipseWithoutRoleRadius * 2 -
          hellipseWithoutRoleRadius,
        y:
          Math.random() * hellipseWithoutRoleRadius * 2 -
          hellipseWithoutRoleRadius,
        r: roleRadius,
        name: role.name + role.icon.emoji,
        color: darkPurple,
        scenePriority: 1,
        children: [],
      });
    });
    const cerclesBlob = cercles.map((c) => {
      const cercleX =
        Math.random() * hellipseRadiusWithoutCercleRadius * 2 -
        hellipseRadiusWithoutCercleRadius;
      const cercleY =
        Math.random() * hellipseRadiusWithoutCercleRadius * 2 -
        hellipseRadiusWithoutCercleRadius;
      const cercleRoles = c.roles
        .map((id) => roles.find((f) => f.id === id))
        .filter((f) => typeof f !== "undefined") as Role[];
      const cercleRoleBlobs = cercleRoles.map((r) => {
        return new BlobBall({
          x:
            cercleX +
            (Math.random() * CercleWithoutRoleRadius * 2 -
              CercleWithoutRoleRadius),
          y:
            cercleY +
            (Math.random() * CercleWithoutRoleRadius * 2 -
              CercleWithoutRoleRadius),
          r: roleRadius,
          name: r.name + r.icon.emoji,
          color: darkRed,
          scenePriority: 2,
          children: [],
        });
      });
      return new BlobBall({
        x: cercleX,
        y: cercleY,
        r: cercleRadius,
        name: c.name + c.icon.emoji,
        color: darkBlue,
        scenePriority: 1,
        children: cercleRoleBlobs,
      });
    });
    const hellipseBlob = new BlobBall({
      x: 0,
      y: 0,
      r: hellipseRadius,
      name: "",
      color: navyBlue,
      scenePriority: 0,
      children: [...BlobsRolesWithoutCircle, ...cerclesBlob],
    });
    scene.addItem(hellipseBlob);

    const onClick = (ev: MouseEvent) => {
      const worldClick = scene.camera.screenToWorld({
        x: ev.x,
        y: ev.y,
      });
      scene.moveCamera({
        x: worldClick.x,
        y: worldClick.y,
        distance: scene.camera.distance - 100,
      });
    };
    const onRightClick = (ev: MouseEvent) => {
      ev.preventDefault();
      const worldClick = scene.camera.screenToWorld({
        x: ev.x,
        y: ev.y,
      });
      scene.moveCamera({
        x: worldClick.x,
        y: worldClick.y,
        distance: scene.camera.distance + 200,
      });
    };
    scene.canvas.addEventListener("click", onClick);
    scene.canvas.addEventListener("contextmenu", onRightClick);

    function onMouseMove(ev: MouseEvent) {
      const calc = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
      scene.items.forEach((item) => {
        if (item instanceof BlobBall) {
          item.hover = item.distanceTo(calc) < item.radius;
        }
      });
    }

    scene.canvas.addEventListener("mousemove", onMouseMove);
    return () => {
      scene.destroy();
      scene.canvas.removeEventListener("click", onClick);
      scene.canvas.removeEventListener("contextmenu", onRightClick);
    };
  }, [cercles, roles, hellipsiens]);
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
      props: {
        hellipsiens: [],
        roles: [],
        cercles: [],
      },
    };
  }
}

export default HellipsePage;
