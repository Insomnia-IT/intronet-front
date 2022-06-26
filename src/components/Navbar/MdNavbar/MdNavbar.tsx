import {
  Box,
  Image,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import AdsIcon from "src/images/ads-icon-default-32.svg";
import HomeIcon from "src/images/home-icon-default-32.svg";
import MapIcon from "src/images/map-icon-default-32.svg";
import VoteIcon from "src/images/vote-icon-default-32.svg";
import { ROUTES } from "src/pages/routing";
import { Link as ReactRouterLink } from "react-router-dom";

export const MdNavbar = () => {
  return (
    <>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis="0"
          flexGrow={1}
          key={ROUTES[0].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          as={ReactRouterLink}
          to={ROUTES[0].path}
        >
          <VStack>
            <Image src={HomeIcon} />
            <Text fontSize="xs" size="none" mt="0!important">
              {ROUTES[0].text}
            </Text>
          </VStack>
        </Link>
      </Box>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis={0}
          flexGrow={1}
          key={ROUTES[1].path}
          // px={2}
          // py={1}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          as={ReactRouterLink}
          to={ROUTES[1].path}
        >
          <VStack>
            <Image src={AdsIcon} />
            <Text fontSize="xs" mt="0!important">
              {ROUTES[1].text}
            </Text>
          </VStack>
        </Link>
      </Box>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis={0}
          flexGrow={1}
          key={ROUTES[2].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          as={ReactRouterLink}
          to={ROUTES[2].path}
        >
          <VStack>
            <Image src={MapIcon} />
            <Text fontSize="xs" mt="0!important">
              {ROUTES[2].text}
            </Text>
          </VStack>
        </Link>
      </Box>
      <Box flexBasis={0} flexGrow={1} display={{ md: "none" }}>
        <Link
          flexBasis={0}
          flexGrow={1}
          key={ROUTES[3].path}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
          }}
          as={ReactRouterLink}
          to={ROUTES[3].path}
        >
          <VStack>
            <Image src={VoteIcon} />
            <Text fontSize="xs" mt="0!important">
              {ROUTES[3].text}
            </Text>
          </VStack>
        </Link>
      </Box>
    </>
  );
};
