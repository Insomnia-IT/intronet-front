import {FunctionalComponent} from "preact";
import style from "./sheet.module.css";

export type SheetProps = {
  onClose?(): void;
}
export const Sheet: FunctionalComponent<SheetProps> = props => {
  const isOpen = !!props.children;

  return <div class={isOpen ? style.container : style.containerClose}
              onClick={props.onClose ? e => !e.defaultPrevented && props.onClose() : undefined}>
    <div class={style.sheet} onScroll={console.log} onClick={e => {
      e.preventDefault();
    }}>
      {props.children}
    </div>
  </div>
}
