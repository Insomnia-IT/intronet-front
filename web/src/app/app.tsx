import { Toast } from "../components";
import { AppProvider } from "../helpers/AppProvider";
import { userStore } from "../stores/user.store";
import { useEffect, useRef } from "preact/hooks";
import { useRouter } from "../pages/routing";
import { ModalSlot } from "../components/modal";
import { Snackbar } from "../pages/bookmarks/snackbar/snackbar";
import styles from "./app.style.module.css";
import { scrollStore } from "@stores/scroll.store";

export const App = () => {
  const {
    active: { Component },
    route,
  } = useRouter();
  useEffect(() => {
    switch (route[0]) {
      case "main":
      case "onboard":
        userStore.StatusBarColor = "#0C1035";
        break;
      default:
        userStore.StatusBarColor = "#F7FCFF";
        break;
    }
  }, [route[0]]);
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mainRef.current) return;
    const div = mainRef.current;
    return scrollStore.key.on("change", (e) => {
      scrollStore.scrollTops.set(e.oldValue, div.scrollTop);
      setTimeout(() => {
        div.scrollTop = scrollStore.scrollTops.get(e.value);
      }, 0);
    }) as () => void;
  }, [mainRef.current]);
  return (
    <AppProvider>
      <div className={styles.main} ref={mainRef}>
        {Component && <Component />}
        <Toast />
        <ModalSlot />
        <Snackbar />
      </div>
    </AppProvider>
  );
};
