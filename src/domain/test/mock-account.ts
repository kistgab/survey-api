import { AccountModel } from "@src/data/models/account-model";
import { AddAccountModel } from "@src/data/models/add-account-model";
import { InputAddAccountDto } from "@src/domain/dtos/add-account-dto";
import { InputAuthenticationDto } from "@src/domain/dtos/authentication-dto";

export function mockAccountModel(): AccountModel {
  return {
    id: "any_id",
    email: "any_email@mail.com",
    password: "any_password",
    name: "any_name",
  };
}

export function mockInputAddAccountDto(): InputAddAccountDto {
  return {
    email: "any_email@mail.com",
    password: "any_password",
    name: "any_name",
  };
}

export function mockAddAccountModel(): AddAccountModel {
  return {
    email: "any_email@mail.com",
    password: "any_password",
    name: "any_name",
  };
}

export function mockInputAuthenticationDto(): InputAuthenticationDto {
  return {
    email: "any_email@mail.com",
    password: "any_password",
  };
}
