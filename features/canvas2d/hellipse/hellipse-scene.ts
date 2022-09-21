import { Scene2d } from "../scene2d";
import { BlobBall } from "../objects/blob-ball";
import { darkPurple, navyBlue } from "../../theme/hellipse-colors";
import { Cercle, Hellipsien, Role } from "../../notion/notion-api-type";
import { Collider } from "../collider";
import { IPoint2, Operation2d } from "../../../commons/utils/point.utils";
import { Vector2 } from "../vector2";
import { PickRandomOne } from "../../../commons/utils/array-utils";

export interface HellipseSceneAction {
  destroy: () => void;
}

function randomRoleColor() {
  return PickRandomOne(["#FFCDC6", "#FFF4BD", "#C3FFFF", "#E8D2FF", "#CCD8FF"]);
}

export function HellipseSceneInit(
  container: HTMLDivElement,
  roles: Role[],
  cercles: Cercle[],
  hellipsien: Hellipsien[]
): HellipseSceneAction {
  const scene = new Scene2d(container);

  const hellipseRadius = 1000;
  const cercleRadius = 300;
  const roleRadius = 75;

  const rolesWithoutCircle = roles.filter(
    (role) => !cercles.some((c) => c.roles.some((r) => r === role.id))
  );
  const BlobsRolesWithoutCircle = rolesWithoutCircle.map((role) => {
    return new BlobBall({
      x: 0,
      y: 0,
      r: roleRadius,
      name: role.name,
      emoji: role.icon.emoji,
      fillColor: randomRoleColor(),
      textColor: navyBlue,
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
        name: r.name,
        emoji: r.icon.emoji,
        fillColor: randomRoleColor(),
        textColor: navyBlue,
        scenePriority: 2,
        children: [],
      });
    });
    cercleRoleBlobs = [...cercleRoleBlobs, ...children];
    return new BlobBall({
      x: 0,
      y: 0,
      r: cercleRadius,
      name: c.name,
      emoji: c.icon.emoji,
      fillColor: darkPurple,
      scenePriority: 1,
      children,
    });
  });

  const hellipseBlob = new BlobBall({
    x: 0,
    y: 0,
    r: hellipseRadius,
    name: "",
    strokeColor: "#F2F5FF",
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

  BlobsRolesWithoutCircle.forEach((c) => {
    c.velocity.x = Math.random() * 4 - 2;
    c.velocity.y = Math.random() * 4 - 2;
  });
  cerclesBlobs.forEach((c) => {
    c.velocity.x = Math.random() * 4 - 2;
    c.velocity.y = Math.random() * 4 - 2;
  });
  cercleRoleBlobs.forEach((c) => {
    c.velocity.x = Math.random() * 4 - 2;
    c.velocity.y = Math.random() * 4 - 2;
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
  let dragStart: { click: IPoint2; camera: IPoint2 } | null = null;

  const onMouseMove = (ev: MouseEvent) => {
    const mousePoint = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
    hoverItems.forEach((item) => {
      item.hover = item.distanceTo(mousePoint) < item.radius;
    });
    if (dragStart) {
      const vecMouse = new Vector2(
        Operation2d("subtract", mousePoint, dragStart.click)
      )
        .perp()
        .perp();

      scene.camera.lookAt(Operation2d("add", dragStart.camera, vecMouse));
    }
  };

  const onMouseHold = (ev: MouseEvent) => {
    dragStart = {
      click: scene.camera.screenToWorld({ x: ev.x, y: ev.y }),
      camera: scene.camera.lookAtVector,
    };
  };
  const onMouseRelease = () => {
    dragStart = null;
  };
  const onWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    const mousePoint = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
    const move = Operation2d(
      "divide",
      Operation2d("add", mousePoint, scene.camera.lookAtVector),
      2
    );
    let distance = scene.camera.distance;
    if (ev.deltaY > 0) {
      distance += distance / 3;
    }
    if (ev.deltaY < 0) {
      distance -= distance / 3;
    }
    scene.camera.zoomTo(distance);
    scene.camera.lookAt({ ...move });
  };
  const onTouchHold = (ev: TouchEvent) => {
    ev.preventDefault();
    console.log(ev);
  };

  scene.canvas.addEventListener("touchstart", onTouchHold);
  scene.canvas.addEventListener("mousemove", onMouseMove, { passive: true });
  scene.canvas.addEventListener("wheel", onWheel);
  scene.canvas.addEventListener("mousedown", onMouseHold);
  scene.canvas.addEventListener("mouseup", onMouseRelease);
  scene.canvas.addEventListener("mouseleave", onMouseRelease);
  return {
    destroy: () => {
      scene.canvas.removeEventListener("mousedown", onMouseHold);
      scene.canvas.removeEventListener("mouseup", onMouseRelease);
      scene.canvas.removeEventListener("mouseleave", onMouseRelease);
      scene.canvas.removeEventListener("mousemove", onMouseMove);
      scene.canvas.removeEventListener("wheel", onWheel);
      scene.destroy();
    },
  };
}
