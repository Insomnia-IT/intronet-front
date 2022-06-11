import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";
import React from "react";
import { NoteModal } from "src/components/modals/NoteModal";
import { useAppContext } from "src/helpers/AppProvider";
import BoardList from "./boardList/boardList";
import styles from "./boardPage.module.scss";
import Categories from "./categories/categories";
import Pageing from "./pageing/pageing";

export const BoardPage: React.FC = () => {
  const app = useAppContext();

  const handleAddIconButtonClick = async () => {
    try {
      const newArticle = await app.modals.show((props) => (
        <NoteModal {...props} />
      ));
    } catch (error) {}
  };
  return (
    <>
      <Categories />
      <div className={"mb-5 " + styles.boardListCont}>
        <BoardList></BoardList>
      </div>
      <Pageing />
      <Box position="absolute" bottom="10" right="10">
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
