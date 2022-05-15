import React from "react";
import style from "./app.style.module.css";
import { Routing } from "../pages/routing";
import { Block, Columns, Container } from "react-bulma-components";
import Navbar from "../navbar/navbar";
import { BulmaProvider, Modals } from "src/helpers/BulmaProvider";

export function App() {
  return (
    <BulmaProvider>
      <div className={style.main}>
        <Container>
          <Block>
            <Navbar />
          </Block>
          <Block>
            <Columns>
              <Routing />
            </Columns>
          </Block>
        </Container>
      </div>
      <Modals />
    </BulmaProvider>
  );
}
