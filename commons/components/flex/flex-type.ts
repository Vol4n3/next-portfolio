export type ScreenDevice = "xs" | "sm" | "lg" | "xl";
type Globals = "-moz-initial" | "inherit" | "initial" | "revert" | "unset";
type SelfPosition =
  | "center"
  | "end"
  | "flex-end"
  | "flex-start"
  | "self-end"
  | "self-start"
  | "start";
type AlignItemsProperty =
  | Globals
  | SelfPosition
  | "baseline"
  | "normal"
  | "stretch";
type ContentDistribution =
  | "space-around"
  | "space-between"
  | "space-evenly"
  | "stretch";
type ContentPosition = "center" | "end" | "flex-end" | "flex-start" | "start";
type JustifyContentProperty =
  | Globals
  | ContentDistribution
  | ContentPosition
  | "left"
  | "normal"
  | "right";

type FlexDirectionProperty =
  | Globals
  | "column"
  | "column-reverse"
  | "row"
  | "row-reverse";
type FlexWrapProperty = Globals | "nowrap" | "wrap" | "wrap-reverse";

export interface AlignItemProps {
  alignItems?: AlignItemsProperty | AlignItemsProperty[];
}
export interface JustifyContentProps {
  justifyContent?: JustifyContentProperty | JustifyContentProperty[];
}
export interface FlexDirectionProps {
  direction?: FlexDirectionProperty | FlexDirectionProperty[];
}
export interface FlexWrapProps {
  wraps?: FlexWrapProperty | FlexWrapProperty[];
}
export interface FlexWidthProps {
  width?: string | string[];
}
export interface FlexHeightProps {
  height?: string | string[];
}
export interface FlexGapColumnProps {
  gapColumn?: string | string[];
}
export interface FlexGapRowProps {
  gapRow?: string | string[];
}
