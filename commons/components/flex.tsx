import { PropsWithChildren } from "react";
import styled from "styled-components";

interface FlexProps {
  columns?: number | number[];
  maxColumns?: number;
}

type Devices = "xs" | "sm" | "lg" | "xl";
const Media = (device: Devices, css: string): string => {
  switch (device) {
    case "xs":
    case "sm":
    case "lg":
    case "xl":
      return `media`;
    default:
      return css;
  }
};
const FlexCss = styled.div<FlexProps>``;

export function Flex({}: PropsWithChildren<FlexProps>) {
  return <div></div>;
}
