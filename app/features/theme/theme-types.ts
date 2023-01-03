import { Property } from "csstype";

export type ThemeName = "hellipse";

export interface PartialColorShades {
  g50: string;
  g300: string;
  g500: string;
  g700: string;
  g900: string;
}

export interface ColorShades extends PartialColorShades {
  g100: string;
  g200: string;
  g400: string;
  g600: string;
  g800: string;
}

export interface ThemeColors {
  neutral: ColorShades;
  primary: PartialColorShades;
  secondary: PartialColorShades;
  success: PartialColorShades;
  warning: PartialColorShades;
  error: PartialColorShades;
  shade: { white: string; black: string };
}

export type BreakPoints = [number, number, number, number];

export interface ThemeFont {
  family: Property.FontFamily;
  color: Property.Color;
  size: Property.FontSize;
  weight: Property.FontWeight;
  lineHeight: Property.LineHeight;
  letterSpacing: Property.LetterSpacing;
}

export interface ThemeBody {
  background: Property.Background;
  font: ThemeFont;
}

export interface ThemeCard {
  background: Property.Background;
  color: Property.Color;
  padding: Property.Padding;
  borderRadius: Property.BorderRadius;
  border: Property.Border;
  margin: Property.Margin;
  boxShadow: Property.BoxShadow;
}

export interface ThemeInput {
  color: Property.Color;
  background: Property.Background;
  border: Property.Border;
  padding: Property.Padding;
  borderRadius: Property.BorderRadius;
  margin: Property.Margin;
}

export interface ThemeTypo {
  p: ThemeFont;
  h1: ThemeFont;
  h2: ThemeFont;
  h3: ThemeFont;
  h4: ThemeFont;
  h5: ThemeFont;
  h6: ThemeFont;
  label: ThemeFont;
  caption: ThemeFont;
}

export interface Theme {
  colors: ThemeColors;
  card: ThemeCard;
  body: ThemeBody;
  input: ThemeInput;
  typo: ThemeTypo;
  /**
   * breakpoints are ordered by smallest devices to largest
   */
  breakPoints: BreakPoints;
}
