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
  scene: Scene2d;
  onClickRole: (cb: (role: Role | null) => void) => void;
  onClickCercle: (cb: (role: Cercle | null) => void) => void;
}

function randomRoleColor() {
  return PickRandomOne(["#FFCDC6", "#FFF4BD", "#C3FFFF", "#E8D2FF", "#CCD8FF"]);
}

const hellipseRadius = 1000;
const cercleRadius = 300;
const roleRadius = 75;

export function HellipseSceneInit(
  container: HTMLDivElement,
  roles: Role[],
  cercles: Cercle[],
  hellipsien: Hellipsien[]
): HellipseSceneAction {
  const scene = new Scene2d(container);

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
      role: role,
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
        role: r,
      });
    });
    cercleRoleBlobs = [...cercleRoleBlobs, ...children];
    return new BlobBall({
      x: 0,
      y: 0,
      r: cercleRadius,
      cercle: c,
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
    fillColor: navyBlue,
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

  const collider = new Collider<BlobBall>("all", [
    hellipseBlob,
    ...cerclesBlobs,
    ...BlobsRolesWithoutCircle,
  ]);
  const onCollide = (co: Collider<BlobBall>) => {
    co.getCollisions().forEach(({ a, b }) => {
      if (a.params.children.length || b.params.children.length) {
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
      ...blob.params.children,
    ]);
    scene.addUpdateListener(onCollide.bind(null, colliderCircle));
  });
  scene.addUpdateListener(onCollide.bind(null, collider));
  let dragStart: { click: IPoint2; camera: IPoint2 } | null = null;

  const moveCameraByMouse = (x: number, y: number) => {
    const mousePoint = scene.camera.screenToWorld({ x, y });
    hoverItems.forEach((item) => {
      item.isHover = item.distanceTo(mousePoint) < item.radius;
    });
    scene.canvas.style.cursor = hoverItems.some((item) => item.isHover)
      ? "pointer"
      : "normal";
    if (dragStart) {
      const vecMouse = new Vector2(
        Operation2d("subtract", mousePoint, dragStart.click)
      )
        .perp()
        .perp();
      scene.camera.lookAt(Operation2d("add", dragStart.camera, vecMouse));
    }
  };
  const onMouseMove = (ev: MouseEvent) => {
    moveCameraByMouse(ev.x, ev.y);
  };
  const setDragStart = (p: IPoint2) => {
    dragStart = {
      click: scene.camera.screenToWorld(p),
      camera: scene.camera.position,
    };
  };
  let onClickRoleCb: (role: Role | null) => void = () => {};
  let onClickCercleCb: (role: Cercle | null) => void = () => {};
  const onClick = () => {
    onClickRoleCb(null);
    onClickCercleCb(null);
    hoverItems.forEach((blob) => {
      if (blob.isHover) {
        if (blob.params.role) onClickRoleCb(blob.params.role);
        if (blob.params.cercle) onClickCercleCb(blob.params.cercle);
      }
    });
  };
  const onMouseHold = (ev: MouseEvent) => {
    setDragStart({ x: ev.x, y: ev.y });
  };
  const onMouseRelease = () => {
    dragStart = null;
  };

  const onWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    const mousePoint = scene.camera.screenToWorld({ x: ev.x, y: ev.y });
    let move = Operation2d(
      "divide",
      Operation2d("add", mousePoint, scene.camera.position),
      2
    );
    let distance = scene.camera.distance;
    if (ev.deltaY > 0) {
      distance += distance / 6;
      const vec = new Vector2(
        Operation2d("subtract", scene.camera.position, mousePoint)
      )
        .perp()
        .perp();
      move = Operation2d(
        "add",
        scene.camera.position,
        Operation2d("divide", vec, 5)
      );
    }
    if (ev.deltaY < 0) {
      distance -= distance / 6;
    }
    scene.camera.distance = distance;
    //scene.camera.lookAt(move);
  };
  const onTouchHold = (ev: TouchEvent) => {
    if (ev.touches.length === 1) {
      ev.preventDefault();
      setDragStart({ x: ev.touches[0].clientX, y: ev.touches[0].clientY });
    }
  };

  scene.canvas.addEventListener("touchstart", onTouchHold);
  scene.canvas.addEventListener("mousemove", onMouseMove, { passive: true });
  scene.canvas.addEventListener("mousedown", onMouseHold);
  scene.canvas.addEventListener("mouseup", onMouseRelease);

  scene.canvas.addEventListener("click", onClick);
  scene.canvas.addEventListener("mouseleave", onMouseRelease);
  scene.canvas.addEventListener("wheel", onWheel);
  return {
    scene,
    onClickRole: (cb) => {
      onClickRoleCb = cb;
    },
    onClickCercle: (cb) => {
      onClickCercleCb = cb;
    },
    destroy: () => {
      scene.canvas.removeEventListener("touchstart", onTouchHold);
      scene.canvas.removeEventListener("mousemove", onMouseMove);
      scene.canvas.removeEventListener("mousedown", onMouseHold);
      scene.canvas.removeEventListener("mouseup", onMouseRelease);
      scene.canvas.removeEventListener("mouseleave", onMouseRelease);
      scene.canvas.removeEventListener("wheel", onWheel);
      scene.destroy();
    },
  };
}
