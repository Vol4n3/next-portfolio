import { HTMLProps, PropsWithChildren } from "react";
import styled from "styled-components";
import {
  AlignItemProps,
  FlexDirectionProps,
  FlexGapColumnProps,
  FlexGapRowProps,
  FlexHeightProps,
  FlexWidthProps,
  FlexWrapProps,
  JustifyContentProps,
} from "./flex-type";
import {
  ResponsiveAlignItems,
  ResponsiveDirection,
  ResponsiveGapColumn,
  ResponsiveGapRow,
  ResponsiveHeight,
  ResponsiveJustifyContent,
  ResponsiveWidth,
  ResponsiveWrap,
} from "./flex-util";

type FlexProps = FlexWrapProps &
  AlignItemProps &
  JustifyContentProps &
  FlexDirectionProps &
  FlexWidthProps &
  FlexHeightProps &
  FlexGapColumnProps &
  FlexGapRowProps;
const FlexCss = styled.div<FlexProps>`
  display: flex;
  position: relative;
  ${ResponsiveWrap};
  ${ResponsiveAlignItems};
  ${ResponsiveJustifyContent};
  ${ResponsiveDirection};
  ${ResponsiveWidth};
  ${ResponsiveHeight};
  ${ResponsiveGapColumn};
  ${ResponsiveGapRow};
`;

export function Flex(
  props: PropsWithChildren<
    FlexProps & Omit<HTMLProps<HTMLDivElement>, "width" | "height">
  >
) {
  return <FlexCss {...props} />;
}
