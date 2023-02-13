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
import AdsIcon from "src/images/ads-icon-default-32.svg";
import AdsFocusIcon from "src/images/ads-icon-focus-32.svg";
import HomeIcon from "src/images/home-icon-default-32.svg";
import HomeFocusIcon from "src/images/home-icon-focus-32.svg";
import MapIcon from "src/images/map-icon-default-32.svg";
import MapFocusIcon from "src/images/map-icon-focus-32.svg";
import VoteIcon from "src/images/vote-icon-default-32.svg";
import VoteFocusIcon from "src/images/vote-icon-focus-32.svg";
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
                  ? HomeFocusIcon
                  : HomeIcon
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
                  ? AdsFocusIcon
                  : AdsIcon
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
                  ? MapFocusIcon
                  : MapIcon
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
                  ? VoteFocusIcon
                  : VoteIcon
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
