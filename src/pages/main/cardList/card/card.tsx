import React from "preact/compat";
import { FC } from "preact/compat";
import {useRouter} from "../../../routing";

export const Card: FC<TMainPageCard> = ({ img, title, link }) => {
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
