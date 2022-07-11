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
import { useAppContext } from "src/helpers/AppProvider";
import { BtnCopy } from "./btnCopy/btnCopy";
import { CreatedDate } from "./createdDate/createdDate";
import { NoteText } from "./noteText/noteText";

export interface IBoardCard extends StackProps {
  noteInfoObj: INote;
  activeColor: string;
  categoryName?: ICategory["name"];
  onEditIconButtonClick?: (note: INote) => void;
  onDeleteIconButtonClick?: (note: INote) => void;
}

export const BoardCard = ({
  noteInfoObj,
  activeColor,
  onEditIconButtonClick,
  onDeleteIconButtonClick,
  categoryName,
  ...rest
}: IBoardCard) => {
  const { title, text, id, categoryId } = noteInfoObj;

  const app = useAppContext();

  return (
    <Box
      px={4}
      py={5}
      pb={2}
      border={"1px solid"}
      borderColor={activeColor}
      borderRadius={"2xl"}
      {...rest}
    >
      <VStack align={"flex-start"} spacing={2} pos={"relative"}>
        <Heading level={2}>{title}</Heading>
        <NoteText text={text} />

        <RequireAuth role={["admin", "poteryashki"]}>
          {(app.auth.username === "admin" ||
            (app.auth.username === "poteryashki" &&
              categoryName === "Потеряшки")) && (
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
          )}
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

        <Box alignSelf={"flex-end"}>
          <CreatedDate date={noteInfoObj.createdDate} />
        </Box>
      </VStack>
    </Box>
  );
};
