import { AddIcon } from "@chakra-ui/icons";
import { Box, IconButton, useToast, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { NoteModal } from "src/components";
import { RequireAuth } from "src/components/RequireAuth";
import { useAppContext } from "src/helpers/AppProvider";
import { categoriesStore, notesStore, pagesStore } from "src/stores";
import { Intersection } from "../../../../components/intersection";
import { scrollToRef } from "../../../../helpers/scrollToRef";
import { BoardCard } from "./boardCard/boardCard";

export const BoardList: FC = () => {
  const { id } = useParams();

  const activeNote = useRef<HTMLLIElement>(null);

  const app = useAppContext();

  const toast = useToast();

  const handleAdd = async () => {
    try {
      const newNote = await app.modals.show<INotes>((props) => (
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

  const handleEdit = async (note: INotes) => {
    try {
      const editedNote = await app.modals.show<INotes>((props) => (
        <NoteModal {...props} {...note} />
      ));
      await notesStore.editNote({
        body: { id, categoryId: note.categoryId, ...editedNote },
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

  const handleDelete = async (note: INotes) => {
    try {
      await notesStore.removeNote({ path: { id: note.id } });
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

  return (
    <Box w={"100%"}>
      {pagesStore.notes.length === 0 && (
        <h2 style={{ textAlign: "center" }}>Объявлений пока нет!</h2>
      )}
      <VStack as={"ul"} align={"streach"} spacing={4}>
        {pagesStore.notes.map((note) => (
          <li key={note.id} ref={parseInt(id) === note.id ? activeNote : null}>
            <Intersection width="100%" height="200px">
              <BoardCard
                noteInfoObj={note}
                activeColor={categoriesStore.getCategoryColor(note.categoryId)}
                onEditIconButtonClick={handleEdit}
                onDeleteIconButtonClick={handleDelete}
              />
            </Intersection>
          </li>
        ))}
      </VStack>

      <RequireAuth>
        <Box pos="absolute" right="16" zIndex="1" bottom="16">
          <IconButton
            size="lg"
            isRound
            icon={<AddIcon />}
            onClick={handleAdd}
            aria-label="Add note"
          />
        </Box>
      </RequireAuth>
    </Box>
  );
};
