import { HTMLProps, PropsWithChildren } from "react";
import styled from "styled-components";
import {
  AlignItemProps,
  FlexColumnGapProps,
  FlexDirectionProps,
  FlexHeightProps,
  FlexRowGapProps,
  FlexWidthProps,
  FlexWrapProps,
  JustifyContentProps,
} from "./flex-type";
import {
  ResponsiveAlignItems,
  ResponsiveColumnGap,
  ResponsiveDirection,
  ResponsiveHeight,
  ResponsiveJustifyContent,
  ResponsiveRowGap,
  ResponsiveWidth,
  ResponsiveWrap,
} from "./flex-util";

type FlexProps = FlexWrapProps &
  AlignItemProps &
  JustifyContentProps &
  FlexDirectionProps &
  FlexWidthProps &
  FlexHeightProps &
  FlexColumnGapProps &
  FlexRowGapProps;
const FlexCss = styled.div<FlexProps>`
  display: flex;
  position: relative;
  ${ResponsiveWrap};
  ${ResponsiveAlignItems};
  ${ResponsiveJustifyContent};
  ${ResponsiveDirection};
  ${ResponsiveWidth};
  ${ResponsiveHeight};
  ${ResponsiveColumnGap};
  ${ResponsiveRowGap};
`;

export function Flex(
  props: PropsWithChildren<
    FlexProps & Omit<HTMLProps<HTMLDivElement>, "width" | "height">
  >
) {
  return <FlexCss {...props} />;
}
