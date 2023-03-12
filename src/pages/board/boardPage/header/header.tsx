import React, { FC } from "preact/compat";
import { useCellState } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { useRouter } from "../../../routing";

export const Header: FC = () => {
  const { goTo } = useRouter();
  const [ info ] = useCellState(() => locationsStore.Infocenter);

  return (
    <>
      <h1>Объявления</h1>
    </>
  );
}
