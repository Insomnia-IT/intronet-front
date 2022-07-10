import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "src/helpers/AppProvider";
import { LoginModal, LogoutModal } from "../modals";

export const LoginButton: React.FC<ButtonProps> = (props) => {
  const app = useAppContext();

  const handleLogin = async () => {
    try {
      const user = await app.modals.show<Partial<User>>((props) => (
        <LoginModal {...props} />
      ));
      user.token && app.auth.setToken(user.token);
      user.ticketId && app.auth.setTicketId(user.ticketId);
    } catch (error) {
      if (error instanceof Error) {
        // TODO: вызывать кол к апи на проверку токена?
      }
    }
  };

  const handleLogout = async () => {
    try {
      const answer = await app.modals.show<Partial<User>>((props) => (
        <LogoutModal {...props} />
      ));
      if (answer) fetch("api/admin/logout");
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
