import { InputAddAccountDto, OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import Hasher from "../../protocols/cryptography/hasher";
import AddAccountRepository from "../../protocols/db/account/add-account-repository";
import FindAccountByEmailRepository from "../../protocols/db/account/find-account-by-email-repository";

export default class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
  ) {}

  async add(account: InputAddAccountDto): Promise<OutputAddAccountDto | null> {
    const existingAccount = await this.findAccountByEmailRepository.findByEmail(account.email);
    if (existingAccount) {
      return null;
    }
    const encryptedPassword = await this.hasher.hash(account.password);
    const createdAccount = await this.addAccountRepository.add({
      email: account.email,
      name: account.name,
      password: encryptedPassword,
    });
    return {
      id: createdAccount.id,
      email: createdAccount.email,
      name: createdAccount.name,
      password: createdAccount.password,
    };
  }
}
