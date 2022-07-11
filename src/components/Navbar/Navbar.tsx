import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { NAVBAR_ROUTES } from "src/pages/routing";
import { MdNavbar } from "./MdNavbar";

export const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const boxBg = useColorModeValue("gray.100", "gray.900");
  const linkBackground = useColorModeValue("gray.200", "gray.700");

  return (
    <Box bg={boxBg} px={4} position="sticky" top="0">
      <Flex h={16} alignItems={"center"} justifyContent="space-between">
        <MdNavbar />
        <HStack
          spacing={8}
          alignItems={"center"}
          display={["none", null, "flex"]}
        >
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {NAVBAR_ROUTES.map((link) => (
              <Link
                key={link.path}
                px={2}
                py={1}
                as={ReactRouterLink}
                to={link.path}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: linkBackground,
                }}
              >
                {link.text}
              </Link>
            ))}
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};
