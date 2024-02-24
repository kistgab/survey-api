import AccountModel from "@src/data/models/account-model";
import AddAccountModel from "@src/data/models/add-account-model";

export default interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}
