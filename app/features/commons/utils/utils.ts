import { undefined } from "zod";

export const ObjectFilterByKeys = <T>(
  data: Partial<T>,
  keys: (keyof T)[],
): Partial<T> => {
  const temp: Partial<T> = {};
  keys.forEach((key) => {
    if (typeof data[key] !== "undefined") {
      temp[key] = data[key];
    }
  });
  return temp;
};
export const ArrayToClassName = (arr: (string | boolean | undefined)[]) => {
  return arr.filter((f) => !!f).join(" ");
};
