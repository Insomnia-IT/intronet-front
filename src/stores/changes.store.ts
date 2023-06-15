import {Fn, ObservableList} from "@cmmn/cell/lib";
import { cell } from "@cmmn/cell/lib";
import {ObservableDB} from "./observableDB";

class ChangesStore  {
  @cell
  private db = new ObservableDB<Change>("changes");

  public hasChanges(id: string){
    return !!this.db.get(id) || this.localChanges.toArray().some(x => x._id === id);
  }

  public withChanges<T>(entity: T, id: string): T{
    return Fn.deepAssign(entity, this.db.get(id) ?? {}, ...this.localChanges.toArray().filter(x => x._id === id));
  }

  private localChanges = new ObservableList<Change>();
  public addChange(change: Change){
    this.localChanges.push(change);
  }

  public clearChanges(){
    this.localChanges.clear();
  }

  public async applyChanges(){
    const changes = this.localChanges.toArray().groupBy(x => x._id).values();
    for (let change of changes) {
      await this.db.addOrUpdate(Fn.deepAssign({}, ...change))
    }
  }
}

export const changesStore = new ChangesStore();
