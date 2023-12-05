import {Fn, groupBy} from "@cmmn/core";
import { cell, ObservableList } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";

class ChangesStore {
  @cell
  private db = new ObservableDB<Change>("changes");

  public hasChanges(id: string) {
    return (
      !!this.db.get(id) || this.localChanges.toArray().some((x) => x._id === id)
    );
  }

  public withChanges<T>(entity: T, id: string): T {
    const changes = [
      this.db.get(id),
      ...this.localChanges.toArray().filter((x) => x._id === id),
    ].filter((x) => x);
    if (changes.length === 0) return entity;
    return Fn.deepAssign({}, entity, ...changes, {
      hasChanges: true,
    });
  }

  @cell
  private localChanges = new ObservableList<Change>();
  public addChange(change: Change) {
    this.localChanges.push(change);
  }

  public clearChanges() {
    this.localChanges.clear();
  }

  public async applyChanges() {
    const changes = groupBy(this.localChanges.toArray(), (x) => x._id)
      .values();
    for (let change of changes) {
      await this.db.addOrUpdate(Fn.deepAssign({}, ...change));
    }
  }
}

export const changesStore = new ChangesStore();
