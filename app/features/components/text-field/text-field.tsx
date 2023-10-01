import { ChangeEvent, forwardRef, HTMLProps } from "react";
import styles from "./text-field.module.scss";
import { InputWrapper } from "@components/input-wrapper/input-wrapper";
import { ArrayToClassName } from "@commons/utils/utils";

export interface TextFieldProps
  extends Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  label: string;
  onChange: (value: string, originalEvent: ChangeEvent) => void;
  error?: boolean;
  caption?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { value, onChange, className, label, error, caption, ...props },
    ref,
  ) {
    return (
      <InputWrapper label={label} error={error} caption={caption}>
        <input
          {...props}
          ref={ref}
          className={ArrayToClassName([
            styles.textField,
            className,
            error && "error",
          ])}
          value={value}
          onChange={(e) => onChange(e.target.value, e)}
        />
      </InputWrapper>
    );
  },
);
