import AccountModel from "../../models/account-model";
import Decrypter from "../../protocols/cryptography/decrypter";
import FindAccountByToken from "../../protocols/db/account/find-account-by-token-repository";

export default class DbFindAccountByToken implements FindAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async findByToken(token: string, role?: string | undefined): Promise<AccountModel | null> {
    await Promise.resolve(token + role);
    await this.decrypter.decrypt(token);
    return null;
  }
}
