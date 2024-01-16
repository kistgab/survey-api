import { hash } from "bcrypt";
import Encrypter from "../../data/protocols/encrypter";

export default class BCryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    await hash(value, this.salt);
    return Promise.resolve("");
  }
}