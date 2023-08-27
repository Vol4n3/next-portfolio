import { ChangeEvent, HTMLProps } from "react";
import styles from "./text-field.module.scss";
import { InputWrapper } from "@components/input-wrapper/input-wrapper";

export interface TextFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  label: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
  error?: boolean;
  caption?: string;
}

export function TextField({
  value,
  onChange,
  className,
  label,
  error,
  caption,
  ...props
}: TextFieldProps) {
  return (
    <InputWrapper label={label} error={error} caption={caption}>
      <input
        className={[styles.textField, className].filter((f) => !!f).join(" ")}
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value, e)}
      />
    </InputWrapper>
  );
}
