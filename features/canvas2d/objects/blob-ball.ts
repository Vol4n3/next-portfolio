import { Item2Scene, Scene2d } from "../scene2d";
import { Perlin } from "../../../commons/utils/perlin-utils";
import { PI2 } from "../../../commons/utils/number.utils";
import { Vector2 } from "../vector2";
import { Circle2 } from "../circle2";
import { EasingCallback } from "../../../commons/utils/easing.utils";
import { Segment2 } from "../segment2";
import { lighten } from "polished";
import { CanCollide } from "../collider";
import { DotProduct, Operation2d } from "../../../commons/utils/point.utils";
import { Role } from "../../notion/notion-api-type";

interface BlobBallParams {
  x: number;
  y: number;
  r: number;
  name: string;
  fillColor?: string;
  strokeColor?: string;
  textColor?: string;
  emoji?: string;
  scenePriority: number;
  children: BlobBall[];
  role?: Role;
}

export class BlobBall extends Circle2 implements Item2Scene, CanCollide {
  isUpdated: boolean = false;
  scenePriority: number;
  definition: number = 10;
  perlinDepth: number = this.radius / 20;
  perlinStrength: number = 1;
  perlinRotation: number = 0;
  perlinMovement: Segment2 = new Segment2();
  easing: EasingCallback | null = null;
  isHover: boolean = false;
  role?: Role;
  name: string;
  fillColor: string | undefined;
  mass = 1;
  isStatic: boolean = false;
  velocity: Vector2 = new Vector2(0, 0);
  children: BlobBall[];
  private perlin = new Perlin();
  private strokeColor: string | undefined;
  private textColor: string | undefined;
  private emoji: string | undefined;

  constructor({
    x,
    y,
    r,
    name,
    fillColor,
    strokeColor,
    scenePriority,
    children,
    textColor,
    emoji,
    role,
  }: BlobBallParams) {
    super(x, y, r);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.textColor = textColor;
    this.name = name;
    this.scenePriority = scenePriority;
    this.children = children;
    this.emoji = emoji;
    this.role = role;
  }

  destroy(): void {}

  bounce = () => {};

  onResize(canvasWidth: number, canvasHeight: number): void {}

  draw2d(scene: Scene2d, time: number): void {
    const { ctx, camera } = scene;
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    for (let i = 0; i < PI2 * this.definition; i++) {
      const circlePerlin = Vector2.createFromAngle(
        this.perlinRotation + i / this.definition,
        this.perlinStrength
      );
      const bruit = this.perlin.noise(
        circlePerlin.x + this.perlinMovement.p2.x,
        circlePerlin.y + this.perlinMovement.p2.y
      );
      const vec = Vector2.createFromAngle(
        i / this.definition,
        this.radius + bruit * this.perlinDepth
      );
      if (i === 0) {
        ctx.moveTo(vec.x, vec.y);
      } else {
        ctx.lineTo(vec.x, vec.y);
      }
    }

    ctx.closePath();
    if (this.fillColor) {
      var grd = ctx.createRadialGradient(
        0,
        0,
        this.radius / 4,
        0,
        0,
        this.radius
      );
      grd.addColorStop(
        0,
        this.isHover
          ? lighten(0.1, this.fillColor)
          : lighten(0.05, this.fillColor)
      );
      grd.addColorStop(1, this.fillColor);
      ctx.fillStyle = grd;
      ctx.fill();
    }
    if (this.strokeColor) {
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.strokeStyle = this.strokeColor;
      ctx.stroke();
    }

    scene.writeText({
      maxWidth: this.radius,
      lineHeight: 14,
      text:
        camera.distance > 2000
          ? this.emoji || ""
          : this.name + (this.emoji || ""),
      x: 0,
      textAlign: "center",
      fillStyle: this.textColor ?? "white",
      textBaseline: "middle",
      y: 0,
      font: {
        size: camera.distance > 2000 ? 50 : 12,
        type: "Raleway",
      },
    });
  }

