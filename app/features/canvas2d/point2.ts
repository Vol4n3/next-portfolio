import { NumberClamp, NumberRangeLoop } from "../../commons/utils/number.utils";

export type Point2 = [number, number];

export interface Position2 {
  position: Point2;
}

export function PointSetX([_, y]: Point2, x: number): Point2 {
  return [x, y];
}

export function PointSetY([x, _]: Point2, y: number): Point2 {
  return [x, y];
}

export function PointDistance(
  [p1x, p1y]: Point2,
  [p2x, p2y]: Point2 = [0, 0]
): number {
  const dx = p1x - p2x;
  const dy = p1y - p2y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function PointOpposite([x, y]: Point2): Point2 {
  return [-y, -x];
}

export function PointPerp([x, y]: Point2): Point2 {
  return [-y, x];
}

export function DotProduct([p1x, p1y]: Point2, [p2x, p2y]: Point2): number {
  return p1x * p2x + p1y * p2y;
}

export function PointAngleTo([p1x, p1y]: Point2, [p2x, p2y]: Point2): number {
  return Math.atan2(p2y - p1y, p2x - p1x);
}

export function PointAngleFrom([p1x, p1y]: Point2, [p2x, p2y]: Point2): number {
  return Math.atan2(p1y - p2y, p1x - p2x);
}

export function PointRotate(
  [originX, originY]: Point2,
  [rotateAnchorX, rotateAnchorY]: Point2,
  angle: number
): Point2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = originX - rotateAnchorX;
  const dy = originY - rotateAnchorY;
  return [
    dx * cos + dy * sin + rotateAnchorX,
    -dx * sin + dy * cos + rotateAnchorY,
  ];
}

export function PointClamp(
  [x, y]: Point2,
  [xMin, yMin]: Point2,
  [xMax, yMax]: Point2
): Point2 {
  return [NumberClamp(xMin, x, xMax), NumberClamp(yMin, y, yMax)];
}

export function PointBoundaryLoop(
  [x, y]: Point2,
  [xMin, yMin]: Point2,
  [xMax, yMax]: Point2
): Point2 {
  return [NumberRangeLoop(xMin, x, xMax), NumberRangeLoop(yMin, y, yMax)];
}

export function PointsSum(points: Point2[]): Point2 {
  return points.reduce(
    ([prevX, prevY], [currentX, currentY]) => [
      prevX + currentX,
      prevY + currentY,
    ],
    [0, 0]
  );
}

export type OperationName = "multiply" | "subtract" | "add" | "divide" | "pow";

export function Operation2d(
  type: OperationName,
  [aX, aY]: Point2,
  b: number | Point2
): Point2 {
  if (typeof b === "number") {
    switch (type) {
      case "add":
        return [aX + b, aY + b];
      case "divide":
        return [aX / b, aY / b];
      case "multiply":
        return [aX * b, aY * b];
      case "subtract":
        return [aX - b, aY - b];
      case "pow":
        return [Math.pow(aX, b), Math.pow(aY, b)];
    }
  }
  const [bX, bY] = b;
  switch (type) {
    case "add":
      return [aX + bX, aY + bY];
    case "divide":
      return [aX / bX, aY / bY];
    case "multiply":
      return [aX * bX, aY * bY];
    case "subtract":
      return [aX - bX, aY - bY];
    case "pow":
      return [Math.pow(aX, bX), Math.pow(aX, bY)];
  }
}

export function PointsAverage(points: Point2[]): Point2 {
  return Operation2d("divide", PointsSum(points), points.length);
}

export function PointDestination(
  [x, y]: Point2,
  angle: number,
  length: number
): Point2 {
  return [x + Math.cos(angle) * length, y + Math.sin(angle) * length];
}
