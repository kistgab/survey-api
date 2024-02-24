import SignUpValidationFactory from "@src/main/factories/controllers/authentication/signup/signup-validation-factory";
import { RequestSignUpBody } from "@src/presentation/controllers/authentication/signup/signup-controller";
import Validation from "@src/presentation/protocols/validation";
import EmailValidator from "@src/validation/protocols/email-validator";
import CompareFieldsValidation from "@src/validation/validators/compare-fields/compare-fields-validation";
import ValidationComposite from "@src/validation/validators/composite/validation-composite";
import EmailValidation from "@src/validation/validators/email/email-validation";
import RequiredFieldValidation from "@src/validation/validators/required-field/required-field-validation";

type RequestSignUpBodyKeys = keyof RequestSignUpBody;
jest.mock("@src/validation/validators/composite/validation-composite");

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
