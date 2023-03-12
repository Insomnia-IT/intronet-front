import React from "preact/compat";
import { FC } from "preact/compat";
import { useRouter } from "../../../routing";
import styles from "./card.module.css";

export const Card: FC<TMainPageCard> = ({img, title, link}) => {
  const {goTo} = useRouter();

  return (
    <div className={ styles.container }>
      <a
        className={ styles.title }
        onClick={ () => goTo(link) }>
        { title }
      </a>

      <img
        src={ img }
        height={ "100%" }
        width={ "100%" }
      ></img>
    </div>
  );
};
