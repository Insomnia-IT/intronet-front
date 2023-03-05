import React from "preact/compat";
import Styles from "./button.module.css";

export type ButtonProps = {
  isLoading?: boolean;
  solid?: boolean;
} & React.JSX.HTMLAttributes<HTMLButtonElement>
export const Button: React.FC<ButtonProps> = ({className,...props}) => {
  return <button {...props} className={[Styles.button, className].filter(x => x).join(' ')}/>
}
