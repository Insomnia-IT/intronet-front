import {UserInfo} from "./auth.ctrl";
import {databasesList} from "./db-ctrl";

export function checkAccess(user: UserInfo, db: (typeof databasesList)[number]){
  switch (db){
    default: return true;
  }
}
