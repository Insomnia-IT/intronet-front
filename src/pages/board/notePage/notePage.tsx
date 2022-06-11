import { EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, useToast } from "@chakra-ui/react";
import * as React from "react";
import { NoteModal } from "src/components/modals/NoteModal";
import { useAppContext } from "src/helpers/AppProvider";
import { notesStore } from "src/stores";
import Note from "./note/note";

export default function NotePage() {
  // надо заменить wouter на react-router-dom, там есть useParams
  const params = new URLSearchParams(window.location.search);

  const toast = useToast();

  const app = useAppContext();

  const handleEditIconButtonClick = async () => {
    try {
      const note = notesStore.getNote(parseInt(params.get("id")));
      const editedNote = await app.modals.show<INote>((props) => (
        <NoteModal {...props} title={note.title} text={note.text} />
      ));
      await notesStore.editNote({ ...note, ...editedNote });
      toast({
        title: "Объявление успешно изменено!",
        status: "error",
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

  return (
    <>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <Note id={parseInt(params.get("id"))}></Note>
      </div>
      <Box position="absolute" bottom="10" right="10">
        <IconButton
          icon={<EditIcon />}
          aria-label="add article"
          isRound
          size="lg"
          onClick={handleEditIconButtonClick}
        />
      </Box>
    </>
  );
}
