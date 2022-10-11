import {
  AlignItemProps,
  FlexColumnGapProps,
  FlexDirectionProps,
  FlexHeightProps,
  FlexRowGapProps,
  FlexWidthProps,
  FlexWrapProps,
  JustifyContentProps,
  ScreenDevice,
} from "./flex-type";
import { css } from "styled-components";
import { BreakPoints } from "../../../features/theme/theme-types";

const DEVICES: ScreenDevice[] = ["xs", "sm", "md", "lg", "xl"];
export const PickChoiceByDevice = <T>(
  device: ScreenDevice,
  choices: T[]
): T | undefined => {
  const index = DEVICES.indexOf(device);
  return choices.at(index) || choices[choices.length - 1];
};
export const MakeCssMediaBreakPoint = (
  css: string,
  devices: ScreenDevice,
  breakPoints: BreakPoints
): string => {
  let media = 0;
  switch (devices) {
    case "xs":
      return css;
    case "sm":
      media = breakPoints[0];
      break;
    case "md":
      media = breakPoints[1];
      break;
    case "lg":
      media = breakPoints[2];
      break;
    case "xl":
      media = breakPoints[3];
      break;
  }
  return `
     @media (min-width: ${media}px) {
        ${css}
     }
    `;
};

export function MakeResponsiveCss<T extends object>(
  key: keyof T,
  cssPrefix: string,
  defaultValue: string = ""
): any {
  return css<T>`
    ${({ [key]: val, theme: { breakPoints } }) => {
      if (typeof val === "undefined") return defaultValue || "";
      if (typeof val === "string") return `${cssPrefix}: ${val};`;
      if (!Array.isArray(val)) return "";
      return DEVICES.slice(0, val.length).map((device) => {
        const choice = PickChoiceByDevice(device, val);
        return choice
          ? MakeCssMediaBreakPoint(
              `${cssPrefix}: ${choice};`,
              device,
              breakPoints
            )
          : "";
      });
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
export const ResponsiveColumnGap = MakeResponsiveCss<FlexColumnGapProps>(
  "columnGap",
  "column-gap"
);
export const ResponsiveRowGap = MakeResponsiveCss<FlexRowGapProps>(
  "rowGap",
  "row-gap"
);
