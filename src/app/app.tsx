import { ChakraProvider, Flex } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "src/components/Navbar/Navbar";
import { Routing } from "../pages/routing";
import styles from "./app.style.module.css";

export const App = () => (
  <ChakraProvider>
    <Flex
      className={styles.main}
      // from 0-30-48em column reverse, the rest is column
      direction={["column-reverse", null, "column"]}
      align="stretch"
    >
      <Navbar />
      <Routing />
    </Flex>
  </ChakraProvider>
);
