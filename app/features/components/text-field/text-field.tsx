import { ChangeEvent, HTMLProps } from "react";
import styles from "./text-field.module.scss";

export interface TextFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  label: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
  error?: boolean | string;
}

export function TextField({
  value,
  onChange,
  className,
  label,
  ...props
}: TextFieldProps) {
  return (
    <>
      <label>
        <div className={styles.label}>{label}</div>
        <input
          className={[styles.textField, className].join(" ")}
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value, e)}
        />
      </label>
      <div className={styles.captionError}></div>
    </>
  );
}
