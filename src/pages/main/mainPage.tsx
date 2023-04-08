import { LoginButton } from "@components/loginButton/loginButton";
import { CardList } from "./cardList/cardList";
import { getRandomItem } from "@helpers/getRandomItem";
import { titlesList } from "./titelsList";
import styles from "./main-page.module.css";

export const MainPage = () => {
  return (
    <div class={styles.container}>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}
      <LoginButton />
      <div class={styles.mainPage}>
        <div>
          <div>
            <h1>{getRandomItem(titlesList)}</h1>
          </div>
          <CardList></CardList>
        </div>
      </div>
    </div>
  );
};
