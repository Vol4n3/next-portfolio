import { ColorShades, Theme, ThemeColors } from "./theme-types";

const danger: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const primary: ColorShades = { base: "#B2A4FF", dark: "#000", light: "#000" };
const secondary: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const success: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const warning: ColorShades = { base: "#000", dark: "#000", light: "#000" };
const colors: ThemeColors = {
  danger,
  dark: "#000",
  grey10: "#000",
  grey20: "#000",
  grey30: "#000",
  grey40: "#000",
  grey50: "#000",
  grey60: "#000",
  grey70: "#000",
  grey80: "#000",
  grey90: "#000",
  grey95: "#000",
  light: "#F7ECDE",
  primary,
  secondary,
  success,
  warning,
};
export const ThemeDark: Theme = { colors };
