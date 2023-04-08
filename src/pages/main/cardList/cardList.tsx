import { FunctionalComponent } from "preact";
import { Card } from "./card/card";
import { cardContentList } from "./cardContentList";

export const CardList: FunctionalComponent = () => {
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
