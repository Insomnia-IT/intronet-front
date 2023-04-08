import React from "preact";
import { FunctionalComponent } from "preact";
import {useRouter} from "../../../routing";

export const Card: FunctionalComponent<TMainPageCard> = ({ img, title, link }) => {
  const {goTo} = useRouter();
  return (
    <div>
      <div>
        <h3>
          <a onClick={() => goTo(link)}>
            {title}
          </a>
        </h3>
      </div>
      <img
        src={img}
        height={"100%"}
        width={"100%"}
      ></img>
    </div>
  );
};
