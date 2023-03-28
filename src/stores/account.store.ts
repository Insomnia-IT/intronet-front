import { cell } from "@cmmn/cell/lib";
import { qrApi } from "@api";
import { ObservableDB } from "./observableDB";
import {Fn} from "@cmmn/cell/lib";

class AccountStore {
  @cell
  private db = new ObservableDB<Account>("accounts");

  public get Accounts() {
    return this.db.toArray();
  }

  public get Selected() {
    return this.Accounts.find((x) => x.isSelected);
  }

  public Add(qr: string) {
    const acc = {
      _id: Fn.ulid(),
      qr,
      name: null,
      token: null,
      isValid: false,
      isSelected: this.Selected == null,
    } as Account;
    qrApi.checkUserQR(qr).then((valid) => {
      acc.isValid = valid;
      this.db.addOrUpdate(acc);
    });
    this.db.addOrUpdate(acc);
  }

  Remove(acc: Account) {
    this.db.remove(acc._id);
  }

  Select(id: string) {
    if (this.Selected) {
      this.db.addOrUpdate(
        {
          ...this.Selected,
          isSelected: false,
        },
      );
    }
    this.db.addOrUpdate(
      {
        ...this.db.get(id),
        isSelected: true,
      },
    );
  }
}

export const account = new AccountStore();

export type Account = {
  _id: string;
  qr: string;
  name: string;
  isValid: boolean;
  token?: string;
  isSelected: boolean;
};
