import {Sheet} from "@components";
import {useCell} from "@helpers/cell-state";
import { Logo } from "@icons";
import {mainPageStore} from "@stores/main-page.store";
import {useMemo} from "preact/hooks";
import {RoutePath, useRouter} from "../routing";
import styles from "./main-page.module.css";
import { MainCard } from "./card/main-card";
import { Menu } from "./menu/menu";
import {AddNews} from "./news/add-news";
import {AllNews} from "./news/all-news";
import {EditNews} from "./news/edit-news";
import {News} from "./news/news";

export const MainPage = () => {
  const state = useCell(mainPageStore.State);
  const router = useRouter();
  const sheetItems = useMemo(() => getSheetItems(router.route), [router.route])
  return (
    <div class={styles.container + " dark"}>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}
      <div class={styles.mainPage} flex column gap="6">
        <Logo />
        <News/>
        {state.sections.map((x) => (
          <div key={x.section} flex column gap="2">
            <h2 class="colorWhite">{x.title}</h2>
            <div flex column gap="1">
              {x.rows.map(({row, cards}) => (
                <div gap="1" flex>
                  {cards.map((c) => (
                    <MainCard info={c} key={c}/>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Menu />
        <Sheet children={sheetItems}
               height={router.route[2] === undefined ? 'auto' : '100%'}
               onClose={() => router.goTo(["main"])}/>
      </div>
    </div>
  );
};


function getSheetItems(route: RoutePath){
  switch (route[1]){
    case "news": switch (route[2]){
      case "add": return <AddNews/>;
      case undefined: return <AllNews/>;
      default: return <EditNews/>;
    }

  }
  return null;
}
