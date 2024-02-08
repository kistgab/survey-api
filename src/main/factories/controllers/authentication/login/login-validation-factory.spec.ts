import { RequestLoginBody } from "../../../../../presentation/controllers/authentication/login/login-controller";
import Validation from "../../../../../presentation/protocols/validation";
import EmailValidator from "../../../../../validation/protocols/email-validator";
import ValidationComposite from "../../../../../validation/validators/composite/validation-composite";
import EmailValidation from "../../../../../validation/validators/email/email-validation";
import RequiredFieldValidation from "../../../../../validation/validators/required-field/required-field-validation";
import LoginValidationFactory from "./login-validation-factory";

type RequestLoginBodyKeys = keyof RequestLoginBody;
jest.mock("../../../../../validation/validators/composite/validation-composite");

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
    const validations: Validation<unknown>[] = [];
    const requiredFields: RequestLoginBodyKeys[] = ["password", "email"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestLoginBody>(field));
    }
    validations.push(new EmailValidation<RequestLoginBody>(createEmailValidatorStub(), "email"));

    LoginValidationFactory.create();

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
