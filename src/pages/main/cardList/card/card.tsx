import { FunctionalComponent } from "preact";
import { RoutePath, useRouter } from "../../../routing";

export const Card: FunctionalComponent<TMainPageCard> = ({
  img,
  title,
  link,
}) => {
  const { goTo } = useRouter();
  return (
    <div>
      <div>
        <h3>
          <a onClick={() => goTo(link as RoutePath)}>{title}</a>
        </h3>
      </div>
      <img src={img} height={"100%"} width={"100%"}></img>
    </div>
  );
};
