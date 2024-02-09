import AccountModel from "../../../models/account-model";

export default interface FindAccountByToken {
  findByToken(token: string, role?: string): Promise<AccountModel | null>;
}
