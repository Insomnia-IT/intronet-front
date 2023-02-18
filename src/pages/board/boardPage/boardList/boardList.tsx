import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton, useToast, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { NoteModal } from "src/components/modals";
import { RequireAuth } from "src/components/RequireAuth";
import { useAppContext } from "src/helpers/AppProvider";
import { categoriesStore, notesStore, pagesStore } from "src/stores";
import { Intersection } from "../../../../components/intersection";
import { scrollToRef } from "../../../../helpers/scrollToRef";
import { BoardCard } from "./boardCard/boardCard";
import { useCellState } from "../../../../helpers/cell-state";
import {useRouter} from "../../../routing";

export const BoardList: FC = () => {
  const { route } = useRouter();
  const id = route[1];
  const activeNote = useRef<HTMLLIElement>(null);

  const app = useAppContext();

  const toast = useToast();

  const handleAdd = async () => {
    try {
      const newNote = await app.modals.show<INote>((props) => (
        <NoteModal {...props} />
      ));
      await notesStore.addNote({
        body: newNote,
      });
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

  const handleEdit = async (note: INote) => {
    try {
      const editedNote = await app.modals.show<INote>((props) => (
        <NoteModal {...props} {...note} />
      ));
      await notesStore.editNote({
        body: { _id: id, categoryId: note.categoryId, ...editedNote },
      });
      toast({
        title: "Объявление успешно изменено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка изменения объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDelete = async (note: INote) => {
    try {
      await notesStore.removeNote({ path: { id: note._id } });
      toast({
        title: "Объявление успешно удалено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка удаления объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    notesStore.load();
    if (activeNote.current) scrollToRef(activeNote, true);
  }, []);

  const [notes] = useCellState(() => pagesStore.notes);

  return (
    <Box w={"100%"}>
      {notes.length === 0 && (
        <h2 style={{ textAlign: "center" }}>Объявлений пока нет!</h2>
      )}
      <VStack as={"ul"} align={"streach"} spacing={4}>
        {notes.map((note) => (
          <li key={note._id} ref={id === note._id ? activeNote : null}>
            <Intersection width="100%" height={getBoardCardHeight(note) + "px"}>
              <BoardCard
                noteInfoObj={note}
                activeColor={categoriesStore.getCategoryColor(note.categoryId)}
                onEditIconButtonClick={handleEdit}
                onDeleteIconButtonClick={handleDelete}
                categoryName={
                  categoriesStore.getCategory(categoriesStore.ActiveCategory)
                    .name
                }
              />
            </Intersection>
          </li>
        ))}
      </VStack>

      <RequireAuth role={["admin", "poteryashki"]}>
        {
          // Боже милостивый, прости меня за этот код
          (app.auth.username === "admin" ||
            (app.auth.username === "poteryashki" &&
              categoriesStore.getCategory(categoriesStore.ActiveCategory)
                ?.name === "Потеряшки")) && (
            <Box pos="absolute" right="16" zIndex="1" bottom="16">
              <IconButton
                size="lg"
                isRound
                icon={<AddIcon />}
                onClick={handleAdd}
                aria-label="Add note"
              />
            </Box>
          )
        }
      </RequireAuth>
    </Box>
  );
};

function getBoardCardHeight(note: INote) {
  return 100;
}
