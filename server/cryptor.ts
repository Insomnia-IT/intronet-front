import * as console from "console";
import fs from "fs";
import {Buffer} from "node:buffer";
import {createCipheriv, createDecipheriv, randomBytes} from "crypto";
import * as path from "path";

const algorithm = 'aes-256-cbc';

const key = getOrCreateKey("./secrets/secret.key", 32);

function encrypt(text) {
  const iv = randomBytes(16);
  let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return  iv.toString('hex')+encrypted.toString('hex');
}

function decrypt(text: string) {
  let iv = Buffer.from(text.substring(0, 32), 'hex');
  let encryptedText = Buffer.from(text.substring(32), 'hex');

  let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

function getOrCreateKey(file: string, size: number){
  try {
      const result = fs.readFileSync(file, "utf-8");
      if (!result.length) throw new Error('Empty file');
      return Buffer.from(result, "hex");
  }catch (e){
      const buffer = randomBytes(size);
      fs.mkdirSync(path.dirname(file), {recursive: true});
      fs.writeFileSync(file, buffer.toString("hex"), "utf-8");
      return  buffer;
  }
}

export {encrypt, decrypt};


