import InvalidParamError from "../errors/invalid-param-error";
import MissingParamError from "../errors/missing-param-error";
import EmailValidator from "../protocols/email-validator";
import SignUpController from "./signup";

type createSutReturn = { sut: SignUpController; emailValidatorStub: EmailValidator };

function createSut(): createSutReturn {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
}

describe("SignUp Controller", () => {
  it("Should return 422 when name is not provided", () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("Should return 422 when email is not provided", () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("Should return 422 when password is not provided", () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("Should return 422 when password confirmation is not provided", () => {
    const { sut } = createSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "",
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });

  it("Should return 422 when an invalid email provided", () => {
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

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(422);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});
