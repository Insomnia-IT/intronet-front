import fs from "fs";
import {Buffer} from "node:buffer";
import {createCipheriv, createDecipheriv, randomBytes} from "crypto";

const algorithm = 'aes-256-cbc';

const key = getOrCreateKey("./secret.key", 32);

function encrypt(text) {
  const iv = randomBytes(16);
  let cipher = createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return  iv.toString('hex')+encrypted.toString('hex');
}

function decrypt(text: string) {
  let iv = Buffer.from(text.substring(0, 16), 'hex');
  let encryptedText = Buffer.from(text.substring(16), 'hex');

  let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

function getOrCreateKey(file: string, size: number){
  try {
      const result = fs.readFileSync(file);
      if (!result.length) throw new Error('Empty file');
      return  result;
  }catch (e){
      const buffer = randomBytes(size);
      fs.writeFileSync(file, buffer);
      return  buffer;
  }
}

export {encrypt, decrypt};
