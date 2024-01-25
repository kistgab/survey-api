import * as jwt from "jsonwebtoken";
import Encrypter from "../../../data/protocols/cryptography/encrypter";

export default class JwtAdapter implements Encrypter {
  constructor(private readonly secretKey: string) {}

  async encrypt(value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secretKey);
    return token;
  }
}
