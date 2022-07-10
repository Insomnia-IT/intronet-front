import React, { createContext, PropsWithChildren, useContext } from "react";
import { useLocalStorageState } from "src/helpers/useLocalStorageState";
import { useCookieState } from "use-cookie-state";

const AuthContext = createContext<{
  ticketId?: string;
  token?: string;
  username?: string;
  setTicketId: (newTicketId: string) => void;
  setToken: (newToken: string) => void;
  setUsername: (newUsername: string) => void;
}>({ setTicketId: () => {}, setToken: () => {}, setUsername: () => {} });

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [ticketId, setTicketId] = useLocalStorageState<string>("");

  const [token, setToken] = useCookieState("Token", "");

  const [username, setUsername] = useCookieState("UserName", "");

  return (
    <AuthContext.Provider
      value={{
        ticketId,
        token,
        username,
        setTicketId,
        setToken,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
