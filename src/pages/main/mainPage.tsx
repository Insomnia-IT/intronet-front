import { Box, Container, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Heading } from "../../components/heading/heading";
import { LoginButton } from "../../components/loginButton/loginButton";
import { CardList } from "./cardList/cardList";
import { getRandomItem } from "../../helpers/getRandomItem";
import { titlesList } from "./titelsList";

export const MainPage = () => {
  return (
    <>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}
      <LoginButton position={"absolute"} top={0} right={0} opacity={0} />
      <Container h={"100%"} overflowY={"auto"} className={"hide-scrollbar"}>
        <VStack
          spacing={4}
          align={"flex-start"}
          w={"100%"}
          maxH={"100%"}
          pt={16}
        >
          <Box
            pb={5}
            display={"flex"}
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Heading level={1}>{getRandomItem(titlesList)}</Heading>
          </Box>
          <CardList></CardList>
        </VStack>
      </Container>
    </>
  );
};
