import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button, Editable, Flex } from "@chakra-ui/react";
import { cell } from "@cmmn/cell/lib";
import React from "react";
import { cellState } from "../../../helpers/cell-state";
import { Account, account } from "../../../stores";
import { QRReader } from "../qr/qr-reader";

function AccountInfo(acc: Account) {
  const deleteAcc = () => account.Remove(acc);
  return (
    <Flex key={acc._id}>
      <Editable>{acc.name ?? acc.qr}</Editable>
      <button>
        <DeleteIcon onClick={deleteAcc} />
      </button>
    </Flex>
  );
}

export class UserLogin extends React.Component {
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
          <Button onClick={() => (this.isAdding = true)}>
            Добавить аккаунт
          </Button>
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
