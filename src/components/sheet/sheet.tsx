import {FunctionalComponent} from "preact";
import style from "./sheet.module.css";

export type SheetProps = {
  onClose?(): void;
  height?: string;
  noShadow?: boolean;
}
export const Sheet: FunctionalComponent<SheetProps> = props => {
  const isOpen = !!props.children;

  return <div class={[
    isOpen ? style.container : style.containerClose,
    props.noShadow ? '' : style.shadow
  ].filter(x => x).join(' ')}
              onClick={props.onClose ? e => !e.defaultPrevented && props.onClose() : undefined}>
    <div class={style.sheet} onScroll={console.log}
         style={{
           height: props.height,
           paddingBottom: props.height === 'auto' ? 16 : undefined
        }}
         onClick={e => {
          e.preventDefault();
        }}>
      {props.children}
    </div>
  </div>
}
