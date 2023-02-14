import {
  Box,
  Image,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { NAVBAR_ROUTES } from "src/pages/routing";

export const MdNavbar = () => {
  const location = useLocation();

  return (
    <>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis="0"
          flexGrow={1}
          key={NAVBAR_ROUTES[0].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          _focus={{
            boxShadow: "none",
          }}
          to={NAVBAR_ROUTES[0].path}
          as={ReactRouterLink}
          _activeLink={{
            fontcolor: "#6BBDB0",
          }}
        >
          <VStack>
            <Image
              src={
                location.pathname === NAVBAR_ROUTES[0].path
                  ?  '/icons/toolbar/home-icon-focus-32.svg'
                  : '/icons/toolbar/home-icon-default-32.svg'
              }
            />
            <Text
              fontSize="xs"
              size="none"
              mt="0!important"
              color={
                location.pathname === NAVBAR_ROUTES[0].path
                  ? "#6BBDB0"
                  : undefined
              }
            >
              {NAVBAR_ROUTES[0].text}
            </Text>
          </VStack>
        </Link>
      </Box>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis={0}
          flexGrow={1}
          key={NAVBAR_ROUTES[1].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          _focus={{
            boxShadow: "none",
          }}
          as={ReactRouterLink}
          to={NAVBAR_ROUTES[1].path}
        >
          <VStack>
            <Image
              src={
                location.pathname === NAVBAR_ROUTES[1].path
                  ?  '/icons/toolbar/ads-icon-focus-32.svg'
                  : '/icons/toolbar/ads-icon-default-32.svg'
              }
            />
            <Text
              fontSize="xs"
              size="none"
              mt="0!important"
              color={
                location.pathname === NAVBAR_ROUTES[1].path
                  ? "#6BBDB0"
                  : undefined
              }
            >
              {NAVBAR_ROUTES[1].text}
            </Text>
          </VStack>
        </Link>
      </Box>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis={0}
          flexGrow={1}
          key={NAVBAR_ROUTES[2].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          as={ReactRouterLink}
          _focus={{
            boxShadow: "none",
          }}
          to={NAVBAR_ROUTES[2].path}
        >
          <VStack>
            <Image
              src={
                location.pathname === NAVBAR_ROUTES[2].path
                  ?  '/icons/toolbar/map-icon-focus-32.svg'
                  : '/icons/toolbar/map-icon-default-32.svg'
              }
            />
            <Text
              fontSize="xs"
              size="none"
              mt="0!important"
              color={
                location.pathname === NAVBAR_ROUTES[2].path
                  ? "#6BBDB0"
                  : undefined
              }
            >
              {NAVBAR_ROUTES[2].text}
            </Text>
          </VStack>
        </Link>
      </Box>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis={0}
          flexGrow={1}
          key={NAVBAR_ROUTES[3].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          _focus={{
            boxShadow: "none",
          }}
          as={ReactRouterLink}
          to={NAVBAR_ROUTES[3].path}
        >
          <VStack>
            <Image
              src={
                location.pathname === NAVBAR_ROUTES[3].path
                  ?  '/icons/toolbar/vote-icon-focus-32.svg'
                  : '/icons/toolbar/vote-icon-default-32.svg'
              }
            />
            <Text
              fontSize="xs"
              size="none"
              mt="0!important"
              color={
                location.pathname === NAVBAR_ROUTES[3].path
                  ? "#6BBDB0"
                  : undefined
              }
            >
              {NAVBAR_ROUTES[3].text}
            </Text>
          </VStack>
        </Link>
      </Box>
    </>
  );
};
