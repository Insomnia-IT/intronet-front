import React from "react";
import style from "./app.style.module.css";
import { Routing } from "../pages/routing";
import { Container } from "react-bulma-components";
import Navbar from "../navbar/navbar";
import { BulmaProvider, Modals } from "src/helpers/BulmaProvider";

export function App() {
  return (
    <BulmaProvider>
      <div className={style.main}>
        <Container>
          <Navbar />
        </Container>
        <Routing />
      </div>
      <Modals />
    </BulmaProvider>
  );
}
