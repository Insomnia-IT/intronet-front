import React, { FC } from "react";
import { BoardPage } from "./board/boardPage/boardPage";
import { MainPage } from "./main/mainPage";
import { MapPageWithRouting } from "./map/map-page";

import { TimetablePage } from "./timetable/timetable-page";
import { ArticlePageWithId } from "./articles/articlePage/articlePage";
import { DirectionsPage } from "./map/mapElement";
import {Cell} from "@cmmn/cell/lib";
import {useCellState} from "../helpers/cell-state";

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

const routeCell = new Cell<Array<string |number>>(location.pathname.split('/').slice(1))
const goTo = (path: (string | null | number)[], replace: boolean = false) => {
  routeCell.set(path.filter(x => x !== null));
  const url = '/'+path.filter(x => x !== null).join('/');
  history[replace ? 'replaceState' : 'pushState'](null, null, url)
};
window.addEventListener('popstate',  () => {
  routeCell.set(location.pathname.split('/').slice(1));
});
if (location.pathname === '/'){
  goTo(['map'], true);
}

export function useRouter(){
  const [route] = useCellState(() => routeCell.get());

  return {
    back: history.back.bind(history),
    route,
    active: routes[route[0]] ?? routes.map,
    goTo
  }
}
