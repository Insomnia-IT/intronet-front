import {FunctionalComponent} from "preact";
import {Input, InputProps} from "../input";
import style from "./label.module.css";

export type LabelProps = {
  title: string;
  name: string;
} & InputProps;
export const Label: FunctionalComponent<LabelProps> = ({title, name, ...props}) => {
  return <label class={style.label}>
    <span class="sh1">{title}</span>
    <Input name={name} {...props}/>
  </label>
}
