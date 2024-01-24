import { RequestLoginBody } from "../../../presentation/controllers/login/login";
import ValidationComposite from "../../../presentation/helpers/validators/composite/validation-composite";
import EmailValidation from "../../../presentation/helpers/validators/email/email-validation";
import RequiredFieldValidation from "../../../presentation/helpers/validators/required-field/required-field-validation";
import EmailValidator from "../../../presentation/protocols/email-validator";
import Validation from "../../../presentation/protocols/validation";
import LoginValidationFactory from "./login-validation";

type RequestLoginBodyKeys = keyof RequestLoginBody;
jest.mock("../../../presentation/helpers/validators/composite/validation-composite");

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
