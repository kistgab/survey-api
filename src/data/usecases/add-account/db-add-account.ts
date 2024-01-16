import { InputAddAccountDto, OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import Encrypter from "../../protocols/encrypter";

export default class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: InputAddAccountDto): Promise<OutputAddAccountDto> {
    await Promise.resolve(account);
    const encryptedPassword = await this.encrypter.encrypt(account.password);
    encryptedPassword;
    return Promise.resolve({} as OutputAddAccountDto);
  }
}
