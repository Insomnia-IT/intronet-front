import { cell } from "@cmmn/cell/lib";
import { cellState } from "@helpers/cell-state";
import { Account, account } from "@stores";
import { QRReader } from "../qr/qr-reader";
import {Button} from "@components";
import {Component} from "preact";

function AccountInfo(acc: Account) {
  const deleteAcc = () => account.Remove(acc);
  return (
    <div key={acc._id}>
      <div>{acc.name ?? acc.qr}</div>
      <button>
        <div onClick={deleteAcc} />
      </button>
    </div>
  );
}

export class UserLogin extends Component<any, any> {
  @cell
  isAdding = false;

  state = cellState(this, {
    isAdding: () => this.isAdding,
    accounts: () => account.Accounts,
  });

  get shouldShowReader(): boolean {
    // eslint-disable-next-line eqeqeq
    return this.state.isAdding || account.Accounts.length == 0;
  }

  render() {
    return (
      <div >
        {this.state.isAdding && (
          <div
            onClick={() => (this.isAdding = false)}
          ></div>
        )}
        {this.shouldShowReader && (
          <QRReader onSuccess={this.onQRScanned} onError={console.log} />
        )}
        {!this.state.isAdding && this.state.accounts.map(AccountInfo)}
        {!this.shouldShowReader && (
          <Button onClick={() => (this.isAdding = true)}>
            Добавить аккаунт
          </Button>
        )}
      </div>
    );
  }

  onQRScanned = (qrResult) => {
    this.isAdding = false;
    account.Add(qrResult);
  };
}

export type UserLoginState = {
  qrResult: string;
};
