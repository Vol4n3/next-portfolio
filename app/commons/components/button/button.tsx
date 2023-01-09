import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PropsWithChildren,
} from "react";
import styles from "./button.module.scss";

interface ButtonThemeProps {
  theme?: "primary" | "secondary";
  outlined?: boolean;
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonThemeProps {}

export function Button({
  children,
  className,
  theme,
  outlined,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={[
        styles.button,
        outlined && styles.outlined,
        theme && styles[theme],
        className,
      ]
        .filter((f) => !!f)
        .join(" ")}
      type={"button"}
      {...props}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonThemeProps {}

export function LinkButton({
  children,
  className,
  theme,
  outlined,
  ...props
}: PropsWithChildren<LinkButtonProps>) {
  return (
    <a
      className={[
        styles.button,
        outlined && styles.outlined,
        theme && styles[theme],
        className,
      ]
        .filter((f) => !!f)
        .join(" ")}
      {...props}
    >
      {children}
    </a>
  );
}
