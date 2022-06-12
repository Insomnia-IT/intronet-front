import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  StackProps,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { NoteModal } from "src/components";
import { useAppContext } from "src/helpers/AppProvider";
import { notesStore } from "src/stores";
import * as React from "react";
import { NoteText } from "./noteText/noteText";
import { BtnCopy } from "./btnCopy/btnCopy";
import { Box } from "@chakra-ui/react";

export interface INoteCard extends StackProps {
  notesInfoObj: INote;
  activeColor: string;
}

export const BoardCard = ({
  notesInfoObj,
  activeColor,
  ...rest
}: INoteCard) => {
  const app = useAppContext();

  const { title, text, id, categoryId } = notesInfoObj;

  const toast = useToast();

  const handleEditIconButtonClick = async () => {
    try {
      const editedNote = await app.modals.show<INote>((props) => (
        <NoteModal
          {...props}
          title={title}
          text={text}
          categoryId={categoryId}
        />
      ));
      await notesStore.editNote({ id, categoryId, ...editedNote });
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

  const handleDeleteIconButtonClick = async () => {
    try {
      await notesStore.removeNote({ id });
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

  return (
    <Box
      px={4}
      py={5}
      border={"1px solid"}
      borderColor={activeColor}
      borderRadius="2xl"
      {...rest}
    >
      <VStack align={"flex-start"} spacing={2} pos={"relative"}>
        <Heading as="h3" size={"md"}>
          {title}
        </Heading>
        <NoteText text={text} />
        <HStack gap="2">
          <IconButton
            icon={<EditIcon />}
            aria-label="Edit note"
            onClick={handleEditIconButtonClick}
          />
          <Popover placement="bottom" closeOnBlur={false}>
            <PopoverTrigger>
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                aria-label="Delete note"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>Вы уверены, что хотите удалить запись?</PopoverBody>
              <PopoverFooter>
                <Button colorScheme="red" onClick={handleDeleteIconButtonClick}>
                  Удалить
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </HStack>
        <BtnCopy
          noteId={id}
          categoryId={categoryId}
          _before={{
            display: "none",
          }}
          h={"16px"}
          w={"max-content"}
          mt={0}
        />
      </VStack>
    </Box>
  );
};
