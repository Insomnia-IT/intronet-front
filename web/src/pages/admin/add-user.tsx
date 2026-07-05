import { Cell } from "@cmmn/cell";
import { Button } from "@components";
import { useCell } from "@helpers/cell-state";
import { UserRole, authStore } from "@stores/auth.store";

const roles = {
  admin: 'Админ',
  tochka: 'Точка сборки',
  volunteer: 'Волонтер'
}
const defaultUser = {
  role: 'volunteer' as UserRole,
  name: ''
};

const store = {
  user: new Cell(defaultUser),
  query: new Cell<{ isPending?: true; url?: string; error?: string; }>({}),
  async addUser() {
    store.query.set({ isPending: true });
    const { role, name } = store.user.get();
    try{
      const token = await authStore.createToken(role, name);
      const url = `${location.origin}/?token=${token}`;
      store.user.set(defaultUser);
      store.query.set({ url });
    } catch (err) {
      store.query.set({ error: err });
    }

  }
}

export function AddUserForm() {
  const { role, name } = useCell(store.user);
  const query = useCell(store.query);
  if (query.isPending)
    return <>...</>;
  return <>
    <form flex column gap="2">
    <select value={role} onChange={e => store.user.set({name, role: (e.target as HTMLSelectElement).value as UserRole})}>
      {Object.entries(roles).map(([value, title]) => (
        <option value={value}>{ title }</option>
      )) }
    </select>
    <input value={ name } onChange={e => store.user.set({role, name: (e.target as HTMLInputElement).value})} />
    <Button onClick={store.addUser}>Добавить</Button>
    </form >
    {query.url && <>
      <code>{query.url}</code>
    </>}
    {query.error}
  </>
}
