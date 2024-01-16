import { InputAddAccountDto, OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import AddAccountRepository from "../../protocols/add-account-repository";
import Encrypter from "../../protocols/encrypter";

export default class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(account: InputAddAccountDto): Promise<OutputAddAccountDto> {
    await Promise.resolve(account);
    const encryptedPassword = await this.encrypter.encrypt(account.password);
    const createdAccount = await this.addAccountRepository.add({
      email: account.email,
      name: account.name,
      password: encryptedPassword,
    });
    createdAccount;
    return Promise.resolve({} as OutputAddAccountDto);
  }
}