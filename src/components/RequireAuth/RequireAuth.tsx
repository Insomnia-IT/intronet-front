import React from "preact/compat";
import { FC, PropsWithChildren } from "preact/compat";
import { useAuthContext } from "@helpers/AppProvider/AuthProvider";

export type RequireAuthProps = {
  // на бессоннице есть админы, а есть поисково-спасательный отряд, которым
  // тоже нужны права админов, но чтобы те не похерили что-нибудь случайно
  // нужно сделать такое разделение
  role?: "admin" | "poteryashki" | ("admin" | "poteryashki")[];
};

/**
 * Компонент, который отрисовывает children только в том случае, если у пользователя есть токен
 */
export const RequireAuth: FC<PropsWithChildren<RequireAuthProps>> = ({
  children,
  role = "admin",
}) => {
  const auth = useAuthContext();
  // проверяем, есть ли токен в провайдере
  // не пустой ли он
  // проверяем, соответствуюет ли допустимая роль компонента юзернейму

  // т.к. по факту у нас нет ролевой модели, здесь используется обыкновенное сравнение
  // юзернейма-как-роли с ролью компонента
  if (
    auth.token &&
    auth.token.length > 0 &&
    (role === auth.username ||
      role.includes(auth.username as "admin" | "poteryashki"))
  )
    return <>{children}</>;
  return null;
};
