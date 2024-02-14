import FindAccountByToken from "../../../../domain/usecases/find-account-by-token";
import AccountModel from "../../../models/account-model";
import Decrypter from "../../../protocols/cryptography/decrypter";
import FindAccountByTokenRepository from "../../../protocols/db/account/find-account-by-token-repository";

export default class DbFindAccountByToken implements FindAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly findAccountByRepository: FindAccountByTokenRepository,
  ) {}

  async findByToken(token: string, role?: string | undefined): Promise<AccountModel | null> {
    const accessToken = await this.decrypter.decrypt(token);
    if (!accessToken) {
      return null;
    }
    const account = await this.findAccountByRepository.findByToken(accessToken, role);
    if (account) {
      return account;
    }
    return null;
  }
}
