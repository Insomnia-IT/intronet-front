import React, { useEffect, useMemo, useState } from "react";
import { Cell }  from "@cmmn/cell/lib";

export function useCellState<T>(
  getter: (() => T) | T,
  deps: any[] = []
): [T, (value: T) => void, Cell<T>] {
  const cell = useMemo(() => new Cell(getter), [getter, ...deps]);
  const [value, setter] = useState(cell.get());
  useEffect(() => {
    const listener = (e) => {
      console.log(e.value)
      setter(e.value);
    };
    cell.on('change', listener);
    return () => {
      cell.dispose();
    };
  }, [cell]);
  useEffect(() => {
    setter(cell.get());
  }, deps)
  return [value, (v) => cell.set(v), cell];
}

export function cellState<TState>(
  component: React.Component,
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
      cell.on('change', (ev) => {
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
