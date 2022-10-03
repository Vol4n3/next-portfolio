import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledArticle = styled.article<{ isCentered?: boolean }>`
  position: relative;
  padding: max(5px, min(2vh, 40px));
  width: 100%;
  margin: 0 ${({ isCentered }) => (isCentered ? "auto" : "")};
`;

interface ContainerProps {
  centered?: boolean;
  maxWidth?: string;
}

export function Article({
  children,
  maxWidth,
  centered,
}: PropsWithChildren<ContainerProps>) {
  return (
    <StyledArticle
      isCentered={centered}
      style={maxWidth ? { maxWidth } : undefined}
    >
      {children}
    </StyledArticle>
  );
}
