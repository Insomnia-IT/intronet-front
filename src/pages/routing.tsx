import { MapPageWithRouting } from "./map/map-page";

import { TimetablePage } from "./timetable/timetable-page";
import { Cell } from "@cmmn/cell/lib";
import { useCell } from "@helpers/cell-state";
import { MainPage } from "./main/mainPage";
import { compare } from "@cmmn/cell/lib";
import { BookmarksPage } from "./bookmarks/bookmarks-page";
import { VotingPage } from "./voting/voting-page";
import {
  StateUpdater,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";
import { OnboardPage } from "./onboard/onboard-page";
import { ActivitiesPage } from "./activities/activities-page";

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
  activities: {
    name: "activities",
    title: "НеАнимация",
    Component: ActivitiesPage,
  },
  timetable: {
    name: "timetable",
    title: "Расписание",
    Component: TimetablePage,
  },
  locations: {
    name: "locations",
    title: "Направления",
    Component: null,
  },
  voting: {
    name: "voting",
    title: "Голосование",
    Component: VotingPage,
  },
  bookmarks: {
    name: "bookmarks",
    title: "Избранное",
    Component: BookmarksPage,
  },
  onboard: {
    name: "onboard",
    title: "Onboarding",
    Component: OnboardPage,
  },
};

export type RoutePath =
  | [keyof typeof routes, ...Array<string | number>]
  | [keyof typeof routes, ...Array<string | number>, Record<string, string>];
export type RoutePathString =
  | `/${keyof typeof routes}/${string}`
  | `/${keyof typeof routes}`;
const routeCell = new Cell<RoutePath>(
  location.pathname.split("/").slice(1) as RoutePath,
  {
    compare,
    onExternal: setTitle,
  }
);
const queryCell = new Cell<Record<string, string>>(
  Object.fromEntries(new URL(location.href).searchParams.entries())
);

function setTitle() {
  document.title = "Insomnia: " + routes[routeCell.get()[0]]?.title;
}
setTitle();
const goTo = (
  path: RoutePath | RoutePathString,
  query: Record<string, string> = {},
  replace: boolean = false
) => {
  if (typeof path === "string") {
    const url = new URL(location.origin + path);
    path = url.pathname.split("/").slice(1) as RoutePath;
    query = Object.fromEntries(url.searchParams.entries());
  }
  if (typeof path[path.length - 1] === "object") {
    query = path.pop() as Record<string, string>;
  }
  routeCell.set(path.filter((x) => x !== null) as RoutePath);
  queryCell.set(query);
  let url = "/" + path.filter((x) => x !== null).join("/");
  const search = new URLSearchParams(query).toString();
  if (search) url += "?" + search;
  history[replace ? "replaceState" : "pushState"]({}, null, url);
};
window.addEventListener("popstate", () => {
  routeCell.set(location.pathname.split("/").slice(1) as RoutePath);
  queryCell.set(
    Object.fromEntries(new URL(location.href).searchParams.entries())
  );
  historyStateCell.set(history.state);
});
if (location.pathname === "/") {
  goTo(["onboard"], {}, true);
}

export function useRouter<TQuery extends Record<string, string> = {}>() {
  const route: RoutePath = useCell(routeCell);
  const query = useCell(queryCell) as TQuery;
  useEffect(() => {
    if (!routes[route[0]]) {
      goTo(["onboard"]);
    }
  }, [route[0]]);
  return {
    back: history.back.bind(history),
    route,
    query,
    active: routes[route[0]] ?? routes.main,
    goTo,
  };
}
// history.scrollRestoration = "auto";
export const historyStateCell = new Cell<Record<string, any>>(
  {},
  {
    tap: (v) => {
      console.log(v);
      history.replaceState(v, "", location.href);
    },
  }
);
export function useHistoryState<S>(
  name: string,
  initial: S
): [S, StateUpdater<S>] {
  const state = useCell(() => historyStateCell.get()[name] ?? initial) as S;
  useState();
  const setState = useCallback<StateUpdater<S>>((v) => {
    const curent = historyStateCell.get();
    if (typeof v === "function") v = (v as Function)(curent[name]) as S;
    historyStateCell.set({
      ...curent,
      [name]: v,
    });
  }, []);
  return [state, setState];
}
