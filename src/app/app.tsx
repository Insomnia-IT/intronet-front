import { Toast } from "@components";
import { AppProvider } from "@helpers/AppProvider";
import {userStore} from "@stores/user.store";
import {useEffect} from "preact/hooks";
import styles from "./app.style.module.css";
import { useRouter } from "../pages/routing";
import { ModalSlot } from "@components/modal";

export const App = () => {
  const {
    active: { Component },
    route
  } = useRouter();
  useEffect(() => {
    switch (route[0]){
      case 'main':
      case 'onboard':
        userStore.StatusBarColor = '#0C1035';
        break;
      default:
        userStore.StatusBarColor = '#F7FCFF';
        break;
    }
  }, [route])
  return (
    <AppProvider>
      <div className={styles.main}>
        {Component && <Component />}
        <Toast />
        <ModalSlot />
      </div>
    </AppProvider>
  );
};
