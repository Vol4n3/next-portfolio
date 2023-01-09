import {
  CoordinateRatioToScreen,
  NumberClamp,
  NumberRangeLoop,
} from "./number.utils";

test("should transform coordinate to screen pixel", function () {
  expect(CoordinateRatioToScreen(0, 0, 0, 0)).toEqual({ x: 0, y: 0 });
  expect(CoordinateRatioToScreen(0, 0, 1200, 600)).toEqual({ x: 0, y: 0 });
  expect(CoordinateRatioToScreen(1, 1, 1200, 600)).toEqual({ x: 1200, y: 600 });
  expect(CoordinateRatioToScreen(0.5, 0.5, 1200, 600)).toEqual({
    x: 600,
    y: 300,
  });
});

test("should clamp number", () => {
  expect(NumberClamp(5, 25, 100)).toEqual(25);
  expect(NumberClamp(5, -10, 100)).toEqual(5);
  expect(NumberClamp(-2, -15, 100)).toEqual(-2);
  expect(NumberClamp(-2, 1000, 100)).toEqual(100);
  expect(NumberClamp(-60, 1000, -1)).toEqual(-1);
  expect(NumberClamp(-60, -1000, -1)).toEqual(-60);
});

test("should range number", () => {
  expect(NumberRangeLoop(1.5, 3.2, 3.1)).toEqual(1.6);
  expect(NumberRangeLoop(5, 4, 99)).toEqual(98);
  expect(NumberRangeLoop(5, -10, 100)).toEqual(85);
  expect(NumberRangeLoop(0, -10, 100)).toEqual(90);
  expect(NumberRangeLoop(-5, -10, 100)).toEqual(95);
  expect(NumberRangeLoop(-100, -101, -20)).toEqual(-19);
  expect(NumberRangeLoop(0, 101, 100)).toEqual(1);
  expect(NumberRangeLoop(20, 101, 100)).toEqual(21);
  expect(NumberRangeLoop(-200, -99, -100)).toEqual(-201);
  expect(NumberRangeLoop(10, 71, 70)).toEqual(11);
});
