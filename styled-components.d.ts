import { Theme } from "./app/features/theme/theme-types";
import type { CSSProp } from "styled-components";

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}
declare module "react" {
  interface DOMAttributes<T> {
    css?: CSSProp;
  }
}
