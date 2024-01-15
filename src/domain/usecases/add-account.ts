export interface InputAddAccountDto {
  name: string;
  email: string;
  password: string;
}

export interface OutputAddAccountDto {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface AddAccount {
  add(account: InputAddAccountDto): OutputAddAccountDto;
}
