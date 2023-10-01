import { ButtonHTMLAttributes, ComponentProps, PropsWithChildren } from "react";
import styles from "./button.module.scss";
import { ArrayToClassName } from "@commons/utils/utils";
import Link from "next/link";

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

type LinkButtonProps = ComponentProps<typeof Link> & ButtonThemeProps;

export function LinkButton({
  children,
  className,
  theme,
  outlined,
  active,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={ArrayToClassName([
        styles.button,
        outlined && styles.outlined,
        active && styles.active,
        theme && styles[theme],
        className,
      ])}
    >
      {children}
    </Link>
  );
}
