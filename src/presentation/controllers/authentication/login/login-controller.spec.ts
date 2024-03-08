import Authentication from "@src/domain/usecases/account/authentication";
import LoginController, {
  RequestLoginBody,
} from "@src/presentation/controllers/authentication/login/login-controller";
import MissingParamError from "@src/presentation/errors/missing-param-error";
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import { HttpRequest } from "@src/presentation/protocols/http";
import Validation from "@src/presentation/protocols/validation";
import {
  mockAuthentication,
  mockRequestLoginBody,
} from "@src/presentation/test/mock-authentication";
import { mockValidation } from "@src/validation/test/mock-validation";

type CreateSutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

function createSut(): CreateSutTypes {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
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

    await sut.handle(mockRequestLoginBody());

    expect(authSpy).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" });
  });

  it("should return 401 if invalid credentials were provided", async () => {
    const { sut, authenticationStub } = createSut();
    const httpRequest = mockRequestLoginBody();
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(unauthorized());
  });

  it("should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = createSut();
    const httpRequest = mockRequestLoginBody();
    jest.spyOn(authenticationStub, "auth").mockImplementationOnce(() => {
      throw new Error("Authentication error");
    });

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(internalServerError(new Error("Authentication error")));
  });

  it("should return 200 if valid credentials were provided", async () => {
    const { sut } = createSut();
    const httpRequest = mockRequestLoginBody();

    const result = await sut.handle(httpRequest);

    expect(result).toEqual(ok({ accessToken: "any_token" }));
  });

  it("Should call Validation with correct values", async () => {
    const { sut, validationStub } = createSut();
    const addSpy = jest.spyOn(validationStub, "validate");
    const input = mockRequestLoginBody();

    await sut.handle(input);

    expect(addSpy).toHaveBeenCalledWith(input.body);
  });

  it("Should return 422 if Validation returns an error", async () => {
    const { sut, validationStub } = createSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error("any_error"));
    const input = mockRequestLoginBody();

    const result = await sut.handle(input);

    expect(result).toEqual(unprocessableContent(new Error("any_error")));
  });
});
