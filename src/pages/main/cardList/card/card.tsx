import React from "react";
import { FC } from "react";
import {useRouter} from "../../../routing";

export const Card: FC<TMainPageCard> = ({ img, title, link }) => {
  const {goTo} = useRouter();
  return (
    <div
      pos={"relative"}
      spacing={0}
      align={"flex-start"}
      // p={2}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={16}
      boxSize={"100%"}
      justifyContent={"space-between"}
    >
      <div
        pos={"absolute"}
        top={0}
        right={0}
        bottom={0}
        left={0}
        p={[4, 5]}
        // pl={3}
      >
        <h3>
          <a onClick={() => goTo(link)}>
            {title}
          </a>
        </h3>
      </div>
      <img
        src={img}
        height={"100%"}
        width={"100%"}
      ></img>
    </div>
  );
};
