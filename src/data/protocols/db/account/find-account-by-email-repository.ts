import { AccountModel } from "@src/data/models/account-model";

export default interface FindAccountByEmailRepository {
  findByEmail(email: string): Promise<AccountModel | null>;
}
