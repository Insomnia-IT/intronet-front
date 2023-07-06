import "@cmmn/cell/lib";
import { Database } from "../database";
import json from "./locations2.json" assert {"type": "json"};

const importFromNotion = false;
export async function importLocationss(force = false) {
  const locationsDB = new Database<any>("locations");
  const locations = await locationsDB.getSince();

  if (locations.length != 0) {
    if (!force) return;
    for (let location of locations) {
      await locationsDB.remove(location._id);
    }
  }

  for (let item of json){
    await locationsDB.addOrUpdate(item as any);
  }
}
