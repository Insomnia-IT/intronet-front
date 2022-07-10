import * as React from "react"; //ffff
import styles from "./loading.module.scss";
import { Box, Spinner } from "@chakra-ui/react";

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
