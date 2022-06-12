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
import * as React from "react";
import { NoteModal } from "src/components";
import { useAppContext } from "src/helpers/AppProvider";
import { notesStore } from "src/stores";
import { NoteText } from "./noteText/noteText";

export interface INotesCard extends StackProps {
  notesInfoObj: INote;
  activeColor: string;
}

export const BoardCard = ({
  notesInfoObj,
  activeColor,
  ...rest
}: INotesCard) => {
  const toast = useToast();

  const app = useAppContext();

  const { title, text, categoryId, id } = notesInfoObj;

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
    <VStack
      align="flex-start"
      px={4}
      py={5}
      spacing={2}
      border="1px solid"
      borderColor={activeColor}
      borderRadius="2xl"
      {...rest}
    >
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
    </VStack>
  );
};
