import { hash } from "bcrypt";
import Hasher from "../../data/protocols/cryptography/hasher";
export default class BCryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const encryptedValue = await hash(value, this.salt);
    return encryptedValue;
  }
}
