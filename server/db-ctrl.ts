import { Fn } from "@cmmn/cell/lib";
import {Database} from "./database";

export const dbCtrl = new class {

  public async get(name: string, from: string = undefined){
    const db = databases.get(name);
    return db.getSince(from);
  }

  public async addOrUpdate(name: string, value: any){
    const db = databases.get(name);
    const version = Fn.ulid();
    await db.addOrUpdate({
      ...value,
      _version: version
    });
  }

  public async getVersions(){
    const res = {} as Record<string, string>;
    for (let database of databases.values()) {
      const version = await database.getMaxVersion();
      if (version){
        res[database.name] = version;
      }
    }
    return res;
  }
}

const databasesList = [
  'accounts',
  'categories',
  'directions',
  'locations',
  'movies',
  'notes',
  'schedules',
  'tags',
];
const databases = new Map<string, Database<any>>(databasesList.map(x => [x, new Database<any>(x)]));
