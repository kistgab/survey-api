import AccountModel from "../../../../data/models/account-model";
import AddAccountModel from "../../../../data/models/add-account-model";
import AddAccountRepository from "../../../../data/protocols/add-account-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const insertedAccount: AccountModel = {
      id: result.insertedId.toString(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
    };
    return insertedAccount;
  }
}
