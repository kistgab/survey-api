import AccountModel from "../../../data/models/account-model";
import { OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { internalServerError, ok, unprocessableContent } from "../../helpers/http-helper";
import EmailValidator from "../../protocols/email-validator";
import { HttpRequest } from "../../protocols/http";
import Validation from "../../protocols/validation";
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

function createEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

function createAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(): Promise<OutputAddAccountDto> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new AddAccountStub();
}

function createValidation(): Validation {
  class ValidationStub implements Validation {
    validate(): Error | null {
      return null;
    }
  }
  return new ValidationStub();
}

type createSutReturn = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
};

function createSut(): createSutReturn {
  const emailValidatorStub = createEmailValidator();
  const addAccountStub = createAddAccount();
  const validationStub = createValidation();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
}

describe("SignUp Controller", () => {
  it("Should return 422 when name is not provided", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unprocessableContent(new MissingParamError("name")));
  });

  it("Should return 422 when email is not provided", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unprocessableContent(new MissingParamError("email")));
  });

  it("Should return 422 when password is not provided", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unprocessableContent(new MissingParamError("password")));
  });

  it("Should return 422 when password confirmation is not provided", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      unprocessableContent(new MissingParamError("passwordConfirmation")),
    );
  });

  it("Should return 422 when an invalid email provided", async () => {
    const { sut, emailValidatorStub } = createSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(unprocessableContent(new InvalidParamError("email")));
  });

  it("Should call EmailValidator with the provided email", async () => {
    const { sut, emailValidatorStub } = createSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = createFakeRequest();
    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body?.email);
  });

  it("Should return 500 when the EmailValidator throws an error", async () => {
    const { sut, emailValidatorStub } = createSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(createFakeRequest());

    expect(httpResponse).toEqual(internalServerError(new Error("stack")));
  });

  it("Should return 422 if the password confirmation fails", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "different_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      unprocessableContent(new InvalidParamError("passwordConfirmation")),
    );
  });

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
});
