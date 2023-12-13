import {Fn, groupBy, orderBy} from "@cmmn/core";
import { Database } from "./database";

const voteDB = Database.Get<{
  _id: string;
  animation: string;
  uid: string;
  ip: string;
  datetime: string;
}>("votes");

export function vote(data: { id: string; uid: string; ip: string }) {
  return voteDB.addOrUpdate({
    _id: Fn.ulid(),
    version: Fn.ulid(),
    animation: data.id,
    uid: data.uid,
    ip: data.ip,
    datetime: new Date().toISOString(),
  });
}

export async function getResults() {
  const votes = await voteDB.getSince();
  const unordered = Array.from(groupBy(votes, (x) => x.animation).entries())
    .map(([id, votes]) => ({ id, count: votes.length }));
  return orderBy(unordered, x => -x.count);
}
