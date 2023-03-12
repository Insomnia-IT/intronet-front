import React from "preact/compat";
import styles from "./btnCopy.module.css";

interface BtnCopyProps {
  noteId: INote["_id"];
  show?: boolean;
}

export function BtnCopy({show = true, noteId, ...rest}: BtnCopyProps) {
  const [ isCopied, setIsCopied ] = React.useState(false);
  const copyUrl = () => {
    if (isCopied) return;
    const currentUrl = document.location.host;
    navigator.clipboard
      .writeText(currentUrl + "/board?id=" + noteId.toString())
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied((prev) => !prev), 3000);
      });
  };
  return (
    <>
      { show && (
        <button
          className={ styles.button }
          onClick={ copyUrl }
          { ...rest }
        >
          { !isCopied ? "Копировать ссылку" : "Скопировано" }
        </button>
      ) }
    </>
  );
}
