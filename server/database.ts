import * as console from "console";
import PouchDB from "pouchdb";
import upsertPlugin from "pouchdb-upsert";
import findPlugin from "pouchdb-find";
PouchDB.plugin(upsertPlugin);
PouchDB.plugin(findPlugin);

export class Database<T extends { _id: string }> {
  protected db = new PouchDB<T & { version: string }>(
    `${process.env.DATABASE || "http://admin:password@localhost:5984"}/${
      this.name
    }`,{
      auth: {
        username: process.env.COUCHDB_USER || 'admin',
        password: process.env.COUCHDB_PASSWORD || 'password',
      }
    }
  );
  protected index = this.getIndexOrCreate();

  constructor(public name: string) {}

  async remove(key: string) {
    const rev = await this.db.get(key).then((x) => x._rev);
    await this.db.remove({
      _id: key.toString(),
      _rev: rev ?? null,
    });
  }

  async addOrUpdate(value: T & { version: string }) {
    await this.db.upsert(value._id, () => value);
  }

  async getSince(revision: string = undefined): Promise<T[]> {
    const index = await this.index;
    if (revision) {
      const result = await this.db.find({
        selector: {
          version: { $gte: revision },
        },
        use_index: index,
      });
      return result.docs;
    } else {
      const result = await this.db.allDocs({
        include_docs: true,
      });
      return result.rows
        .filter((x) => !x.id.startsWith("_design"))
        .map((x) => x.doc);
    }
  }

  async getMaxVersion(): Promise<string> {
    const index = await this.index;
    const result = await this.db.find({
      fields: ["version"],
      selector: {},
      sort: [
        {
          version: "desc",
        },
      ],
      // limit: 1,
      use_index: index,
    });
    return result.docs[0]?.version ?? null;
  }

  private async getIndexOrCreate(): Promise<string> {
    const indexName = "version";
    try {
      const index = await this.db
        .getIndexes()
        .then((x) => x.indexes.find((c) => c.name == indexName));
      // await this.db.deleteIndex(index);
      // for (let index of indexes) {
      //   await this.db.deleteIndex(index);
      // }
      if (index) return indexName;
      await this.db.createIndex({
        index: {
          fields: ["version"],
          name: "version",
        },
      });
      return indexName;
    } catch (e) {
      console.log(`Failed init db, ${this.name}. Wait 1 second...`)
      await new Promise(x => setTimeout(x, 1000));
      return await this.getIndexOrCreate();
    }
  }

  get(value: string) {
    return this.db.get(value);
  }
}
