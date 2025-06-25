import { Fn } from "@cmmn/core";
import { Database } from "../database";
import { dbCtrl } from "../db-ctrl";
import mainPageJSON from "./main-page.json" assert { type: "json" };


export async function importMainPage(force = false) {
  const db = Database.Get<any>("main");
  const cards = await db.getSince();
  if (cards.length) {
    if (!force) return;
    for (let card of cards) {
      await db.remove(card._id);
    }
    cards.length = 0;
  }
  // console.log('_____', activities)
  if (cards.length > 0) return;
  for (let card of mainPageJSON as Array<any>) {
    await db.addOrUpdate({
      ...card,
      version: Fn.ulid(),
    });
  }
  dbCtrl.versions = undefined;
}
