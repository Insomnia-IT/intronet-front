import { FunctionalComponent } from "preact";
import { Button, ButtonsBar } from "@components";
import Styles from "./bookmark-plug.module.css";
import { RoutePath, RoutePathString } from "../../../pages/routing";

export interface BookmarkPlugProps {
  text: string[];
  buttonTitle: string;
  route: RoutePath | RoutePathString;
}

export const BookmarkPlug: FunctionalComponent<BookmarkPlugProps> = ({
                                                                       buttonTitle,
                                                                       text,
                                                                       route
                                                                     }) => {
  return (
    <>
      <div className={ Styles.container }>
        <h2 className="colorMediumBlue">{ ('тут пока пусто').toUpperCase() }</h2>
        <div flex column style={ 'gap: 12px' }>
          { text.map((block) => <span className="text colorMediumBlue">{ block }</span>) }
        </div>
      </div>

      <ButtonsBar at="bottom">
        <Button
          type="vivid" class="w-full"
          goTo={route}>
          { buttonTitle }
        </Button>
      </ButtonsBar>
    </>
  )
}
