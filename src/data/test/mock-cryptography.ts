import Encrypter from "@src/data/protocols/cryptography/encrypter";
import HashComparer from "@src/data/protocols/cryptography/hash-comparer";
import Hasher from "@src/data/protocols/cryptography/hasher";

export function mockHasher(): Hasher {
  class HasherStub implements Hasher {
    async hash(): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }
  return new HasherStub();
}

export function mockHashComparer(): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare(): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
}

export function mockEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return Promise.resolve("any_token");
    }
  }
  return new EncrypterStub();
}
