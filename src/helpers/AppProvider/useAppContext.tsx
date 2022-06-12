import { useAuthContext, useModalContext } from "./providers";

export const useAppContext = () => {
  const modals = useModalContext();
  const auth = useAuthContext();
  return { modals, auth };
};
