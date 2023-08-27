import styles from "./input-wrapper.module.scss";
import { PropsWithChildren } from "react";

interface InputWrapperProps {
  label?: string;
  caption?: string;
  error?: boolean;
}

export const InputWrapper = ({
  children,
  caption,
  label,
  error,
}: PropsWithChildren<InputWrapperProps>) => {
  return (
    <div className={styles.inputWrapperProps}>
      {label ? (
        <label className={styles.label}>
          <div className={styles.labelText}>{label}</div>
          {children}
        </label>
      ) : (
        children
      )}
      {caption && (
        <div
          className={[styles.caption, error && styles.error]
            .filter((f) => !!f)
            .join(" ")}
        >
          {caption}
        </div>
      )}
    </div>
  );
};
