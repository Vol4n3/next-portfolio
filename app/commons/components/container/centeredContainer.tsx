import { PropsWithChildren } from "react";
import styles from "./container.module.scss";

interface ContainerProps {
  maxWidth?: string;
}

export function CenteredContainer({
  children,
  maxWidth,
}: PropsWithChildren<ContainerProps>) {
  return (
    <div className={styles.container} style={{ maxWidth }}>
      {children}
    </div>
  );
}
