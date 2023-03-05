import React, {FC, useState} from "preact/compat";
import {cell, Cell} from "@cmmn/cell/lib";

export type LoginFormTokenProps = {
  onSubmit?: (token: User["token"]) => void; onCancel?: () => void;
} & { token?: User["token"] };

export const LoginFormToken: FC<LoginFormTokenProps> = ({
                                                          token, onSubmit,
                                                        }) => {
  const [state, setField] = useForm({
    token
  });

  return <div>
    <h2>Войдите в Ваш аккаунт</h2>
    <label>
      <div>Токен</div>
      <input value={state.token}
             onChange={e => setField('token', e.currentTarget.value)}
             name="token"
             type="text"
             placeholder="YourToken"/>
      <i>
        Токен выдается штабом.
      </i>
    </label>
    <button onClick={() => onSubmit(state.token)}>Войти</button>
  </div>;
};


export function useForm<T>(initial: Partial<T>):[
  Partial<T>, SetField<T>
] {
  const [state, setState] = React.useState(initial);
  const setField = React.useCallback((field, value) => setState(state => ({
    ...state, [field]: value
  })), [])
  return [state, setField];
}

type SetField<T, TKey extends keyof T = keyof T> = (key: TKey, value: T[TKey]) => void;
