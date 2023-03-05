import * as React from "preact/compat";
import styles from "./loading.module.css";
import { Box, Spinner } from "@chakra-ui/react";

const margin: number = 5;

export function Loading({
  isLoading,
  children,
  className,
  width = 100,
  height = 100,
}: {
  isLoading: boolean;
  children: JSX.Element | JSX.Element[];
  className?: string;
  width?: number;
  height?: number;
}) {
  if (isLoading) {
    return (
      <Box w="100%" display={"grid"} placeItems="center">
        <Spinner
          width={width - margin * 2}
          height={height - margin * 2}
          className={styles.spinner + " " + className}
          color={"brand.300"}
          style={{ margin: margin.toString() + "px" }}
        />
      </Box>
    );
  } else {
    return <>{children}</>;
  }
}
