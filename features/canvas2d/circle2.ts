import { IPoint2 } from "../../commons/utils/point.utils";
import { Point2 } from "./point2";

export class Circle2 extends Point2 implements IPoint2 {
  constructor(x: number, y: number, public radius: number) {
    super(x, y);
  }

  distanceToCircle(c: Circle2): number {
    return this.distanceTo(c) - this.radius - c.radius;
  }
}
