import React, { createContext, PropsWithChildren, useContext } from "react";
import { useLocalStorageState } from "src/helpers/useLocalStorageState";

const AuthContext = createContext<{
  ticketId?: string;
  token?: string;
  setTicketId: (newTicketId: string) => void;
  setToken: (newToken: string) => void;
}>({ setTicketId: () => {}, setToken: () => {} });

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [ticketId, setTicketId] = useLocalStorageState<string>("ticket_id");

  const [token, setToken] = useLocalStorageState<string>("token");

  return (
    <AuthContext.Provider
      value={{
        ticketId,
        token,
        setTicketId,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
