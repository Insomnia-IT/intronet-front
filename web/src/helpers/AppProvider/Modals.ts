import { useModalContext } from "./ModalProvider";

export const Modals = () => {
  const modalContext = useModalContext();
  return modalContext.modal;
};
