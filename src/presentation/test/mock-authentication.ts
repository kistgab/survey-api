import { OutputAddAccountDto } from "@src/domain/dtos/add-account-dto";
import { mockAccountModel } from "@src/domain/test/mock-account";
import { AddAccount } from "@src/domain/usecases/account/add-account";
import Authentication from "@src/domain/usecases/account/authentication";
import { RequestLoginBody } from "@src/presentation/controllers/authentication/login/login-controller";
import { RequestSignUpBody } from "@src/presentation/controllers/authentication/signup/signup-controller";
import { HttpRequest } from "@src/presentation/protocols/http";

export function mockRequestSignUpBody(): RequestSignUpBody {
  return {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  };
}

export function mockRequestLoginBody(): HttpRequest<RequestLoginBody> {
  return {
    body: {
      password: "any_password",
      email: "any_email@mail.com",
    },
  };
}

export function mockAuthentication(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<string | null> {
      return Promise.resolve("any_token");
    }
  }
  return new AuthenticationStub();
}

export function mockAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(): Promise<OutputAddAccountDto> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
}
