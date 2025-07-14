import { FunctionalComponent } from "preact";
import Styles from "./bookmark-plug.module.css";

export interface BookmarkPlugProps {
  text: string[];
}

export const BookmarkPlug: FunctionalComponent<BookmarkPlugProps> = ({
  text
}) => {
  return (
    <>
      <div className={ Styles.container }>
        <h2>{ ('тут пока пусто').toUpperCase() }</h2>
        <div flex column class="colorGrey2" style={ 'gap: 12px' }>
          { text.map((block) => <span className="text">{ block }</span>) }
        </div>
      </div>
    </>
  )
}
