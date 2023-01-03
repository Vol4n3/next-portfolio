import { HTMLProps, PropsWithChildren } from "react";
import styles from "./button.module.scss";

interface ButtonProps extends HTMLProps<HTMLButtonElement> {}

export function Button({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={[styles.button, className].join(" ")}
      {...props}
      type={"button"}
    >
      {children}
    </button>
  );
}
