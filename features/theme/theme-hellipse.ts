import {
  ColorShades,
  PartialColorShades,
  Theme,
  ThemeBody,
  ThemeCard,
  ThemeColors,
  ThemeFont,
  ThemeInput,
  ThemeTypo,
} from "./theme-types";
import { navyBlue } from "./hellipse-colors";

const neutral: ColorShades = {
  g50: "#F8FAFC",
  g100: "#F1F5F9",
  g200: "#E2E8F0",
  g300: "#CBD5E1",
  g400: "#94A3B8",
  g600: "#64748B",
  g800: "#475569",
  g500: "#334155",
  g700: "#1E293B",
  g900: "#0F172A",
};
const primary: PartialColorShades = {
  g50: "#F2F5FF",
  g300: "#CCD8FF",
  g500: "#505AAB",
  g700: "#19317B",
  g900: "#000C4E",
};
const secondary: PartialColorShades = {
  g50: "#FBF7FF",
  g300: "#E8D2FF",
  g500: "#BCA7FF",
  g700: "#8778FF",
  g900: "#504CCB",
};
const success: PartialColorShades = {
  g50: "#EAFDFF",
  g300: "#C3FFFF",
  g500: "#8EF7FF",
  g700: "#56C4DF",
  g900: "#0093AD",
};
const warning: PartialColorShades = {
  g50: "#FFFFF0",
  g300: "#FFF4BD",
  g500: "#FFFF83",
  g700: "#FFD951",
  g900: "#C8A818",
};
const error: PartialColorShades = {
  g50: "#FFF3F1",
  g300: "#FFCDC6",
  g500: "#FF6E8D",
  g700: "#ED3560",
  g900: "#B40037",
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
const fontBody: ThemeFont = {
  color: "inherit",
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
  borderRadius: "5px",
  margin: "min(5px,max(3vw,20px))",
  color: colors.shade.black,
  background: colors.shade.white,
  border: "none",
  padding: "min(5px,max(3vw,20px))",
  boxShadow: "0 0 5px rgba(0,0,0,0.2)",
};
const input: ThemeInput = {
  borderRadius: "",
  background: "",
  border: "",
  color: "",
  margin: "",
  padding: "",
};
const caption: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const h1: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const h2: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const h3: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const h4: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const h5: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const h6: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const label: ThemeFont = {
  color: "",
  family: "",
  letterSpacing: "",
  lineHeight: "",
  size: "",
  weight: "",
};
const typo: ThemeTypo = {
  caption,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  label,
  p: fontBody,
};
export const ThemeHellipse: Theme = {
  body,
  card,
  input,
  colors,
  typo,
  breakPoints: [576, 768, 992, 1280],
};
