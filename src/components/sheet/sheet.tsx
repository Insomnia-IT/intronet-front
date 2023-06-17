import { FunctionalComponent, JSX } from "preact";
import style from "./sheet.module.css";

export type SheetProps = {
  onClose?(): void;
  height?: string;
  noShadow?: boolean;
}
export const Sheet: FunctionalComponent<SheetProps> = props => {
  const isOpen = !!props.children;
  const onClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    !e.defaultPrevented && props.onClose && props.onClose()
  }

  return (
    <div
      class={[
        isOpen ? style.container : style.containerClose,
        props.noShadow ? '' : style.shadow
      ].filter(x => x).join(' ')}
      onClick={onClick}
    >
      <div
        class={style.sheet}
        onScroll={console.log}
        style={{
          height: props.height,
          paddingBottom: props.height === 'auto' ? 16 : undefined
        }}

        onClick={(e) => {
              e.preventDefault();
            }}
      >
        {props.children}
      </div>
    </div>
  );
};
