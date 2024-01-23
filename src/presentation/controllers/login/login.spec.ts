import Authentication from "../../../domain/usecases/authentication";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { internalServerError, unauthorized, unprocessableContent } from "../../helpers/http-helper";
import EmailValidator from "../../protocols/email-validator";
import { HttpRequest } from "./../../protocols/http";
import LoginController, { RequestLoginBody } from "./login";

function createFakeRequest(): HttpRequest<RequestLoginBody> {
  return {
    body: {
      password: "any_password",
      email: "any_email@mail.com",
    },
  };
}

type CreateSutType = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
};

function createAuthenticationStub(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<string | null> {
      return Promise.resolve("any_token");
    }
  }
  return new AuthenticationStub();
}

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
  const authenticationStub = createAuthenticationStub();
  const sut = new LoginController(emailValidatorStub, authenticationStub);
  return { sut, emailValidatorStub, authenticationStub };
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
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await sut.handle(createFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return 422 if the email is invalid", async () => {
    const { sut, emailValidatorStub } = createSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const result = await sut.handle(createFakeRequest());

    expect(result).toEqual(unprocessableContent(new InvalidParamError("email")));
  });

  it("should return 422 if no body is provided", async () => {
    const { sut } = createSut();
    const httpRequest = {} as HttpRequest<RequestLoginBody>;

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new MissingParamError("body")));
  });

  it("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = createSut();
    const httpRequest = createFakeRequest();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error("Email Validator Error");
    });

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(internalServerError(new Error("Email Validator Error")));
  });

  it("should call Authentication with correct params", async () => {
    const { sut, authenticationStub } = createSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(createFakeRequest());

    expect(authSpy).toHaveBeenCalledWith("any_email@mail.com", "any_password");
  });

  it("should return 401 if invalid credentials were provided", async () => {
    const { sut, authenticationStub } = createSut();
    const httpRequest = createFakeRequest();
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unauthorized());
  });
});
