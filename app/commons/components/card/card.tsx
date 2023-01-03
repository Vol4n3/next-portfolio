import { HTMLProps, PropsWithChildren } from "react";
import styles from "./card.module.scss";

export function Card({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <div className={[styles.card, className].join(" ")} {...rest}>
      {children}
    </div>
  );
}
