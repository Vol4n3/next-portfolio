import { PropsWithChildren } from "react";
import styled, { css } from "styled-components";

interface FlexProps {
  columns?: number | number[];
  maxColumns?: number;
}

const testCss = styled.div<{ bad: string }>`
  width: 5000px;
`;
const FlexCss = styled.div<FlexProps>`
  background: red;
  ${testCss};
`;

export function Flex({ children }: PropsWithChildren<FlexProps>) {
  return <FlexCss>{children}</FlexCss>;
}
