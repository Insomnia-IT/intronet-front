import { useModalContext } from "./providers/ModalProvider";

export const Modals = () => {
  const modalContext = useModalContext();
  return modalContext.modal;
};
