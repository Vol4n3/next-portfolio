import {
  CoordinateRatioToScreen,
  numberClamp,
  numberRangeLoop,
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
  expect(numberClamp(5, 25, 100)).toEqual(25);
  expect(numberClamp(5, -10, 100)).toEqual(5);
  expect(numberClamp(-2, -15, 100)).toEqual(-2);
  expect(numberClamp(-2, 1000, 100)).toEqual(100);
  expect(numberClamp(-60, 1000, -1)).toEqual(-1);
  expect(numberClamp(-60, -1000, -1)).toEqual(-60);
});

test("should range number", () => {
  expect(numberRangeLoop(1.5, 3.2, 3.1)).toEqual(1.6);
  expect(numberRangeLoop(5, 4, 99)).toEqual(98);
  expect(numberRangeLoop(5, -10, 100)).toEqual(85);
  expect(numberRangeLoop(0, -10, 100)).toEqual(90);
  expect(numberRangeLoop(-5, -10, 100)).toEqual(95);
  expect(numberRangeLoop(-100, -101, -20)).toEqual(-19);
  expect(numberRangeLoop(0, 101, 100)).toEqual(1);
  expect(numberRangeLoop(20, 101, 100)).toEqual(21);
  expect(numberRangeLoop(-200, -99, -100)).toEqual(-201);
  expect(numberRangeLoop(10, 71, 70)).toEqual(11);
});
