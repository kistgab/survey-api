import { RequestSignUpBody } from "../../../presentation/controllers/authentication/signup/signup-controller";
import InvalidParamError from "../../../presentation/errors/invalid-param-error";
import EmailValidator from "../../protocols/email-validator";
import EmailValidation from "./email-validation";

function createFakeInput(): RequestSignUpBody {
  return {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
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

type createSutReturn = {
  sut: EmailValidation<RequestSignUpBody>;
  emailValidatorStub: EmailValidator;
};

function createSut(): createSutReturn {
  const emailValidatorStub = createEmailValidator();
  const sut = new EmailValidation(emailValidatorStub, "email");
  return {
    sut,
    emailValidatorStub,
  };
}

describe("Email Validation", () => {
  it("Should return an error when EmailValidator returns false", () => {
    const { sut, emailValidatorStub } = createSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);

    const response = sut.validate(createFakeInput());

    expect(response).toEqual(new InvalidParamError("email"));
  });

  it("Should call EmailValidator with the provided email", () => {
    const { sut, emailValidatorStub } = createSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const signUpRequestBody = createFakeInput();

    sut.validate(signUpRequestBody);

    expect(isValidSpy).toHaveBeenCalledWith(signUpRequestBody.email);
  });

  it("Should return an error when the EmailValidator throws an error", () => {
    const { sut, emailValidatorStub } = createSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error("Email validator Error");
    });

    expect(() => sut.validate(createFakeInput())).toThrow(new Error("Email validator Error"));
  });
});
