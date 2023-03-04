import React from "preact/compat";
import { LogoutModal } from "../modals/LogoutModal";
import { LoginModal } from "../modals/LoginModal";
import {Button, ButtonProps, toast} from "@components";
import {useAuthContext} from "@helpers/AppProvider/AuthProvider";
import {Modal} from "@components/modal";

export const LoginButton: React.FC<ButtonProps> = (props) => {
  const auth = useAuthContext();

  const handleLogin = async () => {
    try {
      const user = await Modal.show<Partial<User>>((props) => (
        <LoginModal {...props} />
      ));
      try {
        const response = await fetch(`/api/admin/auth/?token=${user.token}`);
        if (!response.ok) throw new Error("Введен неверный токен.");
        auth.syncCookies();
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
      const answer = await Modal.show<Partial<User>>((props) => (
        <LogoutModal {...props} />
      ));
      if (answer) await fetch("api/admin/logout");
      auth.syncCookies();
    } catch (err) {
      if (err instanceof Error) {
      }
    }
  };

  return (
    <Button onClick={auth.token ? handleLogout : handleLogin} {...props}>
      Войти
    </Button>
  );
};
