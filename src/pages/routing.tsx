import React from "react";
import { Route } from "wouter";
import { BoardPage } from "./board/boardPage/boardPage";
import { MapPage } from "./map/map-page";
import { VotingPage } from "./voting/voting-page";
import { TimetablePage } from "./timetable/timetable-page";
import { LoginPage } from "./login/login-page";
import NotePage from './board/notePage/notePage';

export function Routing() {
  return (
    <>
      <Route path="/board"> <BoardPage /></Route>
      <Route path="/map"> <MapPage /></Route>
      <Route path="/voting"> <VotingPage /></Route>
      <Route path="/timetable"> <TimetablePage /></Route>
      <Route path="/user-login"> <LoginPage /></Route>
      <Route path="/board/note"><NotePage /></Route>
    </>
  )
    ;
}
