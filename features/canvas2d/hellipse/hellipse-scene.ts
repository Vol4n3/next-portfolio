import { Scene2d } from "../scene2d";
import { BlobBall } from "../objects/blob-ball";
import { darkBlue, darkPurple, navyBlue } from "../../theme/hellipse-colors";
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

  const hellipseRadius = 1200;
  const cercleRadius = 350;
  const roleRadius = 100;

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
        color: darkPurple,
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
  hellipseBlob.isStatic = true;
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

  BlobsRolesWithoutCircle.forEach((c) => {
    c.velocity.x = Math.random() * 6 - 3;
    c.velocity.y = Math.random() * 6 - 3;
  });
  cerclesBlobs.forEach((c) => {
    c.velocity.x = Math.random() * 6 - 3;
    c.velocity.y = Math.random() * 6 - 3;
  });
  cercleRoleBlobs.forEach((c) => {
    c.velocity.x = Math.random() * 6 - 3;
    c.velocity.y = Math.random() * 6 - 3;
  });

  const collider = new Collider<BlobBall>("all", [
    hellipseBlob,
    ...cerclesBlobs,
    ...BlobsRolesWithoutCircle,
  ]);
  const onCollide = (co: Collider<BlobBall>) => {
    co.getCollisions().forEach(({ a, b }) => {
      if (a.children.length || b.children.length) {
        if (a.isParent(b) || b.isParent(a)) {
          a.interneCollisionResponse(b);
          return;
        }
      }
      a.externeCollisionResponse(b);
    });
  };
  cerclesBlobs.forEach((blob) => {
    const colliderCircle = new Collider<BlobBall>("all", [
      blob,
      ...blob.children,
    ]);
    scene.addUpdateListener(onCollide.bind(null, colliderCircle));
  });

  scene.addUpdateListener(onCollide.bind(null, collider));
  scene.canvas.addEventListener("mousemove", onMouseMove);
  return {
    destroy: () => {
      scene.removeUpdateListener(onCollide.bind(null, collider));
      scene.destroy();
      scene.canvas.removeEventListener("click", onClick);
    },
  };
}
