import React from "preact/compat";
import { Navbar, Toast } from "@components";
import { ModalSlot } from "@components/modal";
import { AppProvider } from "@helpers/AppProvider";
import { useRouter } from "../pages/routing";
import styles from "./app.style.module.css";

export const App = () => {
  const {active: {Component}} = useRouter();
  return (
    <AppProvider>
        <div className={styles.main}>
          {Component && <Component />}
          <Navbar/>
          <Toast/>
          <ModalSlot />
          <div id="loader" class={styles.loader}></div>
        </div>
    </AppProvider>
  );
};
