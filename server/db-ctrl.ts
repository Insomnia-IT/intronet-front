import {Database} from "./database";

export const dbCtrl = new class {

  public async get(name: string, from: string = undefined){
    const db = databases.get(name);
    return db.getSince(from);
  }

  public async addOrUpdate(name: string, value: any){
    const db = databases.get(name);
    await db.addOrUpdate(value);
    if (this.versions) {
      this.versions[name].max = value.version;
    }
  }

  versions: Record<string, {min: string, max: string}> = undefined;
  public async getVersions(){
    if (this.versions)
      return this.versions;
    const versions = {};
    for (let database of databases.values()) {
      const maxVersion = await database.getMaxVersion();
      const minVersion = await database.getMinVersion();
      if (minVersion && maxVersion){
        versions[database.name] = {min: minVersion, max: maxVersion};
      }
    }
    return this.versions = versions;
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
  'shops'
];
export const databases = new Map<string, Database<any>>(databasesList.map(x => [x, Database.Get<any>(x)]));
