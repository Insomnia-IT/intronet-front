import {userStore} from "@stores/user.store";
import {ArticlePage} from "./articles/articlePage/articlePage";
import { MapPageWithRouting } from "./map/map-page";

import { TimetablePage } from "./timetable/timetable-page";
import { Cell } from "@cmmn/cell/lib";
import { useCell } from "@helpers/cell-state";
import { MainPage } from "./main/mainPage";
import { compare } from "@cmmn/cell/lib";
import { BookmarksPage } from "./bookmarks/bookmarks-page";
import { VotingPage } from "./voting/voting-page";
import { StateUpdater, useCallback, useEffect, useState } from "preact/hooks";
import { OnboardPage } from "./onboard/onboard-page";
import { NotesPage } from "./notes/NotesPage";
import { ActivitiesPage } from "./activities/activities-page";

export const routes = {
  main: {
    name: "main",
    title: "Главная",
    Component: MainPage,
  },
  notes: {
    name: "notes",
    title: "Объявления",
    Component: NotesPage,
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
  articles: {
    name: "articles",
    title: "Статьи",
    Component: ArticlePage,
  },
};

export type RoutePath =
  | [keyof typeof routes, ...Array<string | number>]
  | [keyof typeof routes, ...Array<string | number>, Record<string, string>];
export type RoutePathString =
  | `/${keyof typeof routes}/${string}`
  | `/${keyof typeof routes}?${string}`
  | `/${keyof typeof routes}`;
const routeCell = new Cell<RoutePath>(
  location.pathname.split("/").slice(1) as RoutePath,
  { compare }
);
const queryCell = new Cell<Record<string, string>>(
  Object.fromEntries(new URL(location.href).searchParams.entries())
);

export const routerCell = new Cell(() => {
  const route = routeCell.get();
  const query = queryCell.get()
  return {
    back: history.back.bind(history),
    route,
    query,
    active: routes[route[0]] ?? routes.main,
    goTo,
  }
})

function onRoutingChange(e: {oldValue: RoutePath, value: RoutePath} ){
  document.title = "Insomnia: " + routes[e.value[0]]?.title;
  userStore.log({
    action: 'navigate',
    from: e.oldValue.join('/')
  }).catch();
}
routeCell.on('change', onRoutingChange)

onRoutingChange({
  value: routeCell.get(),
  oldValue: [] as any
});
export const goTo = (
  path: RoutePath | RoutePathString,
  query: Record<string, string> | undefined = queryCell.get(),
  replace: boolean = false
) => {
  console.log(path, query)
  if (typeof path === "string") {
    const url = new URL(location.origin + path);
    path = url.pathname.split("/").slice(1) as RoutePath;
    query ??= Object.fromEntries(url.searchParams.entries());
  }
  if (typeof path[path.length - 1] === "object") {
    query = path.pop() as Record<string, string>;
  }
  routeCell.set(path.filter((x) => x !== null) as RoutePath);
  query && queryCell.set(query);
  let url = "/" + path.filter((x) => x !== null).join("/");
  const search = new URLSearchParams(query ?? queryCell.get()).toString();
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
  const router = useCell(routerCell);
  useEffect(() => {
    if (!routes[router.route[0]]) {
      goTo(["onboard"]);
    }
  }, [router.route[0]]);
  return router;
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
