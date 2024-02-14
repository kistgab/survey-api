import * as jwt from "jsonwebtoken";
import Decrypter from "../../../data/protocols/cryptography/decrypter";
import Encrypter from "../../../data/protocols/cryptography/encrypter";

export default class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretKey);
    return Promise.resolve(token);
  }

  async decrypt(hash: string): Promise<string | null> {
    const value = jwt.verify(hash, this.secretKey);
    return Promise.resolve(value as string);
  }
}
