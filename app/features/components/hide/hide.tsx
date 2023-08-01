import { PropsWithChildren } from "react";
import styles from "./hide.module.scss";

type ScreenDevices = "xs" | "sm" | "md" | "lg" | "xl";

export function Hide({
  children,
  devices,
}: PropsWithChildren<{ devices: ScreenDevices[] }>) {
  return (
    <div className={devices.map((d) => styles[`hide-${d}`]).join(" ")}>
      {children}
    </div>
  );
}
