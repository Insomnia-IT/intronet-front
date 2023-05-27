import { Logo } from "@icons";
import styles from "./main-page.module.css";
import { CardList, Sections } from "./card-list";
import { MainCard } from "./card/main-card";
import { Menu } from "./menu/menu";

export const MainPage = () => {
  return (
    <div class={styles.container}>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}

      <div class={styles.mainPage} flex column gap="6">
        <Logo />
        {Sections.map((x) => (
          <div key={x.section} flex column gap="2">
            <h2 class="colorWhite">{x.title}</h2>
            <div flex column gap="1">
              {Array.from(
                CardList.filter((c) => c.section === x.section)
                  .groupBy((x) => x.row)
                  .entries()
              ).map(([row, cards]) => (
                <div flex gap="1">
                  {cards.map((c) => (
                    <MainCard info={c} key={c} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Menu />
      </div>
    </div>
  );
};
