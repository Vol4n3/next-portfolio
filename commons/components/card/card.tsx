import { HTMLProps, PropsWithChildren } from "react";
import styled from "styled-components";

const StyledCard = styled.div`
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.card.background};
  color: ${({ theme }) => theme.card.color};
  border: ${({ theme }) => theme.card.border};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.card.borderRadius};
  padding: ${({ theme }) => theme.card.padding};
`;

export function Card({
  children,
  ...rest
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return <StyledCard {...rest}>{children}</StyledCard>;
}
