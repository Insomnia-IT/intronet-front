import { Button, ButtonProps, useToast } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "@helpers/AppProvider";
import { LoginModal, LogoutModal } from "../modals";

export const LoginButton: React.FC<ButtonProps> = (props) => {
  const app = useAppContext();

  const toast = useToast();

  const handleLogin = async () => {
    try {
      const user = await app.modals.show<Partial<User>>((props) => (
        <LoginModal {...props} />
      ));
      try {
        const response = await fetch(`/api/admin/auth/?token=${user.token}`);
        if (!response.ok) throw new Error("Введен неверный токен.");
        app.auth.syncCookies();
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

  const handleLogout = async () => {
    try {
      const answer = await app.modals.show<Partial<User>>((props) => (
        <LogoutModal {...props} />
      ));
      if (answer) await fetch("api/admin/logout");
      app.auth.syncCookies();
    } catch (err) {
      if (err instanceof Error) {
      }
    }
  };

  return (
    <Button onClick={app.auth.token ? handleLogout : handleLogin} {...props}>
      Войти
    </Button>
  );
};
