import { PickChoiceByDevice } from "./flex-util";

test("PickChoiceByDevice", () => {
  expect(PickChoiceByDevice("xs", [])).toBeUndefined();
  expect(PickChoiceByDevice("xs", ["a"])).toEqual("a");
  expect(PickChoiceByDevice("xs", ["a", "b"])).toEqual("a");
  expect(PickChoiceByDevice("xs", ["a", "b", "c", "d", "e"])).toEqual("a");
  expect(PickChoiceByDevice("sm", [])).toBeUndefined();
  expect(PickChoiceByDevice("sm", ["a"])).toEqual("a");
  expect(PickChoiceByDevice("sm", ["a", "b"])).toEqual("b");
  expect(PickChoiceByDevice("sm", ["a", "b", "c", "d", "e"])).toEqual("b");
  expect(PickChoiceByDevice("md", [])).toBeUndefined();
  expect(PickChoiceByDevice("md", ["a"])).toEqual("a");
  expect(PickChoiceByDevice("md", ["a", "b"])).toEqual("b");
  expect(PickChoiceByDevice("md", ["a", "b", "c", "d", "e"])).toEqual("c");
  expect(PickChoiceByDevice("lg", [])).toBeUndefined();
  expect(PickChoiceByDevice("lg", ["a"])).toEqual("a");
  expect(PickChoiceByDevice("lg", ["a", "b"])).toEqual("b");
  expect(PickChoiceByDevice("lg", ["a", "b", "c", "d", "e"])).toEqual("d");
  expect(PickChoiceByDevice("xl", [])).toBeUndefined();
  expect(PickChoiceByDevice("xl", ["a"])).toEqual("a");
  expect(PickChoiceByDevice("xl", ["a", "b"])).toEqual("b");
  expect(PickChoiceByDevice("xl", ["a", "b", "c", "d", "e"])).toEqual("e");
  expect(PickChoiceByDevice("xl", ["a", "b", undefined, "d", "e"])).toEqual(
    "e"
  );
});
