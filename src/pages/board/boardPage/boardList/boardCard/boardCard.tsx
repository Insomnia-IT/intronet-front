import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { Heading } from "src/components/heading/heading";
import { RequireAuth } from "src/components/RequireAuth";
import { BtnCopy } from "./btnCopy/btnCopy";
import { NoteText } from "./noteText/noteText";


export interface INotesCard extends StackProps {
  noteInfoObj: INotes;
  activeColor: string;
  onEditIconButtonClick?: (note: INotes) => void;
  onDeleteIconButtonClick?: (note: INotes) => void;
}

export const BoardCard = ({
  noteInfoObj,
  activeColor,
  onEditIconButtonClick,
  onDeleteIconButtonClick,
  ...rest
}: INotesCard) => {
  const { title, text, id, categoryId } = noteInfoObj;

  return (
    <Box
      px={4}
      py={5}
      border={"1px solid"}
      borderColor={activeColor}
      borderRadius={"2xl"}
      {...rest}
    >
      <VStack align={"flex-start"} spacing={2} pos={"relative"}>
        <Heading level={2}>{title}</Heading>
        <NoteText text={text} />

        <RequireAuth>
          <HStack gap="2">
            <IconButton
              icon={<EditIcon />}
              aria-label="Edit note"
              onClick={() => onEditIconButtonClick?.(noteInfoObj)}
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
                <PopoverBody>
                  Вы уверены, что хотите удалить запись?
                </PopoverBody>
                <PopoverFooter>
                  <Button
                    colorScheme="red"
                    onClick={() => onDeleteIconButtonClick?.(noteInfoObj)}
                  >
                    Удалить
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </HStack>
        </RequireAuth>

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
