import { useModalContext } from "./ModalProvider";

export const useAppContext = () => {
  const modals = useModalContext();
  return { modals };
};
