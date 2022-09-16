import { Item2Scene, Scene2d } from "../scene2d";
import { Perlin } from "../../../commons/utils/perlin-utils";
import { PI2 } from "../../../commons/utils/number.utils";
import { Vector2 } from "../vector2";
import { Circle2 } from "../circle2";
import { EasingCallback } from "../../../commons/utils/easing.utils";
import { Segment2 } from "../segment2";
import { lighten } from "polished";
import { CanCollide } from "../collider";

interface BlobBallParams {
  x: number;
  y: number;
  r: number;
  name: string;
  color: string;
  scenePriority: number;
  children: BlobBall[];
}

export class BlobBall extends Circle2 implements Item2Scene, CanCollide {
  isUpdated: boolean = false;
  scenePriority: number;
  definition: number = 20;
  perlinDepth: number = this.radius / 20;
  perlinStrength: number = 1;
  perlinRotation: number = 0;
  perlinMovement: Segment2 = new Segment2();
  easing: EasingCallback | null = null;
  hover: boolean = false;
  public name: string;
  public color: string;
  public mass = 1;
  public velocity: Vector2 = new Vector2(0, 0);
  private perlin = new Perlin();
  private children: BlobBall[];

  constructor({
    x,
    y,
    r,
    name,
    color,
    scenePriority,
    children,
  }: BlobBallParams) {
    super(x, y, r);
    this.color = color;
    this.name = name;
    this.scenePriority = scenePriority;
    this.children = children;
  }

  destroy(): void {}

  bounce = () => {};

  onResize(canvasWidth: number, canvasHeight: number): void {}

  draw2d(scene: Scene2d, time: number): void {
    const { ctx } = scene;
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
    ctx.fillStyle = this.hover ? lighten(0.1, this.color) : this.color;
    ctx.fill();
    scene.writeText({
      text: this.name,
      x: 0,
      textAlign: "center",
      fillStyle: "white",
      textBaseline: "middle",
      y: 0,
      font: { size: this.radius / 8, type: "Raleway" },
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
    if (item.isParent(this)) {
      return this.distanceToCircle(item) > 0;
    }
    return this.distanceToCircle(item) < 0;
  }
  interneCollisionResponse(other: BlobBall): void {}
  externeCollisionResponse(other: BlobBall): void {
    const intersect = new Vector2(other.x - this.x, other.y - this.y);
    const distance = intersect.length;
    if (distance === 0) {
      return;
    }
    // separate the two circles after intersection (static response)
    const overlap = 0.5 * (distance - this.radius - other.radius);
    this.x -= (overlap * (this.x - other.x)) / distance;
    this.y -= (overlap * (this.y - other.y)) / distance;
  }
}
