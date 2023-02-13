import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { useLocalStorageState } from "@src/helpers/useLocalStorageState";
import { useCookieState } from "use-cookie-state";

const AuthContext = createContext<{
  ticketId?: string;
  token?: string;
  username?: string;
  setTicketId: (newTicketId: string) => void;
  setToken: (newToken: string) => void;
  setUsername: (newUsername: string) => void;
  syncCookies: () => void;
}>({
  setTicketId: () => {},
  setToken: () => {},
  setUsername: () => {},
  syncCookies: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [ticketId, setTicketId] = useLocalStorageState<string>("");

  const [token, setToken] = useCookieState("Token", "");

  const [username, setUsername] = useCookieState("UserName", "");

  /**
   * Синхронизирует куки в document.cookie со стейтом в контексте,
   * что вызывает триггер ререндера, который иначе не происходит без вызова функции,
   * поскольку куки устанавливаются в обход setCookieState
   */
  const syncCookies = useCallback(() => {
    const cookie = `; ${document.cookie}`;
    const actualToken = cookie.split(`; Token=`).pop().split(";").shift();
    const actualUserName = cookie.split(`; UserName=`).pop().split(";").shift();
    setToken(actualToken);
    setUsername(actualUserName);
  }, [setToken, setUsername]);

  return (
    <AuthContext.Provider
      value={{
        ticketId,
        token,
        username,
        setTicketId,
        setToken,
        setUsername,
        syncCookies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
