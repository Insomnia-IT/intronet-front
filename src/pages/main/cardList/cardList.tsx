import React, { FC } from "preact/compat";
import { Card } from "./card/card";
import { cardContentList } from "./cardContentList";

export const CardList: FC = () => {
  return (
    <div>
      {cardContentList.map((cardObj, index) => (
        <div>
          <div>
            <Card {...cardObj}></Card>
          </div>
        </div>
      ))}
    </div>
  );
};
