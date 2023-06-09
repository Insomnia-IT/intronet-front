import {useCell} from "@helpers/cell-state";
import { Logo } from "@icons";
import {mainPageStore} from "@stores/main-page.store";
import styles from "./main-page.module.css";
import { MainCard } from "./card/main-card";
import { Menu } from "./menu/menu";

export const MainPage = () => {
  const state = useCell(mainPageStore.State);
  return (
    <div class={styles.container}>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}

      <div class={styles.mainPage} flex column gap="6">
        <Logo />
        {state.sections.map((x) => (
          <div key={x.section} flex column gap="2">
            <h2 class="colorWhite">{x.title}</h2>
            <div flex column gap="1">
              {x.rows.map(({row, cards}) => (
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
