import { UserInfo } from "auth.ctrl";
import {Database} from "./database";
import fs from 'fs/promises';
import { stripLocationBinary } from "./location-image.ctrl";

export const dbCtrl = new class {

  public async get(name: string, from: string = undefined, user?: UserInfo){
    const db = databases.get(name);
    const items = await db.getSince(from);
    if (name === "locations") {
      return stripLocationBinary(items);
    }
    return items;
  }

  public async addOrUpdate(name: string, value: any){
    const db = databases.get(name);
    await db.addOrUpdate(value);
  }

  public async getVersions(user?: UserInfo){
    const versions = {};
    for (let database of databases.values()) {
      const maxVersion = await database.getMaxVersion(user);
      const minVersion = await database.getMinVersion(user);
      if (minVersion && maxVersion){
        versions[database.name] = {min: minVersion, max: maxVersion};
      }
    }
    return versions;
  }
}

export const databasesList = [
  'accounts',
  'categories',
  'directions',
  'locations',
  'movies',
  'notes',
  'schedules',
  'activities',
  'tags',
  'main',
  'news',
  'changes',
  'vurchel',
  'shops',
  'weather',
];
export const databases = new Map<string, Database<any>>(databasesList.map(x => [x, Database.Get<any>(x)]));