  update(scene: Scene2d, time: number): void {
    this.isUpdated = true;
    this.perlinMovement.operation("add", { x: 0.005, y: -0.005 });
    this.perlinMovement.p2.rotateFrom(
      this.perlinMovement.p1,
      (this.perlinRotation -= 0.001)
    );
    if (this.easing) {
      this.easing(
        (val) => (this.radius = val),
        () => (this.easing = null)
      );
    }
    if (Math.abs(this.velocity.x) < 0.01) {
      this.velocity.x = 0;
    }
    if (Math.abs(this.velocity.y) < 0.01) {
      this.velocity.y = 0;
    }
    this.operation("add", this.velocity);
    this.children.forEach((c) => {
      c.operation("add", this.velocity);
    });
  }

  isParent(ball: BlobBall): boolean {
    return this.children.some((c) => c === ball);
  }

  isCollide(item: BlobBall): boolean {
    if (item.children.length || this.children.length) {
      if (item.isParent(this) || this.isParent(item)) {
        return this.distanceTo(item) > Math.abs(this.radius - item.radius);
      }
    }
    return this.distanceToCircle(item) < 0;
  }

  reflectBallVector(ball: BlobBall) {
    if (this.distanceTo(ball) === 0) {
      return;
    }
    const v = ball.velocity;
    const n = new Vector2(Operation2d("subtract", ball, this)).normalized();
    const u = Operation2d("multiply", n, DotProduct(v, n));
    const w = Operation2d("subtract", v, u);
    const v_after = Operation2d("subtract", w, u);
    const reflection = Operation2d("subtract", v_after, v);
    ball.velocity = new Vector2(Operation2d("add", v, reflection));
  }

  interneContactPoint(ball: BlobBall) {
    if (this.distanceTo(ball) === 0) {
      return;
    }
    const B = Operation2d("subtract", this, ball.velocity);
    const AB = Operation2d("subtract", B, this);
    const BC = Operation2d("subtract", ball, B);
    const AB_len = new Vector2(AB).length;
    const BC_len = new Vector2(BC).length;
    if (BC_len === 0) {
      return;
    }
    const b = (DotProduct(AB, BC) / Math.pow(BC_len, 2)) * -1;
    const c =
      (Math.pow(AB_len, 2) - Math.pow(this.radius - ball.radius, 2)) /
      Math.pow(BC_len, 2);
    const d = b * b - c;
    let k = b - Math.sqrt(d);

    if (k < 0) {
      k = b + Math.sqrt(d);
    }
    const BD = new Vector2(Operation2d("subtract", ball, B));
    const BD_len = BC_len * k;
    BD.length = BD_len;

    const interPoint = Operation2d("add", B, BD);
    ball.x = interPoint.x;
    ball.y = interPoint.y;
  }

  interneCollisionResponse(other: BlobBall): void {
    if (this.isParent(other)) {
      this.interneContactPoint(other);
      this.reflectBallVector(other);
    } else {
      other.interneContactPoint(this);
      other.reflectBallVector(this);
    }
  }

  externeCollisionResponse(other: BlobBall): void {
    const intersect = new Vector2(other.x - this.x, other.y - this.y);
    const distance = intersect.length;
    if (distance === 0) {
      return;
    }
    const normalized = intersect.normalized();
    // separate the two circles after intersection (static response)
    const overlap = 0.5 * (distance - this.radius - other.radius);
    if (!this.isStatic) {
      this.x -= (overlap * (this.x - other.x)) / distance;
      this.y -= (overlap * (this.y - other.y)) / distance;
    } else {
      if (!other.isStatic) {
        other.x += (overlap * (this.x - other.x)) / distance;
        other.y += (overlap * (this.y - other.y)) / distance;
      }
    }
    const tanVec = normalized.perp();

    const dpTan1 = this.velocity.b.dotProduct(tanVec);
    const dpTan2 = other.velocity.b.dotProduct(tanVec);

    const dpNorm1 = this.velocity.b.dotProduct(normalized);
    const dpNorm2 = other.velocity.b.dotProduct(normalized);

    const m1 =
      (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) /
      (this.mass + other.mass);
    const m2 =
      (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) /
      (this.mass + other.mass);
    if (!this.isStatic) {
      this.velocity.x = (tanVec.x * dpTan1 + normalized.x * m1) * 0.99;
      this.velocity.y = (tanVec.y * dpTan1 + normalized.y * m1) * 0.99;
    }
    if (!other.isStatic) {
      other.velocity.x = (tanVec.x * dpTan2 + normalized.x * m2) * 0.99;
      other.velocity.y = (tanVec.y * dpTan2 + normalized.y * m2) * 0.99;
    }
  }
}
