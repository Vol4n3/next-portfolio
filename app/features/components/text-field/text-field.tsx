import { ChangeEvent, HTMLProps } from "react";
import styles from "./text-field.module.scss";

interface TextFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
}

export function TextField({
  value,
  onChange,
  className,
  ...props
}: TextFieldProps) {
  return (
    <input
      className={[styles.textField, className].join(" ")}
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value, e)}
    />
  );
}
