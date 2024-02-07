import EmailValidatorAdapter from "../../../../infra/validators/email/email-validator-adapter";
import { RequestSignUpBody } from "../../../../presentation/controllers/signup/signup-controller";
import Validation from "../../../../presentation/protocols/validation";
import CompareFieldsValidation from "../../../../validation/validators/compare-fields/compare-fields-validation";
import ValidationComposite from "../../../../validation/validators/composite/validation-composite";
import EmailValidation from "../../../../validation/validators/email/email-validation";
import RequiredFieldValidation from "../../../../validation/validators/required-field/required-field-validation";

type RequestSignUpBodyKeys = keyof RequestSignUpBody;

export default abstract class SignUpValidationFactory {
  static create(): Validation<unknown> {
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
    return new ValidationComposite(validations);
  }
}
