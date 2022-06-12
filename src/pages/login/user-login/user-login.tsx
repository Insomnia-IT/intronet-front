import React from "react";
import { QRReader } from "../qr/qr-reader";
import * as Bulma from "react-bulma-components";
import { Account, account } from "../../../stores";
import { Observable } from "cellx-decorators";
import { cellState } from "../../../helpers/cell-state";
import { Box, Editable, Flex, CloseButton } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, CloseIcon } from "@chakra-ui/icons";

function AccountInfo(acc: Account) {
  const deleteAcc = () => account.Remove(acc);
  return (
    <Flex key={acc.id}>
      <Editable>{acc.name ?? acc.qr}</Editable>
      <button>
        <DeleteIcon onClick={deleteAcc} />
      </button>
    </Flex>
  );
}

export class UserLogin extends React.Component {
  @Observable
  isAdding = false;

  state = cellState(this, {
    isAdding: () => this.isAdding,
    accounts: () => account.Accounts,
  });

  get shouldShowReader(): boolean {
    return this.state.isAdding || account.Accounts.length == 0;
  }

  render() {
    return (
      <Flex direction="column" flex={1} margin="1em" minHeight="0">
        {this.state.isAdding && (
          <CloseIcon
            position="absolute"
            zIndex="1"
            right="1em"
            top="1em"
            onClick={() => (this.isAdding = false)}
          ></CloseIcon>
        )}
        {this.shouldShowReader && (
          <QRReader onSuccess={this.onQRScanned} onError={console.log} />
        )}
        {!this.state.isAdding && this.state.accounts.map(AccountInfo)}
        {!this.shouldShowReader && (
          <Bulma.Button onClick={() => (this.isAdding = true)}>
            Добавить аккаунт
          </Bulma.Button>
        )}
      </Flex>
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
