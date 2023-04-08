import {Cell} from "@cmmn/cell/lib";
import {useCellState} from "@helpers/cell-state";
import React from "preact";

export function toast(config: ToastInfo){
  cell.set(config);
}

const cell = new Cell<ToastInfo | null>(null)

export function Toast(){
  const [current] = useCellState(() => cell.get());
  return current && <div>
    {current.title}
    {current.description}
  </div>;
}

export type ToastInfo = {
  title: string;
  description?: string;
  status: "error" | "success";
  duration: number;
  isClosable: boolean;
}
