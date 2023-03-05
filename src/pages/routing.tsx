import React, { FC } from "preact/compat";
import { MapPageWithRouting } from "./map/map-page";

import { TimetablePage } from "./timetable/timetable-page";
import {Cell} from "@cmmn/cell/lib";
import {useCellState} from "@helpers/cell-state";
import {MainPage} from "./main/mainPage";

export const routes = {
  main: {
    name: 'main',
    title: "Главная",
    Component: MainPage,
  },
  board: {
    name: 'board',
    title: "Объявления",
    Component: null,
  },
  map: {
    name: 'map',
    title: "Карта 2",
    Component: MapPageWithRouting,
  },
  article: {
    name: 'article',
    title: "Статья",
    Component: null,
  },
  timetable: {
    name: 'timetable',
    title: "Расписание",
    Component: TimetablePage,
  },
  directions: {
    name: 'directions',
    title: "Направления",
    Component: null,
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
