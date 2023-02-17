import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "src/components";
import { AppProvider, Modals } from "src/helpers/AppProvider";
import { theme } from "src/theme/theme";
import styles from "./app.style.module.css";
import {useRouter} from "../pages/routing";

export const App = () => {
  const {active: {Component}} = useRouter();
  return (
    <AppProvider>
      <ChakraProvider theme={theme}>
        <Flex className={styles.main} direction="column" align="stretch">
          {/* from 0-30-48em reverse order, the rest is normal order */}
          <Box order={[2, null, 0]}>
            <Navbar/>
          </Box>
          <Flex direction="column" flex={1} minHeight={0}>
            <Component />
          </Flex>
        </Flex>
        <Modals/>
      </ChakraProvider>
    </AppProvider>
  );
};
