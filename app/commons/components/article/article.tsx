import { PropsWithChildren } from "react";
import styles from "./article.module.scss";

interface ContainerProps {
  centered?: boolean;
  maxWidth?: string;
}

export function Article({
  children,
  maxWidth,
  centered,
}: PropsWithChildren<ContainerProps>) {
  return (
    <article
      className={styles.article}
      style={{ maxWidth, margin: `0 ${centered ? "auto" : ""}` }}
    >
      {children}
    </article>
  );
}
