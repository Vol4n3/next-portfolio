import { Theme } from "./features/theme/theme-types";

declare module "styled-components" {
  interface DefaultTheme extends Theme {}
}
