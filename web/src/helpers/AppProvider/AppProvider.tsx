import { ModalProvider } from "./ModalProvider";

export const AppProvider = ({ children }: {children: any}) => (
  <ModalProvider>
    {children}
  </ModalProvider>
);
