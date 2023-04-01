import React from "preact/compat";
import Styles from "./button.module.css";

export type ButtonProps = {
  isLoading?: boolean;
  solid?: boolean;
  selected?: boolean;
  type?: 'frame'|'blue'|'disco'|'vivid';
} & React.JSX.HTMLAttributes<HTMLButtonElement>
export const Button: React.FC<ButtonProps> = ({className,...props}) => {
  const classNames = [Styles.button, className].filter(x => x);
  if (props.selected)
    classNames.push(Styles.selected)
  if (props.type)
    classNames.push(Styles[props.type]);
  return <button {...props} className={classNames.join(' ')}/>
}
