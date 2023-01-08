import { Point2, PointDistance } from "./point2";

export type Circle2 = [Point2, number];

export function CircleDistanceToPoint(
  [pc, radius]: Circle2,
  point: Point2
): number {
  return PointDistance(pc, point) - radius;
}

export function CircleDistanceToCircle(
  [pc1, radius1]: Circle2,
  [pc2, radius2]: Circle2
): number {
  return PointDistance(pc1, pc2) - radius1 - radius2;
}
