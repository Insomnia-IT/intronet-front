import { LinkIcon } from "@chakra-ui/icons";
import { Link, LinkProps, Text } from "@chakra-ui/react";
import * as React from "preact/compat";

interface IBtnCopy extends LinkProps {
  noteId: INote["_id"];
  show?: boolean;
}

export const BtnCopy = ({ show = true, noteId, ...rest }: IBtnCopy) => {
  const [isСopied, setIsCopied] = React.useState(false);
  const copyUrl = () => {
    if (isСopied) return;
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
      {show && (
        <Link
          onClick={copyUrl}
          variant={"brandLinkClickable"}
          as={"button"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          {...rest}
        >
          <LinkIcon display={"block"} />
          <Text>{!isСopied ? "Копировать ссылку" : "Скопировано"}</Text>
        </Link>
      )}
    </>
  );
};
