import React from "react";
import {QRReader} from "../qr/qr-reader";
import * as Bulma from "react-bulma-components";
import {Account, account} from "../../../stores";
import {Observer} from "cellx-react";
import {Observable} from "cellx-decorators";
import {cellState} from "../../../helpers/cell-state";

function AccountInfo(acc: Account) {
  const deleteAcc = () => account.Remove(acc);
  return <Bulma.Card key={acc.id} >
    <Bulma.Card.Header>
      <Bulma.Card.Header.Icon className="has-text-success">
        <i className="mdi mdi-36px mdi-arrow-right"/>
      </Bulma.Card.Header.Icon>
      <Bulma.Card.Header.Title>{acc.name}</Bulma.Card.Header.Title>
      <Bulma.Card.Header.Icon className="has-text-success">
        <i className={`mdi mdi-36px ${acc.isValid ? 'mdi-check' : 'mdi-dots-circle'}`}/>
     </Bulma.Card.Header.Icon>
      <Bulma.Card.Header.Icon>
        <Bulma.Button className="has-text-error"
                      onClick={deleteAcc}>
        <i className={`mdi mdi-36px mdi-trash-can`}/>
        </Bulma.Button>
      </Bulma.Card.Header.Icon>
    </Bulma.Card.Header>
  </Bulma.Card>;

}

export class UserLogin extends React.Component {

  @Observable
  isAdding = false;

  state = cellState(this, {
    isAdding: () => this.isAdding,
    accounts: () => Array.from(account.Accounts.values())
  })

  get shouldShowReader(): boolean{
    return this.isAdding || account.Accounts.size == 0;
  }

  render() {
    return (
      <Bulma.Container>
        {(this.shouldShowReader) &&
          <QRReader onSuccess={this.onQRScanned} onError={console.log}/>}
        {this.state.accounts.map(AccountInfo)}
        {!this.shouldShowReader &&
          <Bulma.Button onClick={() => this.state.isAdding = true}>
            Добавить аккаунт
          </Bulma.Button>
        }
      </Bulma.Container>
    )
  }

  onQRScanned = qrResult => {
    this.isAdding = false;
    account.Add(qrResult)
  };

}

export type UserLoginState = {
  qrResult: string
}
