import { undefined } from "zod";

export const objectFilterByKeys = <T>(
  data: Partial<T>,
  keys: (keyof T)[],
): Partial<T> => {
  const temp: Partial<T> = {};
  keys.forEach((key) => {
    if (data[key] !== undefined) {
      temp[key] = data[key];
    }
  });
  return temp;
};
export const arrayToJoin = (arr: (string | boolean | undefined)[]) => {
  return arr.filter((f) => !!f).join(" ");
};
