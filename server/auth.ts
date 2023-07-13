import {UserInfo} from "./auth.ctrl";
import {databasesList} from "./db-ctrl";

export function checkWriteAccess(user: UserInfo, db: (typeof databasesList)[number], value: Record<string, any>){
  switch (db){
    case "notes":
      if (!user) {
        value.isApproved = false;
      }
      return true;
    default:
      return !!user && (user.role !== 'tochka');
  }
}
