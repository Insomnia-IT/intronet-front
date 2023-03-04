import React from "react";
import Styles from "./modal.module.css";

export type ModalProps = {
  isOpen: boolean;
  onClose(): void;
  scrollBehavior: "outside";
} & JSX.IntrinsicElements['div'];

export const Modal: React.FC<ModalProps> = props => {
  console.log(props);
  return props.isOpen && <div {...props} className={Styles.modal}></div>;
}
