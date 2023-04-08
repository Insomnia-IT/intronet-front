import {useEffect, useMemo, useReducer, useState} from "preact/hooks";
import { Cell, BaseCell, compare } from "@cmmn/cell/lib";

export function useCell<T>(
  getter: (() => T) | BaseCell<T> | undefined,
  deps: any[] = []
): T {
  if (!getter || getter instanceof BaseCell)
    deps.push(getter);
  const cell = useMemo<BaseCell>(
    () => getter instanceof BaseCell ? getter : new Cell(getter, {compare}),
    deps
  );
  const [, dispatch] = useReducer(x => ({}), {});
  useEffect(() => {
    return cell.on('change', dispatch);
  }, [cell])
  return cell.get();
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
