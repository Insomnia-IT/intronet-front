import React from "react";
import Styles from "./button.module.css";

export type ButtonProps = {
  isLoading?: boolean;
  solid?: boolean;
} & JSX.IntrinsicElements['button'];
export const Button: React.FC<ButtonProps> = ({className,...props}) => {
  return <button {...props} className={[Styles.button, className].filter(x => x).join(' ')}/>
}
