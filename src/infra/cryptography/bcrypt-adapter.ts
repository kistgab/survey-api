import { compare, hash } from "bcrypt";
import HashComparer from "../../data/protocols/cryptography/hash-comparer";
import Hasher from "../../data/protocols/cryptography/hasher";
export default class BCryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const encryptedValue = await hash(value, this.salt);
    return encryptedValue;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const areSameText = await compare(value, hash);
    return areSameText;
  }
}
