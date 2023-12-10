import {FunctionalComponent, JSX} from "preact";
import {Input, InputProps} from "../input";
import style from "./label.module.css";

export type LabelProps = ({
  title: string;
}) & (InputProps | {
  children: JSX.Element;
});
export const Label: FunctionalComponent<LabelProps> = ({title, children, ...props}) => {
  return <label class={style.label}>
    <span class="sh1">{title}</span>
    {children ?? <Input {...props}/>}
  </label>
}
