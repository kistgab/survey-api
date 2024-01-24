import AccountModel from "../../models/account-model";

export default interface FindAccountByEmailRepository {
  find(email: string): Promise<AccountModel>;
}
