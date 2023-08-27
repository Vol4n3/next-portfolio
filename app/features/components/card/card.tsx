import { HTMLProps, PropsWithChildren } from "react";
import styles from "./card.module.scss";

export function Card({
  children,
  className,
  onClick,
  ...rest
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <div
      className={[onClick && styles.clickable, styles.card, className]
        .filter((f) => !!f)
        .join(" ")}
      {...{ onClick, ...rest }}
    >
      {children}
    </div>
  );
}
