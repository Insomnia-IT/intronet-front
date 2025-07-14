import { FunctionalComponent, JSX } from "preact";
import style from "./sheet.module.css";

export type SheetProps = {
  onClose?(): void;
  height?: string;
  noShadow?: boolean;
  shadowType?: 'globalShadow' | 'localShadow';
  style?: JSX.HTMLAttributes<HTMLDivElement>["style"];
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
      style={props.style}
    >
      <div
        class={[style.sheet, props.shadowType ? style[props.shadowType] : ''].filter(x => x).join(' ')}
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
        <div style={{position: 'relative', minHeight: '100%'}}>
        {props.children}
        </div>
      </div>
    </div>
  );
};
