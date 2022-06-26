import React from "react";
import { FC, PropsWithChildren } from "react";
import { useAuthContext } from "src/helpers/AppProvider/AuthProvider";

export type RequireAuthProps = {
  role?: "admin" | "searcher";
};

/**
 * Компонент, который отрисовывает children только в том случае, если у пользователя есть токен
 */
export const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({
  children,
  role = "admin",
}) => {
  const auth = useAuthContext();
  if (auth.token) return <>{children}</>;
  return null;
};
