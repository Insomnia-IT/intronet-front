import { FunctionalComponent, JSX } from "preact";
import style from "./input.module.css";
import classNames from "classnames";
import {useEffect, useRef} from "preact/hooks";

export type InputProps =
  | ({
      inputType?: undefined | "input";
    } & JSX.HTMLAttributes<HTMLInputElement>)
  | ({
      inputType: "textarea";
    } & JSX.HTMLAttributes<HTMLTextAreaElement>);

export const Input: FunctionalComponent<Omit<InputProps, "ref">> = ({
  class: c,
  className,
  inputType,
  ...inputProps
}) => {
  const isTextarea = inputType === "textarea";

  const props = {
    className: classNames(style.input, c as string, className as string, {
      [style.textarea]: isTextarea,
    }),
    ...inputProps,
  };
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>()
  useEffect(() => {
    if (ref.current && inputProps.autofocus)
      ref.current.focus();
  }, [ref.current]);
  return isTextarea ? (
    <textarea {...(props as JSX.HTMLAttributes<HTMLTextAreaElement>)} ref={ref} />
  ) : (
    <input {...(props as JSX.HTMLAttributes<HTMLInputElement>)} ref={ref}/>
  );
};
