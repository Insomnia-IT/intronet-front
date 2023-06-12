import * as console from "console";
import {randomBytes} from "crypto";
import {decrypt, encrypt} from "./cryptor";
import {Database} from "./database";

export const authCtrl = new (class {
  db = new Database<{encrypted: string, _id: string;}>("tokens");
  public async parse(token: string): Promise<UserInfo> {
    if (!token) throw new Error(`Token not provided`);
    if (!/Bearer [\w\d]+/.test(token)) throw new Error(`Token invalid`);
    const value = token.substring('Bearer '.length);
    try {
      const {encrypted} = await this.db.get(value);
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted) as UserInfo;
    }catch (e){
      const decrypted = decrypt(value);
      return JSON.parse(decrypted) as UserInfo;
    }
  }

  public async create(info: UserInfo){
    const id = randomBytes(16).toString("hex");
    const encrypted = encrypt(JSON.stringify(info));
    await this.db.addOrUpdate({
      _id: id,
      encrypted,
      version: id
    });
    return id;
  }
})();


const encrypted = encrypt(JSON.stringify({
  username: 'admin',
  role: 'superadmin'
} as UserInfo));
console.log('SUPERADMIN:', encrypted);

export type UserInfo = {
  username: string;
  role: 'superadmin'|'admin'|'tochka'
}
