import { ColorShades, Theme, ThemeColors } from "./theme-types";

const dark = "#070808";
const grey10 = "#0e1011";
const grey20 = "#252a2c";
const grey30 = "#3b4346";
const grey40 = "#525d61";
const grey50 = "#68767c";
const grey60 = "#808f94";
const grey70 = "#9ba6ab";
const grey80 = "#b5bec1";
const grey90 = "#d0d5d7";
const grey95 = "#ebedee";
const light = "#f8f9f9";
const orange = "#E17A47";
const red = "#EF3D59";
const yellow = "#EFC958";
const green = "#4aB19D";
const darkBlue = "#344E5C";

const danger: ColorShades = {
  contrast: "",
  base: red,
  dark: "#000",
  light: "#000",
};
const primary: ColorShades = {
  contrast: "",
  base: "#B2A4FF",
  dark: "#000",
  light: "#000",
};
const secondary: ColorShades = {
  contrast: "",
  base: "#000",
  dark: "#000",
  light: "#000",
};
const success: ColorShades = {
  contrast: "",
  base: green,
  dark: "#000",
  light: "#000",
};
const warning: ColorShades = {
  contrast: "",
  base: orange,
  dark: "#000",
  light: "#000",
};
const text: ColorShades = {
  contrast: grey90,
  base: grey10,
  dark,
  light: grey20,
};
const background: ColorShades = {
  contrast: grey10,
  base: grey90,
  dark: grey80,
  light,
};
const colors: ThemeColors = {
  danger,
  dark,
  grey10,
  grey20,
  grey30,
  grey40,
  grey50,
  grey60,
  grey70,
  grey80,
  grey90,
  grey95,
  light,
  primary,
  secondary,
  success,
  warning,
  background,
  text,
};
export const ThemeDark: Theme = { colors };
