import { HTMLProps } from "react";
import styles from "./text.module.scss";
import { ArrayToClassName } from "@commons/utils/utils";

type HeadingProps = Omit<HTMLProps<HTMLSpanElement>, "type"> & {
  modifSize?: "bigger" | "smaller";
  type: "H1" | "H2" | "H3" | "Body";
};

export function TextInline({
  children,
  className,
  modifSize,
  type,
  ...props
}: HeadingProps) {
  return (
    <span {...props} className={ArrayToClassName([styles[type], className])}>
      {modifSize ? (
        <span className={styles[modifSize]}>{children}</span>
      ) : (
        children
      )}
    </span>
  );
}
