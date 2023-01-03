import { AngleFlip, CoordinateRatioToScreen } from "./number.utils";

test("should transform coordinate to screen pixel", function () {
  expect(CoordinateRatioToScreen(0, 0, 0, 0)).toEqual({ x: 0, y: 0 });
  expect(CoordinateRatioToScreen(0, 0, 1200, 600)).toEqual({ x: 0, y: 0 });
  expect(CoordinateRatioToScreen(1, 1, 1200, 600)).toEqual({ x: 1200, y: 600 });
  expect(CoordinateRatioToScreen(0.5, 0.5, 1200, 600)).toEqual({
    x: 600,
    y: 300,
  });
});
test("should rotate angle", () => {
  expect(AngleFlip(0)).toEqual(Math.PI * 2);
  expect(AngleFlip(-1)).toEqual(Math.PI * 2 - 1);
});
