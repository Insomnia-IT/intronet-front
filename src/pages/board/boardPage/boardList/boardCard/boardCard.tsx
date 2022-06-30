import * as React from "react";
import { VStack, StackProps } from "@chakra-ui/react";
import { NoteText } from "./noteText/noteText";
import { BtnCopy } from "./btnCopy/btnCopy";
import { Box } from "@chakra-ui/react";
import { Heading } from "src/components/heading/heading";

export interface INotesCard extends StackProps {
  noteInfoObj: INotes;
  activeColor: string;
}

export const BoardCard = ({ noteInfoObj, activeColor, ...res }: INotesCard) => {
  const { title, text, id, categoryId } = noteInfoObj;

  return (
    <Box
      px={4}
      py={5}
      border={"1px solid"}
      borderColor={activeColor}
      borderRadius={"2xl"}
      {...res}
    >
      <VStack align={"flex-start"} spacing={2} pos={"relative"}>
        <Heading level={2}>{title}</Heading>
        <NoteText text={text} />
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
