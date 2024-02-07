import CompareFieldsValidation from "../../../../presentation/helpers/validators/compare-fields/compare-fields-validation";
import ValidationComposite from "../../../../presentation/helpers/validators/composite/validation-composite";
import EmailValidation from "../../../../presentation/helpers/validators/email/email-validation";
import RequiredFieldValidation from "../../../../presentation/helpers/validators/required-field/required-field-validation";
import EmailValidator from "../../../../presentation/protocols/email-validator";
import Validation from "../../../../presentation/protocols/validation";
import { RequestSignUpBody } from "./../../../../presentation/controllers/signup/signup-controller";
import SignUpValidationFactory from "./signup-validation-factory";

type RequestSignUpBodyKeys = keyof RequestSignUpBody;
jest.mock("../../../../presentation/helpers/validators/composite/validation-composite");

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
    const validations: Validation<unknown>[] = [];
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
