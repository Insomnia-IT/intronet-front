import { Heading, StackProps, VStack } from "@chakra-ui/react";
import * as React from "react";
import { NoteText } from "./noteText/noteText";

export interface INotesCard extends StackProps {
  notesInfoObj: INote;
  activeColor: string;
}

export const BoardCard = ({
  notesInfoObj,
  activeColor,
  ...res
}: INotesCard) => {
  const { title, text, categoryId } = notesInfoObj;

  return (
    <VStack
      align={"flex-start"}
      px={4}
      py={5}
      spacing={2}
      border={"1px solid"}
      borderColor={activeColor}
      borderRadius={"2xl"}
      {...res}
    >
      <Heading as="h3" size={"md"}>
        {title}
      </Heading>
      <NoteText text={text} />
    </VStack>
  );
};
