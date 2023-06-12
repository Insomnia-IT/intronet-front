import { FunctionalComponent, JSX } from "preact";
import style from "./input.module.css";
import classNames from "classnames";

export type InputProps =
  | ({
      inputType?: undefined | "input";
    } & JSX.HTMLAttributes<HTMLInputElement>)
  | ({
      inputType: "textarea";
    } & JSX.HTMLAttributes<HTMLTextAreaElement>);

export const Input: FunctionalComponent<InputProps> = ({
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

  return isTextarea ? (
    <textarea {...(props as JSX.HTMLAttributes<HTMLTextAreaElement>)} />
  ) : (
    <input {...(props as JSX.HTMLAttributes<HTMLInputElement>)} />
  );
};
