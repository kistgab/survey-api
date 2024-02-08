import Authentication from "../../../../domain/usecases/authentication";
import MissingParamError from "../../../errors/missing-param-error";
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableContent,
} from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols/http";
import Validation from "../../../protocols/validation";
import LoginController, { RequestLoginBody } from "./login-controller";

function createFakeRequest(): HttpRequest<RequestLoginBody> {
  return {
    body: {
      password: "any_password",
      email: "any_email@mail.com",
    },
  };
}

function createValidation(): Validation<string> {
  class ValidationStub implements Validation<string> {
    validate(): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
}

function createAuthenticationStub(): Authentication {
  class AuthenticationStub implements Authentication {
    async auth(): Promise<string | null> {
      return Promise.resolve("any_token");
    }
  }
  return new AuthenticationStub();
}

type CreateSutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

function createSut(): CreateSutTypes {
  const authenticationStub = createAuthenticationStub();
  const validationStub = createValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return { sut, authenticationStub, validationStub };
}

describe("Login Controller", () => {
  it("should return 422 if no body is provided", async () => {
    const { sut } = createSut();
    const httpRequest = {} as HttpRequest<RequestLoginBody>;

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unprocessableContent(new MissingParamError("body")));
  });

  it("should call Authentication with correct params", async () => {
    const { sut, authenticationStub } = createSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    await sut.handle(createFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" });
  });

  it("should return 401 if invalid credentials were provided", async () => {
    const { sut, authenticationStub } = createSut();
    const httpRequest = createFakeRequest();
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unauthorized());
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

  it("should return 200 if valid credentials were provided", async () => {
    const { sut } = createSut();
    const httpRequest = createFakeRequest();

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(ok({ accessToken: "any_token" }));
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
