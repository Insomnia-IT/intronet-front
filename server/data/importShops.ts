import "@cmmn/cell/lib";
import { Fn } from "@cmmn/cell/lib";
import { Database } from "../database";
import shopsJSON from "./shops.json" assert {"type": "json"};

export async function importShops(force = false) {
  const db = new Database<any>("shops");
  const shops = await db.getSince();

  if (shops.length != 0) {
    if (!force) return;
    for (let activity of shops) {
      await shops.remove(activity._id);
    }
  }
  for (let shop of shopsJSON){
    await db.addOrUpdate({
      _id: Fn.ulid(),
      version: Fn.ulid(),
      ...shop,
    })
  }
}
