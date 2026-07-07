import "@cmmn/cell";
import { Fn } from "@cmmn/core";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import shopsJSON from "./shops.json" assert { "type": "json" };

export async function importShops(force = false) {
  const db = Database.Get<any>("shops");
  const shops = await db.getSince();

  if (shops.length != 0) {
    if (!force) return;
    await db.clear();
  }
  for (let shop of shopsJSON) {
    await db.addOrUpdate({
      _id: Fn.ulid(),
      version: Fn.ulid(),
      ...shop,
    });
  }
  
}
