import React from "react";
import Styles from "./button.module.css";

export const Button: React.FC<JSX.IntrinsicElements['button']> = ({className,...props}) => {
  return <button {...props} className={[Styles.button, className].filter(x => x).join(' ')}/>
}
