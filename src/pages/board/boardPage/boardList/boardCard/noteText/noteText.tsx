import * as React from "preact/compat";
import styles from "./noteText.module.css";

export type INoteText = {
  text: INote["text"];
};

const COUNT_CHAR_OF_SHORT_TEXT = 176;

const WrapText = ({ children }: React.PropsWithChildren) => (
  <p className={styles.text} >
    {children}
  </p>
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
      <button onClick={toggleOpen}>
        {isOpen ? "Свернуть" : "Подробнее"}
      </button>
    </WrapText>
  );
};
