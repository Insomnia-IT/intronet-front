import PouchDB from "pouchdb";
import pouchdb_adapter_memory from "pouchdb-adapter-memory";
PouchDB.plugin(pouchdb_adapter_memory);

export default class PouchDBLocal extends PouchDB{
  constructor(name: string) {
    super(name, name.startsWith('http') ? undefined : {adapter: 'memory'});
  }

}
