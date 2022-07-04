import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "src/helpers/AppProvider";
import { LoginModal } from "../modals";

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

  return (
    <Button onClick={handleLogin} {...props}>
      Войти
    </Button>
  );
};
