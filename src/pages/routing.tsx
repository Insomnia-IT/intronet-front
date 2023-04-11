import { MapPageWithRouting } from "./map/map-page";

import { TimetablePage } from "./timetable/timetable-page";
import { Cell } from "@cmmn/cell/lib";
import { useCell } from "@helpers/cell-state";
import { MainPage } from "./main/mainPage";
import { compare } from "@cmmn/cell/lib";

export const routes = {
  main: {
    name: "main",
    title: "Главная",
    Component: MainPage,
  },
  board: {
    name: "board",
    title: "Объявления",
    Component: null,
  },
  map: {
    name: "map",
    title: "Карта 2",
    Component: MapPageWithRouting,
  },
  article: {
    name: "article",
    title: "Статья",
    Component: null,
  },
  timetable: {
    name: "timetable",
    title: "Расписание",
    Component: TimetablePage,
  },
  directions: {
    name: "directions",
    title: "Направления",
    Component: null,
  },
  voting: {
    name: "voting",
    title: "Голосование",
    Component: null,
  },
};

export type RoutePath = [keyof typeof routes, ...Array<string | number>];
const routeCell = new Cell<RoutePath>(
  location.pathname.split("/").slice(1) as RoutePath,
  {
    compare,
    onExternal: setTitle,
  }
);

function setTitle() {
  document.title = "Insomnia: " + routes[routeCell.get()[0]]?.title;
}
setTitle();
const goTo = (path: RoutePath, replace: boolean = false) => {
  routeCell.set(path.filter((x) => x !== null) as RoutePath);
  const url = "/" + path.filter((x) => x !== null).join("/");
  history[replace ? "replaceState" : "pushState"](null, null, url);
};
window.addEventListener("popstate", () => {
  routeCell.set(location.pathname.split("/").slice(1) as RoutePath);
});
if (location.pathname === "/") {
  goTo(["map"], true);
}

export function useRouter() {
  const route: RoutePath = useCell(routeCell);

  return {
    back: history.back.bind(history),
    route,
    active: routes[route[0]] ?? routes.map,
    goTo,
  };
}
