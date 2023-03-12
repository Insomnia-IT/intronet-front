import * as React from "preact/compat";
import styles from "./loading.module.css";

export function Loading({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: JSX.Element | JSX.Element[];
  className?: string;
  width?: number;
  height?: number;
}) {
  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner + " " + className} />
      </div>
    );
  } else {
    return <>{children}</>;
  }
}
