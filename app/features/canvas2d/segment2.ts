import { Point2, PointAngleFrom, PointAngleTo, PointDistance } from "./point2";
import { Circle2 } from "./circle2";

export type Segment2 = [Point2, Point2];

export function SegmentWedge([[p1x, p1y], [p2x, p2y]]: Segment2): number {
  return p1x * p2y - p1y * p2x;
}

export function SegmentNormalized(segment: Segment2): Point2 {
  const len = SegmentLength(segment);
  if (len === 0) {
    return [0, 0];
  }
  const [x, y] = SegmentToVector(segment);
  return [x / len, y / len];
}

export function SegmentToVector([[p1x, p1y], [p2x, p2y]]: Segment2): Point2 {
  return [p2x - p1x, p2y - p1y];
}

export function SegmentAddLength(
  segment: Segment2,
  backward?: boolean
): Segment2 {
  const angle = backward
    ? SegmentBackwardAngle(segment)
    : SegmentForwardAngle(segment);
  const len = SegmentLength(segment);
  const dx = Math.cos(angle) * len;
  const dy = Math.sin(angle) * len;
  const [p1, p2] = segment;
  const [p1x, p1y] = p1;
  const [p2x, p2y] = p2;
  return [
    backward ? p1 : [p1x + dx, p1y + dy],
    backward ? [p2x + dx, p2y + dy] : p2,
  ];
}

export function SegmentCenter([[p1x, p1y], [p2x, p2y]]: Segment2): Point2 {
  return [(p1x + p2x) / 2, (p1y + p2y) / 2];
}

export function SegmentLength([p1, p2]: Segment2): number {
  return PointDistance(p1, p2);
}

export function SegmentForwardAngle([p1, p2]: Segment2): number {
  return PointAngleTo(p1, p2);
}

export function SegmentBackwardAngle([p1, p2]: Segment2): number {
  return PointAngleFrom(p1, p2);
}

export function SegmentGetPointCollisionToCircle(
  segment: Segment2,
  [pCircle, radius]: Circle2
): Point2 | null {
  const [p1, p2] = segment;
  const [p1x, p1y] = p1;
  const [p2x, p2y] = p2;
  const side1 = PointDistance(p1, pCircle);
  const side2 = PointDistance(p2, pCircle);
  if (radius > side1) {
    return [p1x, p1y];
  }
  if (radius > side2) {
    return [p2x, p2y];
  }
  const lerp = SegmentLerpByPoint(segment, pCircle);
  if (!segmentCollisionToPoint(segment, lerp)) return null;
  const distance = PointDistance(lerp, pCircle);

  return distance <= radius ? lerp : null;
}

export function SegmentLerpByPoint(
  [sp1, sp2]: Segment2,
  point: Point2
): Point2 {
  const len = PointDistance(sp1, sp2);
  const [sP1x, sP1y] = sp1;
  const [sP2x, sP2y] = sp2;
  const [px, py] = point;

  const dot =
    ((px - sP1x) * (sP2x - sP1x) + (py - sP1y) * (sP2y - sP1y)) / (len * len);

  return [sP1x + dot * (sP2x - sP1x), sP1y + dot * (sP2y - sP1y)];
}

export function segmentCollisionToPoint(
  [p1, p2]: Segment2,
  point: Point2
): boolean {
  const d1 = PointDistance(point, p1);
  const d2 = PointDistance(point, p2);
  const segmentLen = PointDistance(p1, p2);
  const lineWidth = 0.1;
  return d1 + d2 >= segmentLen - lineWidth && d1 + d2 <= segmentLen + lineWidth;
}

export function interpolation(
  [[p1x, p1y], [p2x, p2y]]: Segment2,
  t: number
): Point2 {
  return [t * p2x + (1 - t) * p1x, t * p2y + (1 - t) * p1y];
}

export function SegmentCollisionToSegment(
  segmentA: Segment2,
  segmentB: Segment2,
  projection?: boolean
): Point2 | null {
  const [sAP1, sAP2] = segmentA;
  const [sBP1, sBP2] = segmentB;
  const collisionPoint = SegmentCollisionToLine(segmentA, segmentB);
  if (collisionPoint === null) {
    return null;
  }
  if (projection) {
    return collisionPoint;
  }
  const [sAP1x, sAP1y] = sAP1;
  const [sAP2x, sAP2y] = sAP2;
  const [sBP1x, sBP1y] = sBP1;
  const [sBP2x, sBP2y] = sBP2;
  const [ipx, ipy] = collisionPoint;
  const rx0 = (ipx - sAP1x) / (sAP2x - sAP1x),
    ry0 = (ipy - sAP1y) / (sAP2y - sAP1y),
    rx1 = (ipx - sBP1x) / (sBP2x - sBP1x),
    ry1 = (ipy - sBP1y) / (sBP2y - sBP1y);
  if (
    ((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
    ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))
  ) {
    return collisionPoint;
  } else {
    return null;
  }
}

export function SegmentCollisionToLine(
  [[sP1x, sP1y], [sP2x, sP2y]]: Segment2,
  [[lP1x, lP1y], [lP2x, lP2y]]: Segment2
): Point2 | null {
  const A1 = sP2y - sP1y;
  const B1 = sP1x - sP2x;
  const C1 = A1 * sP1x + B1 * sP1y;
  const A2 = lP2y - lP1y;
  const B2 = lP1x - lP2x;
  const C2 = A2 * lP1x + B2 * lP1y;
  const denominator = A1 * B2 - A2 * B1;
  if (denominator === 0) {
    return null;
  }
  return [(B2 * C1 - B1 * C2) / denominator, (A1 * C2 - A2 * C1) / denominator];
}
