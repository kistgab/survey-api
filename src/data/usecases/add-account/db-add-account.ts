import { InputAddAccountDto, OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import Hasher from "../../protocols/cryptography/hasher";
import AddAccountRepository from "../../protocols/db/add-account-repository";

export default class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(account: InputAddAccountDto): Promise<OutputAddAccountDto> {
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
