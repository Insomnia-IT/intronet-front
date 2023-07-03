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
      this.versions[name] = value.version;
    }
  }

  versions: Record<string, string> = undefined;
  public async getVersions(){
    if (this.versions)
      return this.versions;
    this.versions = {};
    for (let database of databases.values()) {
      const version = await database.getMaxVersion();
      if (version){
        this.versions[database.name] = version;
      }
    }
    return this.versions;
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
  'vurchel'
];
const databases = new Map<string, Database<any>>(databasesList.map(x => [x, new Database<any>(x)]));
