import React from "react";
import { Account, account } from "../../stores";
import { Select } from "chakra-react-select";
import { cellState } from "../../helpers/cell-state";
import { UserLogin } from "../login/user-login/user-login";
import { moviesStore } from "../../stores/movies.store";
import { Flex } from "@chakra-ui/react";

export class VotingPage extends React.PureComponent {
  state = cellState(this, {
    accounts: () => account.Accounts,
    selected: () => account.Selected,
    movies: () => moviesStore.Movies,
  });

  render() {
    if (this.state.accounts.length === 0) return <UserLogin />;
    return (
      <>
        <Select
          placeholder="Выберите аккаунт"
          value={accToSelectItem(this.state.selected)}
          onChange={(e) => account.Select(e.value)}
          options={this.state.accounts.map(accToSelectItem)}
        />
        {this.state.movies.map((x) => (
          <Flex key={x.id}>{x.title}</Flex>
        ))}
      </>
    );
  }
}

function accToSelectItem(acc: Account) {
  if (!acc) return null;
  return {
    label: acc.name ?? acc.qr,
    value: acc.id,
  };
}
