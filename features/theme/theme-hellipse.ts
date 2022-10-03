import {
  ColorShades,
  PartialColorShades,
  Theme,
  ThemeBody,
  ThemeCard,
  ThemeColors,
  ThemeInput,
} from "./theme-types";
import { navyBlue } from "./hellipse-colors";

const neutral: ColorShades = {
  "50": "#F8FAFC",
  "100": "#F1F5F9",
  "200": "#E2E8F0",
  "300": "#CBD5E1",
  "400": "#94A3B8",
  "600": "#64748B",
  "800": "#475569",
  "500": "#334155",
  "700": "#1E293B",
  "900": "#0F172A",
};
const primary: PartialColorShades = {
  "50": "#F2F5FF",
  "300": "#CCD8FF",
  "500": "#505AAB",
  "700": "#19317B",
  "900": "#000C4E",
};
const secondary: PartialColorShades = {
  "50": "#FBF7FF",
  "300": "#E8D2FF",
  "500": "#BCA7FF",
  "700": "#8778FF",
  "900": "#504CCB",
};
const success: PartialColorShades = {
  "50": "#EAFDFF",
  "300": "#C3FFFF",
  "500": "#8EF7FF",
  "700": "#56C4DF",
  "900": "#0093AD",
};
const warning: PartialColorShades = {
  "50": "#FFFFF0",
  "300": "#FFF4BD",
  "500": "#FFFF83",
  "700": "#FFD951",
  "900": "#C8A818",
};
const error: PartialColorShades = {
  "50": "#FFF3F1",
  "300": "#FFCDC6",
  "500": "#FF6E8D",
  "700": "#ED3560",
  "900": "#B40037",
};
const colors: ThemeColors = {
  error,
  neutral,
  primary,
  secondary,
  shade: { black: "#000000", white: "#FFFFFF" },
  success,
  warning,
};
const fontBody = {
  color: "black",
  family: '"Raleway", sans-serif',
  size: "16px",
  weight: "500",
  lineHeight: "24px",
  letterSpacing: "",
};
const body: ThemeBody = {
  background: navyBlue,
  font: fontBody,
};
const card: ThemeCard = {
  borderRadius: "",
  margin: "",
  color: "",
  background: "",
  border: "",
  padding: "",
  boxShadow: "",
};
const input: ThemeInput = {
  borderRadius: "",
  background: "",
  border: "",
  color: "",
  margin: "",
  padding: "",
};
export const ThemeHellipse: Theme = {
  body,
  card,
  input,
  colors,
  breakPoints: [576, 768, 992, 1280],
};
