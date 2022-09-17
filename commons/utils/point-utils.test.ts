import { Operation2d } from "./point.utils";

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
  expect(Operation2d("divide", { x: 2, y: 2 }, { x: 2, y: 2 })).toEqual({
    x: 1,
    y: 1,
  });
});
