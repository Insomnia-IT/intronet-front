import { useModalContext } from "src/helpers/BulmaProvider/providers/ModalProvider";

export const useBulmaContext = () => {
  const modals = useModalContext();
  return { modals };
};
