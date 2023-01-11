import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  PropsWithChildren,
} from "react";
import styles from "./button.module.scss";

interface ButtonThemeProps {
  theme?: "primary" | "secondary" | "shadow" | "underline";
  outlined?: boolean;
  active?: boolean;
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonThemeProps {}

export function Button({
  children,
  className,
  theme,
  outlined,
  active,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={[
        styles.button,
        outlined && styles.outlined,
        theme && styles[theme],
        active && styles.active,
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

// eslint-disable-next-line react/display-name
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ children, className, theme, outlined, active, ...props }, ref) => (
    <a
      ref={ref}
      className={[
        styles.button,
        outlined && styles.outlined,
        active && styles.active,
        theme && styles[theme],
        className,
      ]
        .filter((f) => !!f)
        .join(" ")}
      {...props}
    >
      {children}
    </a>
  )
);
