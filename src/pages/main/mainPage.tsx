import * as React from "preact/compat";
import { LoginButton } from "@components/loginButton/loginButton";
import { CardList } from "./cardList/cardList";
import { getRandomItem } from "@helpers/getRandomItem";
import { titlesList } from "./titelsList";

export const MainPage = () => {
  return (
    <>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}
      <LoginButton />
      <div className={"hide-scrollbar"}>
        <div>
          <div>
            <h1>{getRandomItem(titlesList)}</h1>
          </div>
          <CardList></CardList>
        </div>
      </div>
    </>
  );
};
