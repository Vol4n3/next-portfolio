export type ThemeName = "light" | "dark";

export interface ColorShades {
  light: string;
  dark: string;
  base: string;
}

export interface ThemeColors {
  primary: ColorShades;
  secondary: ColorShades;
  danger: ColorShades;
  warning: ColorShades;
  success: ColorShades;
  dark: string;
  grey10: string;
  grey20: string;
  grey30: string;
  grey40: string;
  grey50: string;
  grey60: string;
  grey70: string;
  grey80: string;
  grey90: string;
  grey95: string;
  light: string;
}

export interface Theme {
  colors: ThemeColors;
}
