import React from "react";
import { FC } from "react";
import { Box, Img, Link } from "@chakra-ui/react";
import { Heading } from "src/components/heading/heading";
import { VStack } from "@chakra-ui/react";
import { Link as LinkWouter } from "wouter";

export const Card: FC<TMainPageCard> = ({ img, title, link }) => {
  return (
    <VStack
      pos={"relative"}
      spacing={0}
      align={"flex-start"}
      // p={2}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={16}
      boxSize={"100%"}
      justifyContent={"space-between"}
    >
      <Box
        pos={"absolute"}
        top={0}
        right={0}
        bottom={0}
        left={0}
        p={[4, 5]}
        // pl={3}
      >
        <Heading level={3} maxW={"208px"}>
          <Link
            as={LinkWouter}
            to={link}
            lineHeight={1}
            _after={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            {title}
          </Link>
        </Heading>
      </Box>
      <Img
        src={img}
        height={"100%"}
        width={"100%"}
        objectFit={"cover"}
        borderRadius={16}
      ></Img>
    </VStack>
  );
};
