import { useAuthContext } from "./AuthProvider";
import { useModalContext } from "./ModalProvider";

export const useAppContext = () => {
  const modals = useModalContext();
  const auth = useAuthContext();
  return { modals, auth };
};
