import * as jwt from "jsonwebtoken";
import Encrypter from "../../../data/protocols/cryptography/encrypter";

export default class JwtAdapter implements Encrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(value: string): Promise<string> {
    await Promise.resolve(value);
    jwt.sign({ id: value }, this.secretKey);
    return "any_jwt";
  }
}
