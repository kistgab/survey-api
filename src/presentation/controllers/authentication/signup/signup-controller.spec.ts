import AccountModel from "../../../../data/models/account-model";
import { OutputAddAccountDto } from "../../../../domain/dtos/add-account-dto";
import Authentication from "../../../../domain/usecases/authentication";
import EmailAlreadyUsedError from "../../../errors/email-already-used-error";
import MissingParamError from "../../../errors/missing-param-error";
import {
  conflict,
  internalServerError,
  ok,
  unprocessableContent,
} from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols/http";
import Validation from "../../../protocols/validation";
import { AddAccount } from "./../../../../domain/usecases/add-account";
import SignUpController, { RequestSignUpBody } from "./signup-controller";

function createFakeRequest(): HttpRequest<RequestSignUpBody> {
  return {
    body: {
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
  };
}

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_email@mail.com",
    password: "hashed_password",
  };
}

function createAuthenticationStub(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<string | null> {
      return Promise.resolve("any_token");
    }
  }
  return new AuthenticationStub();
}

function createAddAccountStub(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(): Promise<OutputAddAccountDto> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new AddAccountStub();
}

function createValidationStub(): Validation<string> {
  class ValidationStub implements Validation<string> {
    validate(): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
}

type createSutReturn = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  authenticationStub: Authentication;
  validationStub: Validation<unknown>;
};

function createSut(): createSutReturn {
  const addAccountStub = createAddAccountStub();
  const validationStub = createValidationStub();
  const authenticationStub = createAuthenticationStub();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);
  return {
    sut,
    authenticationStub,
    addAccountStub,
    validationStub,
  };
}

describe("SignUp Controller", () => {
  it("Should return 422 if body wasn't provided", async () => {
    const { sut } = createSut();
    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unprocessableContent(new MissingParamError("body")));
  });

  it("Should call AddAcount with correct values", async () => {
    const { sut, addAccountStub } = createSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest = createFakeRequest();

    await sut.handle(createFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body?.name,
      email: httpRequest.body?.email,
      password: httpRequest.body?.password,
    });
  });

  it("Should return 500 when the AddAccount throws an error", async () => {
    const { sut, addAccountStub } = createSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(internalServerError(new Error("stack")));
  });

  it("Should return 409 when AddAccount returns null", async () => {
    const { sut, addAccountStub } = createSut();
    jest.spyOn(addAccountStub, "add").mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(conflict(new EmailAlreadyUsedError()));
  });

  it("Should return 200 when the creation was sucessfull", async () => {
    const { sut } = createSut();

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  it("Should call Validation with correct values", async () => {
    const { sut, validationStub } = createSut();
    const addSpy = jest.spyOn(validationStub, "validate");
    const input = createFakeRequest();

    await sut.handle(input);

    expect(addSpy).toHaveBeenCalledWith(input.body);
  });

  it("Should return 422 if Validation returns an error", async () => {
    const { sut, validationStub } = createSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error("any_error"));
    const input = createFakeRequest();

    const result = await sut.handle(input);

    expect(result).toEqual(unprocessableContent(new Error("any_error")));
  });

  it("should call Authentication with correct params", async () => {
    const { sut, authenticationStub } = createSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(createFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" });
  });

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = createSut();
    const httpRequest = createFakeRequest();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      throw new Error("Authentication error");
    });

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(internalServerError(new Error("Authentication error")));
  });
});
