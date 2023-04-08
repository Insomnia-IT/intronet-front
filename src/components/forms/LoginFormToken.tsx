import {FunctionalComponent} from "preact";
import {useCallback, useState} from "preact/hooks";

export type LoginFormTokenProps = {
  onSubmit?: (token: User["token"]) => void; onCancel?: () => void;
} & { token?: User["token"] };

export const LoginFormToken: FunctionalComponent<LoginFormTokenProps> = ({
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
  const [state, setState] = useState(initial);
  const setField = useCallback((field, value) => setState(state => ({
    ...state, [field]: value
  })), [])
  return [state, setField];
}

type SetField<T, TKey extends keyof T = keyof T> = (key: TKey, value: T[TKey]) => void;
