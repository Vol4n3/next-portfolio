import { HTMLProps, PropsWithChildren } from "react";
import styles from "./card.module.scss";
import { arrayToJoin } from "@commons/utils/utils";

export function Card({
  children,
  className,
  onClick,
  ...rest
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <div
      className={arrayToJoin([
        onClick && styles.clickable,
        styles.card,
        className,
      ])}
      {...{ onClick, ...rest }}
    >
      {children}
    </div>
  );
}
