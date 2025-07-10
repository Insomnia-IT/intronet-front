import {FunctionalComponent, JSX} from "preact";
import {SvgIcon} from "@icons";
import classNames from "classnames";
import style from "./search-input.module.css";
import {useEffect, useRef} from "preact/hooks";
import {Input} from "@components/input/input";

export type SearchInputProps = {

} & JSX.HTMLAttributes<HTMLInputElement>;
export const SearchInput: FunctionalComponent<SearchInputProps> = (props) => {
  const {className, class: c, ...inputProps } = props;
  const divClassName = classNames(style.searchInput, c as string, className as string);
  return <div className={divClassName}>
    <SvgIcon id="#search" stroke-width={1.8} className="colorInsNight"/>
    <Input class={style.input} {...inputProps}/>
  </div>
}
