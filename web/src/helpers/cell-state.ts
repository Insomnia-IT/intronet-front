import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
import { Cell, BaseCell } from "@cmmn/cell";
import { compare } from "@cmmn/core";
import { useSyncExternalStore } from "preact/compat";

export function useCell<T>(
  getter: (() => T) | BaseCell<T> | undefined,
  deps: any[] = []
): T {
  const cellRef = useMemo(
    () =>
      new CellRef(
        getter instanceof BaseCell ? getter : new BaseCell<T>(getter)
      ),
    getter instanceof BaseCell ? [getter] : deps
  );
  useEffect(() => cellRef.unsubscribe, []);
  return useSyncExternalStore(cellRef.subscribe, cellRef.getSnapshot).value;
}

class CellRef<T> {
  unsubscribe: () => void;
  constructor(private cell: BaseCell<T>) {
    this.unsubscribe = this.cell.on("change", () => {
      this.state = { value: this.cell.value };
    });
  }

  state: { value: T } | undefined;

  getSnapshot = () => {
    return (this.state ??= { value: this.cell.value });
  };

  subscribe = (onChange: () => void) => {
    return this.cell.on("change", onChange);
  };
}

export function cellState<TState>(
  component: ComponentLike,
  state: StateOfGetters<TState>
): TState {
  const result: Partial<TState> = {};
  const cells = new Map<string, Cell<any>>();
  for (let key in state) {
    if (typeof state[key] === "function") {
      const cell = new Cell(state[key]);
      cells.set(key, cell);
      result[key] = cell.get() as any;
    } else {
      result[key] = state[key] as any;
    }
  }
  const origMount = component.componentDidMount;
  const origUnmount = component.componentWillUnmount;
  component.componentDidMount = function () {
    for (let [key, cell] of cells) {
      cell.on("change", (ev) => {
        component.setState({
          [key]: ev.value,
        });
      });
      component.setState({
        [key]: cell.get(),
      });
    }
    origMount && origMount.call(component);
  };
  component.componentWillUnmount = function () {
    for (let [key, cell] of cells) {
      cell.dispose();
    }
    origUnmount && origUnmount.call(component);
  };
  return result as TState;
}

export type GetterOrValue<T> = T | (() => T);

export type StateOfGetters<T> = {
  [key in keyof T]: GetterOrValue<T[key]>;
};

export type ComponentLike = {
  componentDidMount?(): void;
  componentWillUnmount?(): void;
  setState(state: any);
};
