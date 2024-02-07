import { InputAddAccountDto, OutputAddAccountDto } from "../dtos/add-account-dto";

export interface AddAccount {
  add(account: InputAddAccountDto): Promise<OutputAddAccountDto | null>;
}
