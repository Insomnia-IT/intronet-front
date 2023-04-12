import { FunctionalComponent, JSX } from "preact";
import style from "./input.module.css";
import { JSXInternal } from "preact/src/jsx";
import SignalLike = JSXInternal.SignalLike;

export type InputProps = {} & JSX.HTMLAttributes<HTMLInputElement>;
export const Input: FunctionalComponent<InputProps> = ({
  class: c,
  className,
  ...inputProps
}) => {
  const classNames: Array<string | SignalLike<string>> = [style.input];
  if (c) classNames.push(c);
  if (className) classNames.push(className);
  return <input className={classNames.join(" ")} {...inputProps} />;
};
