import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import * as React from "preact/compat";
import { RequireAuth } from "@components/RequireAuth";
import { useAppContext } from "@helpers/AppProvider";
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
  const { title, text } = noteInfoObj;

  const app = useAppContext();

  // Если у объявления нет никакого контента, и пользователь не обладает редакторскими павами, объявление не отображается.
  if (!title && !text && !app.auth.token) return <></>;

  return (
    <div>
      <VStack align={"flex-start"} spacing={2} pos={"relative"}>
        <h2>{title}</h2>
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

              {/*<Popover placement="bottom" closeOnBlur={false}>*/}
              {/*  <PopoverTrigger>*/}
              {/*    <IconButton*/}
              {/*      icon={<DeleteIcon />}*/}
              {/*      colorScheme="red"*/}
              {/*      aria-label="Delete note"*/}
              {/*    />*/}
              {/*  </PopoverTrigger>*/}
              {/*  <PopoverContent>*/}
              {/*    <PopoverArrow />*/}
              {/*    <PopoverCloseButton />*/}
              {/*    <PopoverBody>*/}
              {/*      Вы уверены, что хотите удалить запись?*/}
              {/*    </PopoverBody>*/}
              {/*    <PopoverFooter>*/}
              {/*      <Button*/}
              {/*        colorScheme="red"*/}
              {/*        onClick={() => onDeleteIconButtonClick?.(noteInfoObj)}*/}
              {/*      >*/}
              {/*        Удалить*/}
              {/*      </Button>*/}
              {/*    </PopoverFooter>*/}
              {/*  </PopoverContent>*/}
              {/*</Popover>*/}
            </HStack>
          )}
        </RequireAuth>

        {/* <BtnCopy
          noteId={id}
          _before={{
            display: "none",
          }}
          h={"16px"}
          w={"max-content"}
          mt={0}
        /> */}

        <Box alignSelf={"flex-end"}>
          <CreatedDate date={noteInfoObj.createdDate} />
        </Box>
      </VStack>
    </div>
  );
};
