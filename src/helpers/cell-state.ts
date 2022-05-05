import { Cell } from "cellx";

export function cellState<TState>(component: React.Component, state: StateOfGetters<TState>): TState {
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
  component.componentDidMount = function (){
    for (let [key, cell] of cells) {
      cell.onChange(ev => {
        component.setState({
          [key]: cell.get()
        });
      });
    }
    origMount && origMount.call(component);
  }
  component.componentWillUnmount = function (){
    for (let [key, cell] of cells) {
      cell.off();
    }
    origUnmount && origUnmount.call(component);
  }
  return result as TState;
}

export type GetterOrValue<T> = T | (() => T);

export type StateOfGetters<T> = {
  [key in keyof T]: GetterOrValue<T[key]>
};
