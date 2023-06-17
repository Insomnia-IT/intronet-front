import { FunctionalComponent, JSX } from "preact";
import style from "./sheet.module.css";

export type SheetProps = {
  onClose?(): void;
};
export const Sheet: FunctionalComponent<SheetProps> = (props) => {
  const isOpen = !!props.children;
  const onClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    !e.defaultPrevented && props.onClose && props.onClose()
  }

  return (
    <div
      class={isOpen ? style.container : style.containerClose}
      onClick={onClick}
    >
      <div
        class={style.sheet}
        onScroll={console.log}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
