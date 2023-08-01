import { HTMLProps, PropsWithChildren } from "react";
import styles from "./centered-container.module.scss";

interface ContainerProps extends HTMLProps<HTMLDivElement> {
  maxWidth?: string;
}

export function CenteredContainer({
  children,
  maxWidth,
  style,
  className,
  ...props
}: PropsWithChildren<ContainerProps>) {
  return (
    <section
      {...props}
      className={[styles.centeredContainer, "padding", className]
        .filter((f) => !!f)
        .join(" ")}
      style={{ maxWidth, ...style }}
    >
      {children}
    </section>
  );
}
