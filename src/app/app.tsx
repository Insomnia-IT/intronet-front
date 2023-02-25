import React from "react";
import { Navbar } from "src/components";
import { AppProvider, Modals } from "src/helpers/AppProvider";
import styles from "./app.style.module.css";
import {useRouter} from "../pages/routing";

export const App = () => {
  const {active: {Component}} = useRouter();
  return (
    <AppProvider>
        <div className={styles.main}>
          <Component />
          <Navbar/>
        </div>
    </AppProvider>
  );
};
