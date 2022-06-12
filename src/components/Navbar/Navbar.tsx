import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Link,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { ROUTES } from "src/pages/routing";
import { Link as WouterLink } from "wouter";
import { MdNavbar } from "./MdNavbar";

export const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Divider />
      <Box
        bg={useColorModeValue("white", "gray.900")}
        px={4}
        position="sticky"
        top="0"
      >
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
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {ROUTES.map((link) => (
                <Link
                  key={link.link}
                  px={2}
                  py={1}
                  as={WouterLink}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: useColorModeValue("gray.200", "gray.700"),
                  }}
                  href={link.link}
                >
                  {link.text}
                </Link>
              ))}
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  );
};
