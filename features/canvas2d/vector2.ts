import { Point2 } from "./point2";
import { Segment2 } from "./segment2";
import { IPoint2 } from "../../commons/utils/point.utils";

export class Vector2<T extends IPoint2 | number = number> implements IPoint2 {
  public b: Point2 = new Point2();
  private a: Point2 = new Point2();

  constructor(p: T, y?: T extends number ? number : undefined) {
    if (typeof p === "number") {
      if (typeof y === "number") {
        this.x = p;
        this.y = y;
      } else {
        this.x = p;
        this.y = p;
      }
    } else {
      this.x = p.x;
      this.y = p.y;
    }
  }

  get angle(): number {
    return this.a.angleTo(this.b);
  }

  set angle(angle) {
    const length = this.length;
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  }

  get length(): number {
    return this.a.distanceTo(this.b);
  }

  set length(len: number) {
    const angle = this.angle;
    this.x = Math.cos(angle) * len;
    this.y = Math.sin(angle) * len;
  }

  get x(): number {
    return this.b.x;
  }

  set x(n: number) {
    this.b.x = n;
  }

  get y(): number {
    return this.b.y;
  }

  set y(n: number) {
    this.b.y = n;
  }

  static createFromAngle(angle: number, length: number): Vector2 {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  createFromDiff(p: IPoint2) {
    return new Vector2(this.x - p.x, this.y - p.y);
  }

  normalized(): Vector2 {
    const len = this.length;
    if (len === 0) {
      return new Vector2(this.x, this.y);
    }
    return new Vector2(this.x / len, this.y / len);
  }

  wedge(v: IPoint2): number {
    return this.x * v.y - this.y * v.x;
  }

  opposite(): Vector2 {
    return new Vector2(-this.y, -this.x);
  }

  perp(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  toSegment(origin: IPoint2): Segment2 {
    return new Segment2(origin, {
      x: origin.x + this.b.x,
      y: origin.y + this.b.y,
    });
  }

  withLength(size: number): Vector2 {
    const angle = this.angle;
    return new Vector2(Math.cos(angle) * size, Math.sin(angle) * size);
  }
}
