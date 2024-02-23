import LoginValidationFactory from "@src/main/factories/controllers/authentication/login/login-validation-factory";
import { RequestLoginBody } from "@src/presentation/controllers/authentication/login/login-controller";
import Validation from "@src/presentation/protocols/validation";
import EmailValidator from "@src/validation/protocols/email-validator";
import ValidationComposite from "@src/validation/validators/composite/validation-composite";
import EmailValidation from "@src/validation/validators/email/email-validation";
import RequiredFieldValidation from "@src/validation/validators/required-field/required-field-validation";

type RequestLoginBodyKeys = keyof RequestLoginBody;
jest.mock("@src/validation/validators/composite/validation-composite");

function createEmailValidatorStub(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

describe("Login Validation Factory", () => {
  it("should call ValidationComposite with all validations", () => {
    const validations: Validation[] = [];
    const requiredFields: RequestLoginBodyKeys[] = ["password", "email"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestLoginBody>(field));
    }
    validations.push(new EmailValidation<RequestLoginBody>(createEmailValidatorStub(), "email"));

    LoginValidationFactory.create();

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
