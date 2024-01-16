import AccountModel from "../models/account-model";
import AddAccountModel from "../models/add-account-model";

export default interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
