import { getRandomItem } from "@helpers/getRandomItem";
import { titlesList } from "./titelsList";
import styles from "./main-page.module.css";
import {useCallback} from "preact/hooks";

export const MainPage = () => {
  const setRef = useCallback((div: HTMLDivElement) =>{
    if (div){
      div.prepend(LogoContainer.logo!)
    }
  }, []);
  return (
    <div class={styles.container}>
      {/* Login button - кнопка для админов, невидимая, располагается в правом верхнем углу экрана */}
      <div class={styles.mainPage} ref={setRef}>
        <div>
          <div>
            <h1>{getRandomItem(titlesList)}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LogoContainer: {
  logo?: SVGSVGElement
} = {};
