import { Fn } from "@cmmn/cell/lib";
import fetch from "node-fetch";
import {Database} from "../database";
import mainPageJSON from "./main-page.json" assert {type: "json"};

export async function importMainPage(force = false){

  const db = new Database<any>("main");
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
      version: Fn.ulid()
    });
  }
}
