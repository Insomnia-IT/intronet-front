import React from "react";
import { Route } from "wouter";
import { BoardPage } from "./board/board-page";
import { MapPage } from "./map/map-page";
import { VotingPage } from "./voting/voting-page";
import { TimetablePage } from "./timetable/timetable-page";
import { LoginPage } from "./login/login-page";

export function Routing() {
  return (
    <>
      <Route path="/board"> <BoardPage /></Route>
      <Route path="/map"> <MapPage /></Route>
      <Route path="/voting"> <VotingPage /></Route>
      <Route path="/timetable"> <TimetablePage /></Route>
      <Route path="/user-login"> <LoginPage /></Route>
    </>
  )
    ;
}
