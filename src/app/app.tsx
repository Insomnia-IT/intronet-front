import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { Navbar } from "src/components";
import { Routing } from "../pages/routing";

export const App = () => (
  <ChakraProvider>
    <Navbar />
    <Routing />
  </ChakraProvider>
);
