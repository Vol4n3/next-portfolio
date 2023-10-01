import { ComponentProps, HTMLProps, PropsWithChildren } from "react";
import styles from "./card.module.scss";
import { ArrayToClassName } from "@commons/utils/utils";
import Link from "next/link";

export function Card({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <div className={ArrayToClassName([styles.card, className])} {...rest}>
      {children}
    </div>
  );
}
export function LinkCard({
  children,
  className,
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={ArrayToClassName([styles.clickable, styles.card, className])}
    >
      {children}
    </Link>
  );
}
