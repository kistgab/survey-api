import DbAddAccount from "@src/data/usecases/account/add-account/db-add-account";
import { AddAccount } from "@src/domain/usecases/add-account";
import BCryptAdapter from "@src/infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMongoRepository } from "@src/infra/db/mongodb/account/account-mongo-repository";

export default abstract class DbAddAccountFactory {
  static create(): AddAccount {
    const salt = 12;
    const hasher = new BCryptAdapter(salt);
    const accountRepository = new AccountMongoRepository();
    return new DbAddAccount(hasher, accountRepository, accountRepository);
  }
}
