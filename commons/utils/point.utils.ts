export interface IPoint2 {
  x: number;
  y: number;
}

export const PointDistance = (
  p1: IPoint2,
  p2: IPoint2 = { x: 0, y: 0 }
): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const DotProduct = (p1: IPoint2, p2: IPoint2): number => {
  return p1.x * p2.x + p1.y * p2.y;
};
export const AngleTo = (p1: IPoint2, p2: IPoint2): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};
export const PointRotate = (
  origin: IPoint2,
  rotateAnchor: IPoint2,
  angle: number
): IPoint2 => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = origin.x - rotateAnchor.x;
  const dy = origin.y - rotateAnchor.y;
  return {
    x: dx * cos + dy * sin + rotateAnchor.x,
    y: -dx * sin + dy * cos + rotateAnchor.y,
  };
};
export const PointsSum = (points: IPoint2[]): IPoint2 => {
  return points.reduce(
    (prev, current) => ({
      x: prev.x + current.x,
      y: prev.y + current.y,
    }),
    { x: 0, y: 0 }
  );
};
export type OperationName = "multiply" | "subtract" | "add" | "divide" | "pow";
export const Operation2d = (
  type: OperationName,
  a: IPoint2,
  b: number | IPoint2
): IPoint2 => {
  if (typeof b === "number") {
    switch (type) {
      case "add":
        return { x: a.x + b, y: a.y + b };
      case "divide":
        return { x: a.x / b, y: a.y / b };
      case "multiply":
        return { x: a.x * b, y: a.y * b };
      case "subtract":
        return { x: a.x - b, y: a.y - b };
      case "pow":
        return { x: Math.pow(a.x, b), y: Math.pow(a.y, b) };
    }
  }
  switch (type) {
    case "add":
      return { x: a.x + b.x, y: a.y + b.y };
    case "divide":
      return { x: a.x / b.x, y: a.y / b.y };
    case "multiply":
      return { x: a.x * b.x, y: a.y * b.y };
    case "subtract":
      return { x: a.x - b.x, y: a.y - b.y };
    case "pow":
      return { x: Math.pow(a.x, b.x), y: Math.pow(a.y, b.y) };
  }
};
export const PointsAverage = (points: IPoint2[]): IPoint2 => {
  return Operation2d("divide", PointsSum(points), points.length);
};
