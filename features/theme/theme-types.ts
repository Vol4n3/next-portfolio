import { Property } from "csstype";

export type ThemeName = "hellipse";

export interface PartialColorShades {
  50: string;
  300: string;
  500: string;
  700: string;
  900: string;
}

export interface ColorShades extends PartialColorShades {
  100: string;
  200: string;
  400: string;
  600: string;
  800: string;
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

export interface Theme {
  colors: ThemeColors;
  card: ThemeCard;
  body: ThemeBody;
  input: ThemeInput;
  /**
   * breakpoints are ordered by smallest devices to largest
   */
  breakPoints: BreakPoints;
}
