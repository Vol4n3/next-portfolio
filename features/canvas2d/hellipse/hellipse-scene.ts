import { Scene2d } from "../scene2d";
import { BlobBall } from "../objects/blob-ball";
import {
  darkBlue,
  darkPurple,
  darkRed,
  navyBlue,
} from "../../theme/hellipse-colors";
import { Cercle, Hellipsien, Role } from "../../notion/notion-api-type";

export interface HellipseSceneAction {
  destroy: () => void;
}

export function HellipseSceneInit(
  container: HTMLDivElement,
  roles: Role[],
  cercles: Cercle[],
  hellipsien: Hellipsien[]
): HellipseSceneAction {
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
  scene.addMultipleItem([
    hellipseBlob,
    ...cerclesBlob,
    ...BlobsRolesWithoutCircle,
  ]);
  const hoverItems: BlobBall[] = [...cerclesBlob, ...BlobsRolesWithoutCircle];
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
    hoverItems.forEach((item) => {
      item.hover = item.distanceTo(calc) < item.radius;
    });
  }

  scene.canvas.addEventListener("mousemove", onMouseMove);
  return {
    destroy: () => {
      scene.destroy();
      scene.canvas.removeEventListener("click", onClick);
      scene.canvas.removeEventListener("contextmenu", onRightClick);
    },
  };
}
