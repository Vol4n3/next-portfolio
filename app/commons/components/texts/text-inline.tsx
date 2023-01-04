import { HTMLProps } from "react";
import styles from "./text.module.scss";

type HeadingProps = Omit<HTMLProps<HTMLSpanElement>, "type"> & {
  modifSize?: "bigger" | "smaller";
  type: "H1" | "H2" | "H3" | "Body";
};

export function TextInline({
  children,
  className,
  modifSize,
  type,
  ...rest
}: HeadingProps) {
  const props = {
    className: [styles[type], className].filter((f) => !!f).join(" "),
    children: modifSize ? (
      <span className={styles[modifSize]}>{children}</span>
    ) : (
      children
    ),
    ...rest,
  };
  return <span {...props} />;
}
