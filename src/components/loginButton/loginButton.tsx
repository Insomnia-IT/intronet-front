import { Button, ButtonProps, useToast } from "@chakra-ui/react";
import React from "react";
import { useAppContext } from "src/helpers/AppProvider";
import { LoginModal } from "../modals";

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

  return (
    <Button onClick={handleLogin} {...props}>
      Войти
    </Button>
  );
};
