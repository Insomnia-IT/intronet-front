import React, { PropsWithChildren } from "react";
import { AuthProvider, ModalProvider } from "./providers";

export const AppProvider = ({ children }: PropsWithChildren<{}>) => (
  <ModalProvider>
    <AuthProvider>{children}</AuthProvider>
  </ModalProvider>
);
