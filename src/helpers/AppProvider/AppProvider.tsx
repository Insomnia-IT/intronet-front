import React, { PropsWithChildren } from "preact/compat";
import { ModalProvider } from "./ModalProvider";

export const AppProvider = ({ children }: PropsWithChildren<{}>) => (
  <ModalProvider>
    {children}
  </ModalProvider>
);
