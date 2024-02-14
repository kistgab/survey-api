import { RequestSignUpBody } from "../../../../../presentation/controllers/authentication/signup/signup-controller";
import Validation from "../../../../../presentation/protocols/validation";
import EmailValidator from "../../../../../validation/protocols/email-validator";
import CompareFieldsValidation from "../../../../../validation/validators/compare-fields/compare-fields-validation";
import ValidationComposite from "../../../../../validation/validators/composite/validation-composite";
import EmailValidation from "../../../../../validation/validators/email/email-validation";
import RequiredFieldValidation from "../../../../../validation/validators/required-field/required-field-validation";
import SignUpValidationFactory from "./signup-validation-factory";

type RequestSignUpBodyKeys = keyof RequestSignUpBody;
jest.mock("../../../../../validation/validators/composite/validation-composite");

function createEmailValidatorStub(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

describe("SignUp Validation Factory", () => {
  it("should call ValidationComposite with all validations", () => {
    const validations: Validation[] = [];
    const requiredFields: RequestSignUpBodyKeys[] = [
      "name",
      "password",
      "email",
      "passwordConfirmation",
    ];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestSignUpBody>(field));
    }
    validations.push(
      new CompareFieldsValidation<RequestSignUpBody>("password", "passwordConfirmation"),
    );
    validations.push(new EmailValidation<RequestSignUpBody>(createEmailValidatorStub(), "email"));

    SignUpValidationFactory.create();

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
