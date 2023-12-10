import { cell } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";

class ShopsStore {
  constructor() {}

  @cell
  private db = new ObservableDB<IShop>("shops");

  @cell
  private IsLoading = true;

  get shops(): IShop[] {
    return this.db.toArray();
  }

  public getShop(id: IShop["_id"]): IShop {
    return this.db.get(id);
  }
}

export const shopsStore = new ShopsStore();
