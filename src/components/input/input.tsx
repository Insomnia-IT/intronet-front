import { FunctionalComponent, JSX } from "preact";
import style from "./input.module.css";
import { JSXInternal } from "preact/src/jsx";
import SignalLike = JSXInternal.SignalLike;

export type InputProps = ({
  inputType?: undefined;
} & JSX.HTMLAttributes<HTMLInputElement>) | ({
  inputType: 'textarea';
} & JSX.HTMLAttributes<HTMLTextAreaElement>);
export const Input: FunctionalComponent<InputProps> = ({
  class: c,
  className,
  inputType,
  ...inputProps
}) => {
  const classNames: Array<string | SignalLike<string>> = [style.input];
  if (c) classNames.push(c);
  if (className) classNames.push(className);
  if (inputType === "textarea"){
    return <textarea className={classNames.join(" ")} {...inputProps as  JSX.HTMLAttributes<HTMLTextAreaElement>} />;
  }
  return <input className={classNames.join(" ")} {...inputProps as  JSX.HTMLAttributes<HTMLInputElement>} />;
};
