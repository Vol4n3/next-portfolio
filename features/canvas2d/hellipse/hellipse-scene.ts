import { Scene2d } from "../scene2d";
import { BlobBall } from "../objects/blob-ball";
import {
  darkBlue,
  darkPurple,
  darkRed,
  navyBlue,
} from "../../theme/hellipse-colors";
import { Cercle, Hellipsien, Role } from "../../notion/notion-api-type";
import { Collider } from "../collider";

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

  const rolesWithoutCircle = roles.filter(
    (role) => !cercles.some((c) => c.roles.some((r) => r === role.id))
  );
  const BlobsRolesWithoutCircle = rolesWithoutCircle.map((role) => {
    return new BlobBall({
      x: 0,
      y: 0,
      r: roleRadius,
      name: role.name + role.icon.emoji,
      color: darkPurple,
      scenePriority: 1,
      children: [],
    });
  });
  let cercleRoleBlobs: BlobBall[] = [];
  const cerclesBlobs = cercles.map((c) => {
    const cercleRoles = c.roles
      .map((id) => roles.find((f) => f.id === id))
      .filter((f) => typeof f !== "undefined") as Role[];
    const children = cercleRoles.map((r) => {
      return new BlobBall({
        x: 0,
        y: 0,
        r: roleRadius,
        name: r.name + r.icon.emoji,
        color: darkRed,
        scenePriority: 2,
        children: [],
      });
    });
    cercleRoleBlobs = [...cercleRoleBlobs, ...children];
    return new BlobBall({
      x: 0,
      y: 0,
      r: cercleRadius,
      name: c.name + c.icon.emoji,
      color: darkBlue,
      scenePriority: 1,
      children,
    });
  });

  const hellipseBlob = new BlobBall({
    x: 0,
    y: 0,
    r: hellipseRadius,
    name: "",
    color: navyBlue,
    scenePriority: 0,
    children: [...BlobsRolesWithoutCircle, ...cerclesBlobs],
  });
  scene.addMultipleItem([
    hellipseBlob,
    ...cerclesBlobs,
    ...BlobsRolesWithoutCircle,
    ...cercleRoleBlobs,
  ]);
  const hoverItems: BlobBall[] = [
    ...cerclesBlobs,
    ...BlobsRolesWithoutCircle,
    ...cercleRoleBlobs,
  ];
  const onClick = (ev: MouseEvent) => {
    const worldClick = scene.camera.screenToWorld({
      x: ev.x,
      y: ev.y,
    });
    scene.moveCamera({
      x: worldClick.x,
      y: worldClick.y,
    });
  };
  scene.canvas.addEventListener("click", onClick);

  function onMouseMove(ev: MouseEvent) {
    const calc = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
    hoverItems.forEach((item) => {
      item.hover = item.distanceTo(calc) < item.radius;
    });
  }
  const collider = new Collider<BlobBall>();
  BlobsRolesWithoutCircle.forEach((c) => {
    c.velocity.x = Math.random() - 0.5;
    c.velocity.y = Math.random() - 0.5;
  });
  cerclesBlobs.forEach((c) => {
    c.velocity.x = Math.random() - 0.5;
    c.velocity.y = Math.random() - 0.5;
  });
  cercleRoleBlobs.forEach((c) => {
    c.velocity.x = Math.random() - 0.5;
    c.velocity.y = Math.random() - 0.5;
  });
  const groupRoleAndCircle = collider.addGroup("all", [
    ...cerclesBlobs,
    ...BlobsRolesWithoutCircle,
  ]);
  const onCollide = () => {
    collider.getCollisions().forEach(({ a, b }) => {
      a.externeCollisionResponse(b);
    });
  };
  scene.addUpdateListener(onCollide);
  scene.canvas.addEventListener("mousemove", onMouseMove);
  return {
    destroy: () => {
      scene.removeUpdateListener(onCollide);
      scene.destroy();
      scene.canvas.removeEventListener("click", onClick);
      collider.removeGroup(groupRoleAndCircle);
    },
  };
}
