import React, { FC } from "react";
import { BoardPage } from "./board/boardPage/boardPage";
import { MainPage } from "./main/mainPage";
import { MapPage } from "./map/map-page";

import { useRoutes } from "react-router-dom";
import { TimetablePage } from "./timetable/timetable-page";

export const ROUTES = [
  {
    text: "Главная",
    path: "/",
    element: <MainPage />,
  },
  // {
  //   text: "Статья",
  //   path: "/article/:id",
  //   element: <ArticlePageWithId></ArticlePageWithId>,
  // },
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
  // {
  //   text: "Голосование",
  //   path: "/voting",
  //   element: <VotingPage />,
  // },
  {
    text: "Расписание",
    path: "/timetable",
    element: <TimetablePage />,
  },
];

export const Routing: FC = () => {
  return useRoutes(ROUTES);
};
