import { Navbar, Toast } from "@components";
import { AppProvider, Modals } from "@helpers/AppProvider";
import styles from "./app.style.module.css";
import { useRouter } from "../pages/routing";
import { ModalSlot } from "@components/modal";
import { useCell } from "@helpers/cell-state";
import { authStore } from "@stores/auth.store";

export const App = () => {
  const {
    active: { Component },
  } = useRouter();
  const uid = useCell(() => authStore.uid);
  return (
    <AppProvider>
      <div className={styles.main}>
        {Component && <Component />}
        <Navbar />
        <Toast />
        <ModalSlot />
        <div id="loader" class={styles.loader} />
      </div>
    </AppProvider>
  );
};
