import React, { PropsWithChildren } from "preact/compat";
import { AuthProvider } from "./AuthProvider";
import { ModalProvider } from "./ModalProvider";

export const AppProvider = ({ children }: PropsWithChildren<{}>) => (
  <ModalProvider>
    <AuthProvider>{children}</AuthProvider>
  </ModalProvider>
);
