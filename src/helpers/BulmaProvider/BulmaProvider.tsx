import React, { PropsWithChildren } from "react";
import { ModalProvider } from "./providers";

export const BulmaProvider = ({ children }: PropsWithChildren<any>) => (
  <ModalProvider>{children}</ModalProvider>
);
