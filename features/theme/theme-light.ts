import { ColorShades, Theme, ThemeColors } from "./theme-types";

const danger: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const primary: ColorShades = { base: "#B2A4FF", dark: "#000", light: "#000" };
const secondary: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const success: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const warning: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const colors: ThemeColors = {
  danger,
  dark: "#070808",
  grey10: "#0e1011",
  grey20: "#252a2c",
  grey30: "#3b4346",
  grey40: "#525d61",
  grey50: "#68767c",
  grey60: "#808f94",
  grey70: "#9ba6ab",
  grey80: "#b5bec1",
  grey90: "#d0d5d7",
  grey95: "#ebedee",
  light: "#f8f9f9",
  primary,
  secondary,
  success,
  warning,
};
export const ThemeLight: Theme = { colors };
