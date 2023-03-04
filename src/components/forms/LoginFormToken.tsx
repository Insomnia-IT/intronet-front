import React, {FC} from "react";

export type LoginFormTokenProps = {
  onSubmit?: (token: User["token"]) => void; onCancel?: () => void;
} & { token?: User["token"] };

export const LoginFormToken: FC<LoginFormTokenProps> = ({
                                                          token, onSubmit,
                                                        }) => {
  return (<form onSubmit={e => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      onSubmit(data.get('token').toString());
    }}>
      <div align={"center"} justify={"center"}>
        <div spacing={8}>
          <div align={"center"}>
            <h2>Войдите в Ваш аккаунт</h2>
          </div>
          <div rounded={"lg"}>
            <div spacing={4}>
              <label>
                <div>Токен</div>
                <input name="token" type="text" placeholder="YourToken"
                />
                <i>
                  Токен выдается штабом.
                </i>
              </label>
              <input type='submit' value="Войти"/>
            </div>
          </div>
        </div>
      </div>
    </form>);
};
