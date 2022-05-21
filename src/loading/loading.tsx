import * as React from "react";
import styles from "./loading.module.scss";
import { Spinner } from "@chakra-ui/react";

const margin: number = 5;

export default function Loading({
  isLoading,
  children,
  className,
  width = 100,
  height = 100,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  width?: number;
  height?: number;
}) {
  if (isLoading) {
    return (
      <Spinner
        width={width - margin * 2}
        height={height - margin * 2}
        className={styles.spinner + " " + className}
        color="currentColor"
        style={{ margin: margin.toString() + "px" }}
      />
    );
  } else {
    return <>{children}</>;
  }
}
