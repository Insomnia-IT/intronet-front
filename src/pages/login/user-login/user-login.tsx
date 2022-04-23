import React from "react";
import {QRReader} from "../qr/qr-reader";
import * as Bulma from "react-bulma-components";
import {Account, account} from "../../../stores";
import {Observer} from "cellx-react";
import {Observable} from "cellx-decorators";

function AccountInfo(acc: Account) {
  return <Bulma.Card key={acc.id} >
    <Bulma.Card.Header>
      <Bulma.Card.Header.Icon className="has-text-success">
        <i className="mdi mdi-36px mdi-arrow-right"/>
      </Bulma.Card.Header.Icon>
      <Bulma.Card.Header.Title>{acc.name}</Bulma.Card.Header.Title>
      <Bulma.Card.Header.Icon className="has-text-success">
        <i className={`mdi mdi-36px ${acc.isValid ? 'mdi-check' : 'mdi-dots-circle'}`}/>
      </Bulma.Card.Header.Icon>
    </Bulma.Card.Header>
  </Bulma.Card>;

}

@Observer
export class UserLogin extends React.Component {

  @Observable
  isAdding = false;

  render() {
    return (
      <Bulma.Container>
        {(account.Accounts.size == 0 || this.isAdding) &&
          <QRReader onSuccess={this.onQRScanned} onError={console.log}/>}
        {Array.from(account.Accounts.values()).map(AccountInfo)}
        {!this.isAdding &&
          <Bulma.Button onClick={() => this.isAdding = true}>
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
