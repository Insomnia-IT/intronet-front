import { LogoutModal } from "../modals";
import { LoginModal } from "../modals";
import {Button, ButtonProps, toast} from "../index";
import {Modal} from "../modal";
import {authStore} from "../../stores/auth.store";
import {useCell} from "../../helpers/cell-state";
import {FunctionalComponent} from "preact";

export const LoginButton: FunctionalComponent<ButtonProps> = (props) => {

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
  const isAdmin = useCell(() => authStore.isAdmin);
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
