/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ObjectId } from "mongodb";
import AccountModel from "../../../../data/models/account-model";
import AddAccountModel from "../../../../data/models/add-account-model";
import AddAccountRepository from "../../../../data/protocols/db/account/add-account-repository";
import FindAccountByEmailRepository from "../../../../data/protocols/db/account/find-account-by-email-repository";
import UpdateAccessTokenRepository from "../../../../data/protocols/db/account/update-access-token-repository";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository
  implements AddAccountRepository, FindAccountByEmailRepository, UpdateAccessTokenRepository
{
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

  async findByEmail(email: string): Promise<AccountModel | null> {
    const accountCollection = MongoHelper.getCollection("accounts");
    const accountData = await accountCollection.findOne({ email });
    if (!accountData) {
      return null;
    }
    const { _id, name, email: foundEmail, password } = accountData;
    const foundAccount = { id: _id.toString(), name, email: foundEmail, password };
    return foundAccount;
  }

  async updateAccessToken(userId: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { accessToken: token } },
    );
  }
}