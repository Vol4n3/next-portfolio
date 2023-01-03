import { ChangeEvent, HTMLProps } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  border-radius: ${({ theme }) => theme.input.borderRadius};
  border: ${({ theme }) => theme.input.border};
  color: ${({ theme }) => theme.input.color};
  padding: ${({ theme }) => theme.input.padding};
  margin: ${({ theme }) => theme.input.margin};
  background: ${({ theme }) => theme.input.background};
`;

interface TextFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
}

export function TextField({ value, onChange, ...props }: TextFieldProps) {
  return (
    <StyledInput
      {...(props as any)}
      value={value}
      onChange={(e) => onChange(e.target.value, e)}
    />
  );
}
