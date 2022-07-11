import React, { FC } from "react";
import { BoardPage } from "./board/boardPage/boardPage";
import { MainPage } from "./main/mainPage";
import { MapPage } from "./map/map-page";

import { useRoutes } from "react-router-dom";
import { TimetablePage } from "./timetable/timetable-page";
import { ArticlePageWithId } from "./articles/articlePage/articlePage";

export const NAVBAR_ROUTES = [
  {
    text: "Главная",
    path: "/",
    element: <MainPage />,
  },
  {
    text: "Объявления",
    path: "/board",
    element: <BoardPage />,
  },
  {
    text: "Карта",
    path: "/map",
    element: <MapPage />,
  },
  {
    text: "Расписание",
    path: "/timetable",
    element: <TimetablePage />,
  },
];

export const ALL_ROUTES = [
  ...NAVBAR_ROUTES,
  {
    text: "Статья",
    path: "/article/:id",
    element: <ArticlePageWithId></ArticlePageWithId>,
  },
  // {
  //   text: "Голосование",
  //   path: "/voting",
  //   element: <VotingPage />,
  // },
];

export const Routing: FC = () => {
  return useRoutes(ALL_ROUTES);
};
