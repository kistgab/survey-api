import EmailValidatorAdapter from "@src/infra/validators/email/email-validator-adapter";
import { RequestSignUpBody } from "@src/presentation/controllers/authentication/signup/signup-controller";
import Validation from "@src/presentation/protocols/validation";
import CompareFieldsValidation from "@src/validation/validators/compare-fields/compare-fields-validation";
import ValidationComposite from "@src/validation/validators/composite/validation-composite";
import EmailValidation from "@src/validation/validators/email/email-validation";
import RequiredFieldValidation from "@src/validation/validators/required-field/required-field-validation";

type RequestSignUpBodyKeys = keyof RequestSignUpBody;

export default abstract class SignUpValidationFactory {
  static create(): Validation {
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
    validations.push(new EmailValidation<RequestSignUpBody>(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
  }
}
