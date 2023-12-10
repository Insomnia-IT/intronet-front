import { Cell } from "@cmmn/cell";
import { useCell } from "../../helpers/cell-state";
export function toast(config: ToastInfo) {
  cell.set(config);
}

const cell = new Cell<ToastInfo | null>(null);

export function Toast() {
  const current = useCell(() => cell.get());
  return (
    current && (
      <div>
        {current.title}
        {current.description}
      </div>
    )
  );
}

export type ToastInfo = {
  title: string;
  description?: string;
  status: "error" | "success";
  duration: number;
  isClosable: boolean;
};
