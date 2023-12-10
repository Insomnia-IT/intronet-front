import { FunctionalComponent } from "preact";
import {useCell} from "../../helpers/cell-state";
import {authStore} from "../../stores/auth.store";

export type RequireAuthProps = {
  // на «Бессоннице» есть админы, а есть поисково-спасательный отряд, которым
  // тоже нужны права админов, но чтобы те не похерили что-нибудь случайно
  // нужно сделать такое разделение
  role?: "admin" | "tochka";
};

/**
 * Компонент, который отрисовывает children только в том случае, если у пользователя есть токен
 */
export const RequireAuth: FunctionalComponent<RequireAuthProps> = ({
  children,
  role,
}) => {
  const isAdmin = useCell(() => role ? authStore.role === role : authStore.isAdmin);
  if (isAdmin)
    return <>{children}</>;
  return null;
};
