import {FunctionalComponent, JSX} from "preact";
import Styles from "./modal.module.css";

export type ModalProps = {
  isOpen: boolean;
  onClose(): void;
  scrollBehavior?: "outside";
} & JSX.IntrinsicElements['div'];

export const Modal: FunctionalComponent<ModalProps> = props => {
  console.log(props);
  return props.isOpen && <div {...props} className={Styles.modal}></div>;
}
