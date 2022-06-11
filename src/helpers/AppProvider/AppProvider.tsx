import React, { PropsWithChildren } from "react";
import { ModalProvider } from "./providers";

export const AppProvider = ({ children }: PropsWithChildren<any>) => (
  <ModalProvider>{children}</ModalProvider>
);
