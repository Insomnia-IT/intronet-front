import { ObservableMap } from "cellx-collections";
import { Observable } from "cellx-decorators";
import { Dexie, Table } from "dexie";
import { qrApi } from "src/api";
import { ulid } from "../helpers/ulid";

class AccountStore {
  // @ts-ignore
  private db: Table<Account> = this.initDB();

  private initDB() {
    const db = new Dexie("accounts");
    db.version(1).stores({
      accounts: `id`,
    });
    // @ts-ignore
    return db.accounts;
  }

  constructor() {
    this.load();
  }

  @Observable
  public Accounts = new ObservableMap<string, Account>();

  private async load() {
    const accs = await this.db.toArray();
    this.Accounts.clear();
    accs.forEach((x) => this.Accounts.set(x.id, x));
  }

  public Add(qr: string) {
    const acc = {
      id: ulid(),
      qr,
      name: "default",
      token: null,
      isValid: false,
    };
    qrApi.checkUserQR(qr).then((valid) => {
      acc.isValid = valid;
      this.Accounts.set(acc.id, acc);
      this.db.put(acc);
    });
    this.Accounts.set(acc.id, acc);
    this.db.put(acc);
  }

  Remove(acc: Account) {
    this.Accounts.delete(acc.id);
    this.db.delete(acc.id);
  }
}

export const account = new AccountStore();

export type Account = {
  id: string;
  qr: string;
  name: string;
  isValid: boolean;
  token?: string;
};
