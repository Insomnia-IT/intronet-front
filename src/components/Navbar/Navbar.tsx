import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  HStack,
  IconButton,
  Link,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Routes } from "src/pages/routing";
import { Link as WouterLink } from "wouter";

export const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Routes.map((link) => (
              <Link
                key={link.link}
                px={2}
                py={1}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: useColorModeValue("gray.200", "gray.700"),
                }}
                as={WouterLink}
                href={link.link}
              >
                {link.text}
              </Link>
            ))}
          </HStack>
        </HStack>
        <Link
          bg={useColorModeValue("green.200", "green900")}
          as={WouterLink}
          px={2}
          py={1}
          rounded={"md"}
          href={"/user-login"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
        >
          Войти
        </Link>
      </Flex>

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Insomnia 2022</DrawerHeader>
          <DrawerBody>
            <VStack spacing="2" alignItems="flex-start">
              {Routes.map((link) => (
                <Link
                  key={link.link}
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: useColorModeValue("gray.200", "gray.700"),
                  }}
                  as={WouterLink}
                  href={link.link}
                  onClick={onClose}
                >
                  {link.text}
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
