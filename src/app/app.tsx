import React from "react";
import {Navbar, Toast} from "@components";
import { AppProvider, Modals } from "@helpers/AppProvider";
import styles from "./app.style.module.css";
import {useRouter} from "../pages/routing";
import {ModalSlot} from "@components/modal";

export const App = () => {
  const {active: {Component}} = useRouter();
  return (
    <AppProvider>
        <div className={styles.main}>
          {Component && <Component />}
          <Navbar/>
          <Toast/>
          <ModalSlot />
        </div>
    </AppProvider>
  );
};
