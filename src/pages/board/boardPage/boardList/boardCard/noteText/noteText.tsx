import * as React from "preact/compat";
import { Text, TextProps } from "@chakra-ui/react";
import { ToggleBtn } from "./toggleBtn/toggleBtn";

export type INoteText = {
  text: INote["text"];
};

const COUNT_CHAR_OF_SHORT_TEXT = 176;

const WrapText = ({ children, ...res }: React.PropsWithChildren<TextProps>) => (
  <Text as={"p"} fontSize={"sm"} {...res}>
    {children}
  </Text>
);

export const NoteText = ({ text }: INoteText) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  if (!text) return <></>;

  const isBig = text.length > COUNT_CHAR_OF_SHORT_TEXT;
  if (!isBig) return <WrapText>{text}</WrapText>;

  const ending = "...";
  const shortText =
    text.slice(0, COUNT_CHAR_OF_SHORT_TEXT - ending.length) + ending;

  return (
    <WrapText>
      {!isOpen ? shortText : text}{" "}
      <ToggleBtn onClick={toggleOpen}>
        {isOpen ? "Свернуть" : "Подробнее"}
      </ToggleBtn>
    </WrapText>
  );
};
