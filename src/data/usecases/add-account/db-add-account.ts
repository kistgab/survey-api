import { InputAddAccountDto, OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import Encrypter from "../../protocols/cryptography/encrypter";
import AddAccountRepository from "../../protocols/db/add-account-repository";

export default class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(account: InputAddAccountDto): Promise<OutputAddAccountDto> {
    const encryptedPassword = await this.encrypter.encrypt(account.password);
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
