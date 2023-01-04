import { HTMLProps } from "react";
import styles from "./text.module.scss";

type HeadingProps = Omit<
  HTMLProps<HTMLParagraphElement | HTMLHeadingElement>,
  "type"
> & {
  modifSize?: "bigger" | "smaller";
  type: "H1" | "H2" | "H3" | "Body";
};

export function TextBlock({
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
  switch (type) {
    case "H1":
      return <h1 {...props} />;
    case "H2":
      return <h2 {...props} />;
    case "H3":
      return <h3 {...props} />;
    case "Body":
      return <p {...props} />;
  }
}
