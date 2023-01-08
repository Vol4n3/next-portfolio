import { PointDistance } from "./point2";

test("should calculate points distance", function () {
  expect(PointDistance([0, 0], [3, 4])).toEqual(5);
});
