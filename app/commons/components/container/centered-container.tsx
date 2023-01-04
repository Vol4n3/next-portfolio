import { PropsWithChildren } from "react";
import styles from "./centered-container.module.scss";

interface ContainerProps {
  maxWidth?: string;
}

export function CenteredContainer({
  children,
  maxWidth,
}: PropsWithChildren<ContainerProps>) {
  return (
    <div className={styles.centeredContainer} style={{ maxWidth }}>
      {children}
    </div>
  );
}
