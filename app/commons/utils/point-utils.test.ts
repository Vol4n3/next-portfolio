import { Operation2d, PointDistance } from "./point.utils";

test("test operation 2d add", () => {
  expect(Operation2d("add", { x: 0, y: 0 }, 1)).toEqual({ x: 1, y: 1 });
  expect(Operation2d("add", { x: 0, y: 0 }, { x: 1, y: 1 })).toEqual({
    x: 1,
    y: 1,
  });
});
test("test operation 2d subtract", () => {
  expect(Operation2d("subtract", { x: 0, y: 0 }, 1)).toEqual({ x: -1, y: -1 });
  expect(Operation2d("subtract", { x: 0, y: 0 }, { x: 1, y: 1 })).toEqual({
    x: -1,
    y: -1,
  });
});
test("test operation 2d multiply", () => {
  expect(Operation2d("multiply", { x: 2, y: 2 }, 2)).toEqual({ x: 4, y: 4 });
  expect(Operation2d("multiply", { x: 2, y: 2 }, { x: 2, y: 2 })).toEqual({
    x: 4,
    y: 4,
  });
});
test("test operation 2d divide", () => {
  expect(Operation2d("divide", { x: 2, y: 2 }, 2)).toEqual({ x: 1, y: 1 });
  expect(Operation2d("divide", { x: 4, y: 4 }, { x: 2, y: 2 })).toEqual({
    x: 2,
    y: 2,
  });
});
test("test operation 2d pow", () => {
  expect(Operation2d("pow", { x: 4, y: 4 }, 2)).toEqual({ x: 16, y: 16 });
  expect(Operation2d("pow", { x: 8, y: 8 }, { x: 2, y: 1 })).toEqual({
    x: 64,
    y: 8,
  });
});
test("Test PointDistance", () => {
  expect(PointDistance({ x: 3, y: 4 })).toEqual(5);
  expect(PointDistance({ x: 1, y: 2 }, { x: 7, y: 10 })).toEqual(10);
});
