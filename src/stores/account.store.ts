import { cell } from "@cmmn/cell/lib";
import { qrApi } from "@api";
import { ulid } from "../helpers/ulid";
import { ObservableDB } from "./observableDB";

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
      _id: ulid(),
      qr,
      name: null,
      token: null,
      isValid: false,
      isSelected: this.Selected == null,
    } as Account;
    qrApi.checkUserQR(qr).then((valid) => {
      acc.isValid = valid;
      this.db.update(acc, "user");
    });
    this.db.add(acc, "user");
  }

  Remove(acc: Account) {
    this.db.remove(acc._id, "user");
  }

  Select(id: string) {
    if (this.Selected) {
      this.db.update(
        {
          ...this.Selected,
          isSelected: false,
        },
        "user"
      );
    }
    this.db.update(
      {
        ...this.db.get(id),
        isSelected: true,
      },
      "user"
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
