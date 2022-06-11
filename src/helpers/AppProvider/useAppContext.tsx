import { useModalContext } from "src/helpers/AppProvider/providers/ModalProvider";

export const useAppContext = () => {
  const modals = useModalContext();
  return { modals };
};
