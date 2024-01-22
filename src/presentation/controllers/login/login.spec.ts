import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { unprocessableContent } from "../../helpers/http-helper";
import EmailValidator from "../../protocols/email-validator";
import LoginController from "./login";

type CreateSutType = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
};

function createEmailValidatorStub(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

function createSut(): CreateSutType {
  const emailValidatorStub = createEmailValidatorStub();
  const sut = new LoginController(emailValidatorStub);
  return { sut, emailValidatorStub };
}

describe("Login Controller", () => {
  it("should return 422 if no email is provided", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        password: "any_password",
        email: "",
      },
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new MissingParamError("email")));
  });

  it("should return 422 if no password is provided", async () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        password: "",
        email: "any_email@mail.com",
      },
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new MissingParamError("password")));
  });

  it("should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorStub } = createSut();
    const httpRequest = {
      body: {
        password: "any_password",
        email: "any_email@mail.com",
      },
    };
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return 422 if the email is invalid", async () => {
    const { sut, emailValidatorStub } = createSut();
    const httpRequest = {
      body: {
        password: "any_password",
        email: "any_email@mail.com",
      },
    };
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new InvalidParamError("email")));
  });
});