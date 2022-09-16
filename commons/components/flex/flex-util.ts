import {
  AlignItemProps,
  FlexWidthProps,
  FlexDirectionProps,
  FlexWrapProps,
  JustifyContentProps,
  ScreenDevice,
  FlexGapColumnProps,
  FlexGapRowProps,
  FlexHeightProps,
} from "./flex-type";
import { css } from "styled-components";

const DEVICES: ScreenDevice[] = ["xs", "sm", "lg", "xl"];
const PickChoiceByDevice = <T>(device: ScreenDevice, choices: T[]): T => {
  switch (device) {
    case "xl":
      return choices[3] || choices[2] || choices[1] || choices[0];
    case "lg":
      return choices[2] || choices[1] || choices[0];
    case "sm":
      return choices[1] || choices[0];
    case "xs":
    default:
      return choices[0];
  }
};
export const MakeCssMediaBreakPoint = (
  css: string,
  devices: ScreenDevice,
  breakPoints: [number, number, number]
): string => {
  let media = 0;
  switch (devices) {
    case "xs":
      return css;
    case "sm":
      media = breakPoints[0];
      break;
    case "lg":
      media = breakPoints[1];
      break;
    case "xl":
      media = breakPoints[2];
      break;
  }
  return `
     @media (min-width: ${media}px) {
        ${css}
     }
    `;
};
export function MakeResponsiveCss<T>(
  key: keyof T,
  cssPrefix: string,
  defaultValue: string = ""
) {
  return css<T>`
    ${({ [key]: val, theme: { breakPoints } }) => {
      if (typeof val === "undefined") return defaultValue || "";
      if (typeof val === "string") return `${cssPrefix}: ${val};`;
      return DEVICES.slice(0, val.length).map((device) =>
        MakeCssMediaBreakPoint(
          `${cssPrefix}: ${PickChoiceByDevice(device, val)};`,
          device,
          breakPoints
        )
      );
    }};
  `;
}
export const ResponsiveWrap = MakeResponsiveCss<FlexWrapProps>(
  "wraps",
  "flex-wrap",
  "flex-wrap: wrap"
);
export const ResponsiveAlignItems = MakeResponsiveCss<AlignItemProps>(
  "alignItems",
  "align-items"
);
export const ResponsiveJustifyContent = MakeResponsiveCss<JustifyContentProps>(
  "justifyContent",
  "justify-content"
);
export const ResponsiveDirection = MakeResponsiveCss<FlexDirectionProps>(
  "direction",
  "flex-direction"
);
export const ResponsiveWidth = MakeResponsiveCss<FlexWidthProps>(
  "width",
  "width"
);
export const ResponsiveHeight = MakeResponsiveCss<FlexHeightProps>(
  "height",
  "height"
);
export const ResponsiveGapColumn = MakeResponsiveCss<FlexGapColumnProps>(
  "gapColumn",
  "column-gap"
);
export const ResponsiveGapRow = MakeResponsiveCss<FlexGapRowProps>(
  "gapRow",
  "row-gap"
);
