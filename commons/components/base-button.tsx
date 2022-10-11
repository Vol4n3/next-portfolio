import { HTMLProps, PropsWithChildren } from "react";
import styled from "styled-components";

interface BaseButtonProps extends HTMLProps<HTMLButtonElement> {}
const StyleButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  outline: none;
  font: inherit;

  &:not(:disabled) {
    cursor: pointer;
  }
`;
export function BaseButton({
  children,
  ...props
}: PropsWithChildren<BaseButtonProps>) {
  return (
    <StyleButton type={"button"} {...(props as any)}>
      {children}
    </StyleButton>
  );
}
