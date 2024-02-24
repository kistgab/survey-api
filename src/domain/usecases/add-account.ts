import { InputAddAccountDto, OutputAddAccountDto } from "@src/domain/dtos/add-account-dto";

export interface AddAccount {
  add(account: InputAddAccountDto): Promise<OutputAddAccountDto | null>;
}
