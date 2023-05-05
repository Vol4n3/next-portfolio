import styles from "./spinner.module.scss";

export function Spinner() {
  return (
    <div className={styles.spinner}>
      <svg viewBox="-3 -4 39 39" width={"100px"} fill={"transparent"}>
        <polygon strokeWidth="1" points="16,0 32,32 0,32"></polygon>
      </svg>
    </div>
  );
}
