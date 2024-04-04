import { AccountModel } from "@src/data/models/account-model";
import Decrypter from "@src/data/protocols/cryptography/decrypter";
import FindAccountByTokenRepository from "@src/data/protocols/db/account/find-account-by-token-repository";
import FindAccountByToken from "@src/domain/usecases/account/find-account-by-token";

export default class DbFindAccountByToken implements FindAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly findAccountByRepository: FindAccountByTokenRepository,
  ) {}

  async findByToken(token: string, role?: string | undefined): Promise<AccountModel | null> {
    let decryptedToken: string | null;
    try {
      decryptedToken = await this.decrypter.decrypt(token);
    } catch (error) {
      return null;
    }
    if (!decryptedToken) {
      return null;
    }
    const account = await this.findAccountByRepository.findByToken(token, role);
    if (account) {
      return account;
    }
    return null;
  }
}
