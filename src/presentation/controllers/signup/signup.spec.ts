import { AddAccount, OutputAddAccountDto } from "../../../domain/usecases/add-account";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import ServerError from "../../errors/server-error";
import EmailValidator from "../../protocols/email-validator";
import SignUpController from "./signup";

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
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
      };
      return Promise.resolve(fakeAccount);
    }
  }
  return new AddAccountStub();
}

type createSutReturn = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAcountStub: AddAccount;
};

function createSut(): createSutReturn {
  const emailValidatorStub = createEmailValidator();
  const addAcountStub = createAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAcountStub);
  return {
    sut,
    emailValidatorStub,
    addAcountStub,
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

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
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

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
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

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
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

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });

  it("Should return 422 when an invalid email provided", async () => {
    const { sut, emailValidatorStub } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid-email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  it("Should call EmailValidator with the provided email", async () => {
    const { sut, emailValidatorStub } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it("Should return 500 when the EmailValidator throws an error", async () => {
    const { sut, emailValidatorStub } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
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

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"));
  });

  it("Should return 422 if body wasn't provided", async () => {
    const { sut } = createSut();
    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("body"));
  });

  it("Should call AddAcount with correct values", async () => {
    const { sut, addAcountStub } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const addSpy = jest.spyOn(addAcountStub, "add");

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it("Should return 500 when the AddAccount throws an error", async () => {
    const { sut, addAcountStub } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    jest.spyOn(addAcountStub, "add").mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("Should return 200 when the AddAccount throws an error", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      },
    };
    const output = {
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual(output);
  });
});
