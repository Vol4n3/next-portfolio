import { Property } from "csstype";

export type ScreenDevice = "xs" | "sm" | "md" | "lg" | "xl";

export interface AlignItemProps {
  alignItems?: Property.AlignItems | (Property.AlignItems | null)[];
}
export interface JustifyContentProps {
  justifyContent?: Property.JustifyContent | (Property.JustifyContent | null)[];
}
export interface FlexDirectionProps {
  direction?: Property.FlexDirection | (Property.FlexDirection | null)[];
}
export interface FlexWrapProps {
  wraps?: Property.FlexWrap | (Property.FlexWrap | null)[];
}
export interface FlexWidthProps {
  width?: Property.Width | (Property.Width | null)[];
}

export interface FlexHeightProps {
  height?: Property.Height | (Property.Height | null)[];
}

export interface FlexColumnGapProps {
  columnGap?: Property.ColumnGap | (Property.ColumnGap | null)[];
}

export interface FlexRowGapProps {
  rowGap?: Property.RowGap | (Property.RowGap | null)[];
}
