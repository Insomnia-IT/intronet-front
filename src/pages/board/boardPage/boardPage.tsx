import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton, useToast } from "@chakra-ui/react";
import React from "react";
import { NoteModal } from "src/components/modals/NoteModal";
import { useAppContext } from "src/helpers/AppProvider";
import { notesStore } from "src/stores";
import BoardList from "./boardList/boardList";
import styles from "./boardPage.module.scss";
import Categories from "./categories/categories";
import Pageing from "./pageing/pageing";

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
    <>
      <Categories />
      <div className={"mb-5 " + styles.boardListCont}>
        <BoardList></BoardList>
      </div>
      <Pageing />
      <Box position="absolute" bottom="16" right="16">
        <IconButton
          icon={<AddIcon />}
          aria-label="add article"
          isRound
          size="lg"
          onClick={handleAddIconButtonClick}
        />
      </Box>
    </>
  );
};
