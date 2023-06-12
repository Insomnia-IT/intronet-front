import { FunctionalComponent, JSX } from "preact";
import style from "./input.module.css";
import classNames from "classnames";

export type InputProps = {
  textarea?: boolean;
} & (
  | JSX.HTMLAttributes<HTMLInputElement>
  | JSX.HTMLAttributes<HTMLTextAreaElement>
);

export const Input: FunctionalComponent<InputProps> = ({
  class: c,
  className,
  textarea = false,
  ...inputProps
}) => {
  const props = {
    className: classNames(style.input, c as string, className as string, {
      [style.textarea]: textarea,
    }),
    ...inputProps,
  };

  return textarea ? (
    <textarea {...(props as JSX.HTMLAttributes<HTMLTextAreaElement>)} />
  ) : (
    <input {...(props as JSX.HTMLAttributes<HTMLInputElement>)} />
  );
};
