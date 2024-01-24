import AccountModel from "../../../data/models/account-model";
import { OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import MissingParamError from "../../errors/missing-param-error";
import { internalServerError, ok, unprocessableContent } from "../../helpers/http-helper";
import Validation from "../../helpers/validators/validation";
import { HttpRequest } from "../../protocols/http";
import SignUpController, { RequestSignUpBody } from "./signup";

function createFakeRequest(): HttpRequest<RequestSignUpBody> {
  return {
    body: {
      name: "any_name",
      email: "invalid-email@mail.com",
      password: "any_password",
      passwordConfirmation: "any_password",
    },
  };
}

function createFakeAccount(): AccountModel {
  return {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email@mail.com",
    password: "valid_password",
  };
}

function createAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(): Promise<OutputAddAccountDto> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new AddAccountStub();
}

function createValidation(): Validation<string> {
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
  validationStub: Validation<unknown>;
};

function createSut(): createSutReturn {
  const addAccountStub = createAddAccount();
  const validationStub = createValidation();
  const sut = new SignUpController(addAccountStub, validationStub);
  return {
    sut,
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
    const { sut, addAccountStub: addAcountStub } = createSut();
    const addSpy = jest.spyOn(addAcountStub, "add");
    const httpRequest = createFakeRequest();

    await sut.handle(createFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body?.name,
      email: httpRequest.body?.email,
      password: httpRequest.body?.password,
    });
  });

  it("Should return 500 when the AddAccount throws an error", async () => {
    const { sut, addAccountStub: addAcountStub } = createSut();
    jest.spyOn(addAcountStub, "add").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(internalServerError(new Error("stack")));
  });

  it("Should return 200 when the creation was sucessfull", async () => {
    const { sut } = createSut();

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(ok(createFakeAccount()));
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
});
