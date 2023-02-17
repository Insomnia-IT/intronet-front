import React, { FC } from "react";
import { BoardPage } from "./board/boardPage/boardPage";
import { MainPage } from "./main/mainPage";
import { MapPageWithRouting } from "./map/map-page";

import { TimetablePage } from "./timetable/timetable-page";
import { ArticlePageWithId } from "./articles/articlePage/articlePage";
import { DirectionsPage } from "./map/mapElement";

export const routes = {
  main: {
    name: 'main',
    title: "Главная",
    Component: MainPage,
  },
  board: {
    name: 'board',
    title: "Объявления",
    Component: BoardPage,
  },
  map: {
    name: 'map',
    title: "Карта",
    Component: MapPageWithRouting,
  },
  article: {
    name: 'article',
    title: "Статья",
    Component: ArticlePageWithId,
  },
  timetable: {
    name: 'timetable',
    title: "Расписание",
    Component: TimetablePage,
  },
  directions: {
    name: 'directions',
    title: "Направления",
    Component: DirectionsPage,
  }
};

export function useRouter(){
  const [route, setRoute] = React.useState<Array<string |number>>(location.pathname.split('/'));
  const goTo = React.useCallback((path: (string | null | number)[], replace: boolean = false) => {
    setRoute(path.filter(x => x !== null));
    (replace ? history.replaceState : history.pushState)(undefined, undefined,
      '/'+path.filter(x => x !== null).join('/'))
  }, []);
  React.useEffect(() => {
    if (route.length === 0){
      goTo(['map'], true);
    }
  }, route);
  React.useEffect(() => {
    const listener = () => {
      setRoute(location.pathname.split('/'));
    };
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, []);
  return {
    back: history.back.bind(history),
    route,
    active: routes[route[0]] ?? routes.map,
    goTo
  }
}
