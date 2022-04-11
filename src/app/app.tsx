import React from "react";
import style from "./app.style.module.css";
import {Routing} from "../pages/routing";
import { Menu } from "../menu/menu";

export function App() {
  return (
    <div className={style.main}>
      <Menu/>
      <Routing />
    </div>
  );
}
