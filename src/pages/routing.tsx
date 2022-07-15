import React, { FC } from "react";
import { BoardPage } from "./board/boardPage/boardPage";
import { MainPage } from "./main/mainPage";
import { MapPageWithRouting } from "./map/map-page";

import { useRoutes, Navigate } from "react-router-dom";
import { TimetablePage } from "./timetable/timetable-page";
import { ArticlePageWithId } from "./articles/articlePage/articlePage";
import { DirectionsPage } from "./map/mapElement";

export const NAVBAR_ROUTES = [
  {
    text: "Главная",
    path: "/main",
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
    element: <MapPageWithRouting />,
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
    text: "Redirect to map",
    path: "/",
    element: <Navigate replace to={"/map"}></Navigate>,
  },
  {
    text: "Статья",
    path: "/article/:id",
    element: <ArticlePageWithId></ArticlePageWithId>,
  },
  {
    text: "Направления",
    path: "/directions",
    element: <DirectionsPage />,
  },
  {
    text: "Локация",
    path: "/map/:locationId",
    element: <MapPageWithRouting />,
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
