import { FunctionalComponent, JSX } from "preact";
import style from "./sheet.module.css";

export type SheetProps = {
  onClose?(): void;
  height?: string;
  noShadow?: boolean;
  shadowType?: 'globalShadow' | 'localShadow'
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
        props.noShadow ? '' : style.shadow,
      ].filter(x => x).join(' ')}
      onClick={onClick}
    >
      <div
        class={[style.sheet, props.shadowType ? style[props.shadowType] : ''].filter(x => x).join(' ')}
        onScroll={console.log}
        style={{
          height: props.height,
          paddingBottom: props.height === 'auto' ? 16 : undefined,
          borderRadius: props.height === '100%' ? '0' : undefined,
          maxHeight: props.height === 'auto' ? '60%' : undefined
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
