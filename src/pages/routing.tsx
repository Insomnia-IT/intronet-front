import React, { FC } from "react";
import { BoardPage } from "./board/boardPage/boardPage";
import { MapPage } from "./map/map-page";
import { VotingPage } from "./voting/voting-page";
import { MainPage } from "./main/mainPage";
import { ArticlePage } from "./articles/articlePage/articlePage";

import { useRoutes } from "react-router-dom";
export const ROUTES = [
  {
    text: "Главная",
    path: "/",
    element: <MainPage />,
  },
  {
    text: "Статья",
    path: "/article/:id",
    element: <ArticlePage></ArticlePage>,
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
    text: "Голосование",
    path: "/voting",
    element: <VotingPage />,
  },
];

export const Routing: FC = () => {
  return useRoutes(ROUTES);
};
