import { RequestSignUpBody } from "../../presentation/controllers/signup/signup";
import CompareFieldsValidation from "../../presentation/helpers/validators/compare-fields-validation";
import EmailValidation from "../../presentation/helpers/validators/email-validation";
import RequiredFieldValidation from "../../presentation/helpers/validators/required-field-validation";
import Validation from "../../presentation/helpers/validators/validation";
import ValidationComposite from "../../presentation/helpers/validators/validation-composite";
import EmailValidatorAdapter from "../../utils/email-validator-adapter";
import SignUpValidationFactory from "./signup-validation";

type RequestSignUpBodyKeys = keyof RequestSignUpBody;
jest.mock("../../presentation/helpers/validators/validation-composite");

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
    validations.push(new EmailValidation<RequestSignUpBody>(new EmailValidatorAdapter(), "email"));

    SignUpValidationFactory.create();

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
