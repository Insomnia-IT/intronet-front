import "@cmmn/cell";
import { Fn } from "@cmmn/core";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import shopsJSON from "./shops.json" assert { "type": "json" };

export async function importShops(force = false) {
  const db = new Database<any>("shops");
  const shops = await db.getSince();

  if (shops.length != 0) {
    if (!force) return;
    for (let shop of shops) {
      await db.remove(shop._id);
    }
  }
  for (let shop of shopsJSON) {
    await db.addOrUpdate({
      _id: Fn.ulid(),
      version: Fn.ulid(),
      ...shop,
    });
  }
  dbCtrl.versions = undefined;
}
