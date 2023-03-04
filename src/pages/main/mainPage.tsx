import * as React from "react";
import { LoginButton } from "@components/loginButton/loginButton";
import { CardList } from "./cardList/cardList";
import { getRandomItem } from "@helpers/getRandomItem";
import { titlesList } from "./titelsList";

export const MainPage = () => {
  return (
    <>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}
      <LoginButton />
      <div h={"100%"} overflowY={"auto"} className={"hide-scrollbar"}>
        <div
          spacing={4}
          align={"flex-start"}
          w={"100%"}
          maxH={"100%"}
          pt={16}
        >
          <div
            pb={5}
            display={"flex"}
            w={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <h1>{getRandomItem(titlesList)}</h1>
          </div>
          <CardList></CardList>
        </div>
      </div>
    </>
  );
};
