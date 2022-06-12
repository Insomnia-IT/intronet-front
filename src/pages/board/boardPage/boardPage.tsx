import { AddIcon } from "@chakra-ui/icons";
import { Box, Container, IconButton, useToast, VStack } from "@chakra-ui/react";
import React from "react";
import { NoteModal } from "src/components";
import { useAppContext } from "src/helpers/AppProvider";
import { notesStore } from "src/stores";
import BoardList from "./boardList/boardList";
import Categories from "./categories/categories";
import Header from "./header/header";

export const BoardPage: React.FC = () => {
  const app = useAppContext();

  const toast = useToast();

  const handleAddIconButtonClick = async () => {
    try {
      const newArticle = await app.modals.show<INote>((props) => (
        <NoteModal {...props} />
      ));
      await notesStore.addNote(newArticle);
      toast({
        title: "Объявление успешно добавлено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка добавления объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <Container
      h={"100%"}
      //  maxH={'calc(100vh - 64px)'}
    >
      <VStack pt={8} align={"flex-start"} spacing={4} w={"100%"} maxH={"100%"}>
        <Box>
          <Header />
        </Box>
        <Box minW={"100%"}>
          <Categories />
        </Box>
        <Box minH={1} overflowY={"auto"} w="100%" className={" hide-scrollbar"}>
          <BoardList />
        </Box>
        {/* <Box
          alignSelf={'center'}
        >
          <Pageing />
        </Box> */}
      </VStack>
      <Box position="absolute" bottom="16" right="16">
        <IconButton
          icon={<AddIcon />}
          aria-label="add article"
          isRound
          size="lg"
          onClick={handleAddIconButtonClick}
        />
      </Box>
    </Container>
  );
};
