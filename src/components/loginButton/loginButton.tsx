import React from "preact";
import { LogoutModal } from "../modals/LogoutModal";
import { LoginModal } from "../modals/LoginModal";
import {Button, ButtonProps, toast} from "@components";
import {Modal} from "@components/modal";
import {authStore} from "@stores/auth.store";
import {useCellState} from "@helpers/cell-state";

export const LoginButton: React.FunctionalComponent<ButtonProps> = (props) => {

  const handleLogin = async () => {
    try {
      const user = await Modal.show<Partial<User>>((props) => (
        <LoginModal {...props} />
      ));
      try {
        const response = await fetch(`/api/admin/auth/?token=${user.token}`);
        if (!response.ok) throw new Error("Введен неверный токен.");
        authStore.syncCookies();
        toast({
          title: "Вы успешно авторизовались.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Ошибка авторизации!",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {}
  };
  const [isAdmin] = useCellState(() => authStore.isAdmin);
  const handleLogout = async () => {
    try {
      const answer = await Modal.show<Partial<User>>((props) => (
        <LogoutModal {...props} />
      ));
      if (answer) await fetch("api/admin/logout");
      authStore.syncCookies();
    } catch (err) {
      if (err instanceof Error) {
      }
    }
  };

  return (
    <Button onClick={isAdmin ? handleLogout : handleLogin} {...props}>
      {isAdmin ? 'Выйти' : 'Войти'}
    </Button>
  );
};
