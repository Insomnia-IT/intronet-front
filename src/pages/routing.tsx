import React from "react";
import { Route } from "wouter";
import { BoardPage } from "./board/boardPage/boardPage";
import { MapPage } from "./map/map-page";
import { VotingPage } from "./voting/voting-page";
import { TimetablePage } from "./timetable/timetable-page";
import { LoginPage } from "./login/login-page";
import { AdminLocationsPage } from "./admin/locations/admin.locations-page";

export const ROUTES = [
  {
    text: "Главная",
    link: "/",
    element: <TimetablePage />,
  },
  {
    text: "Объявления",
    link: "/board",
    element: <BoardPage />,
  },
  {
    text: "Карта",
    link: "/map",
    element: <MapPage />,
  },
  {
    text: "Голосование",
    link: "/voting",
    element: <VotingPage />,
  },
  // {
  //   text: 'Вход по билетам',
  //   link: '/user-login',
  //   element: <LoginPage />
  // }
];

export function Routing() {
  return (
    <>
      <Route path="/board">
        <BoardPage />
      </Route>
      <Route path="/map">
        <MapPage />
      </Route>
      <Route path="/voting">
        <VotingPage />
      </Route>
      <Route path="/">
        <TimetablePage />
      </Route>
      <Route path="/user-login">
        <LoginPage />
      </Route>
      <Route path="/admin/locations">
        <AdminLocationsPage />
      </Route>
    </>
  );
}
