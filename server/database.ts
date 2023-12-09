import * as console from "console";
import { Collection, Filter, MongoClient, Db } from "mongodb";
import * as process from "process";

export class Database<T extends { _id: string }> {
  private static _client: MongoClient;
  private static get client() {
    return (this._client ??= new MongoClient(
      process.env.DATABASE ?? "mongodb://localhost:27017",
      {
        auth: {
          username: process.env.MONGODB_USER || "admin",
          password: process.env.MONGODB_PASSWORD || "password",
        },
      }
    ));
  }
  private static _db: Db;
  private static get db() {
    return (this._db ??= this.client.db("insight"));
  }

  private static initPromise = (async () => {
    let waitTimeout = 1000;
    while (true) {
      try {
        await Database.client.connect();
        return;
      } catch (e) {
        if (waitTimeout > 4) {
          console.error(e);
          console.log(
            `Failed init db, ${this.name}. Wait ${waitTimeout / 1000} second...`
          );
        }
        await new Promise((r) => setTimeout(r, waitTimeout));
        waitTimeout *= 2;
      }
    }
  })();

  private _db: Collection<T & { version: string }>;
  protected get db() {
    return (this._db ??= Database.db.collection<T & { version: string }>(
      this.name
    ));
  }

  constructor(public name: string) {
    this.getIndexOrCreate();
  }

  async remove(key: string) {
    await Database.initPromise;
    await this.db.deleteOne({
      _id: { $eq: key },
    } as Filter<T & { version: string }>);
  }

  async addOrUpdate(value: T & { version: string }) {
    await Database.initPromise;
    await this.db.updateOne(
      {
        _id: { $eq: value._id },
      } as Filter<T & { version: string }>,
      {
        $set: value,
      },
      {
        upsert: true,
      }
    );
  }

  async getSince(revision: string = undefined): Promise<T[]> {
    await Database.initPromise;
    if (revision) {
      const result = this.db.find({
        version: { $gte: revision },
      } as Filter<T & { version: string }>);
      return result.map((x) => x as T).toArray();
    } else {
      const result = this.db.find({});
      return result.map((x) => x as T).toArray();
    }
  }

  async getMaxVersion(): Promise<string> {
    await Database.initPromise;
    const result = await this.db
      .find({})
      .sort({ version: -1 })
      .limit(1)
      .map((x) => x.version)
      .toArray();
    console.log(result);
    return result[0];
  }

  private async getIndexOrCreate(): Promise<string> {
    await Database.initPromise;
    const indexName = "version";
    try {
      const collections = await Database.db.collections();
      if (!collections.some((x) => x.collectionName == this.name))
        await Database.db.createCollection(this.name, {
          clusteredIndex: {
            name: "_id",
            key: { _id: 1 },
            unique: true,
          },
        });
      const indexes = await this.db.indexes();
      const index = indexes.find((x) => x.name == indexName);
      if (index) return indexName;
      await this.db.createIndex(
        {
          version: -1,
        },
        {
          name: indexName,
        }
      );
      return indexName;
    } catch (e) {
      console.log(`Failed create index on ${this.name}.`);
      console.log(e);
    }
  }

  async get(value: string) {
    await Database.initPromise;
    return this.db.findOne({ _id: { $eq: value } } as Filter<
      T & { version: string }
    >);
  }
}
