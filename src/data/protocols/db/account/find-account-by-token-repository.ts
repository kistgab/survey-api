import AccountModel from "@src/data/models/account-model";

export default interface FindAccountByTokenRepository {
  findByToken(token: string, role?: string): Promise<AccountModel | null>;
}
