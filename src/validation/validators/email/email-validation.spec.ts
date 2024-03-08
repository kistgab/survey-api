import { RequestSignUpBody } from "@src/presentation/controllers/authentication/signup/signup-controller";
import InvalidParamError from "@src/presentation/errors/invalid-param-error";
import { mockRequestSignUpBody } from "@src/presentation/test/mock-authentication";
import EmailValidator from "@src/validation/protocols/email-validator";
import { mockEmailValidator } from "@src/validation/test/mock-email-validator";
import EmailValidation from "@src/validation/validators/email/email-validation";

type createSutReturn = {
  sut: EmailValidation<RequestSignUpBody>;
  emailValidatorStub: EmailValidator;
};

function createSut(): createSutReturn {
  const emailValidatorStub = mockEmailValidator();
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

    const response = sut.validate(mockRequestSignUpBody());

    expect(response).toEqual(new InvalidParamError("email"));
  });

  it("Should call EmailValidator with the provided email", () => {
    const { sut, emailValidatorStub } = createSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const signUpRequestBody = mockRequestSignUpBody();

    sut.validate(signUpRequestBody);

    expect(isValidSpy).toHaveBeenCalledWith(signUpRequestBody.email);
  });

  it("Should return an error when the EmailValidator throws an error", () => {
    const { sut, emailValidatorStub } = createSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error("Email validator Error");
    });

    expect(() => sut.validate(mockRequestSignUpBody())).toThrow(new Error("Email validator Error"));
  });
});
