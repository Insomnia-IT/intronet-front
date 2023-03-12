import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext, useState,
} from "preact/compat";
import { useLocalStorageState } from "@helpers/useLocalStorageState";
// import { useCookieState } from "use-cookie-state";

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

  const [token, setToken] = useState("");

  const [username, setUsername] = useState("");

  /**
   * Синхронизирует куки в document.cookie со стейтом в контексте,
   * что вызывает триггер ререндера, который иначе не происходит без вызова функции,
   * поскольку куки устанавливаются в обход setCookieState
   */
  const syncCookies = useCallback(() => {
    const cookie = Object.fromEntries(document.cookie.split(';')
      .map(x => x.trim())
      .map(x => x.split('=').map(x => x.toLowerCase())));
    const actualToken = cookie.token;
    const actualUserName = cookie.username;
    console.log(actualToken, actualUserName);
    setToken(actualToken);
    setUsername(actualUserName);
  }, [setToken, setUsername]);
  React.useEffect(() =>{
    syncCookies();
  }, []);
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
