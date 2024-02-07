import { RequestSignUpBody } from "../../../../presentation/controllers/signup/signup-controller";
import CompareFieldsValidation from "../../../../presentation/helpers/validators/compare-fields/compare-fields-validation";
import ValidationComposite from "../../../../presentation/helpers/validators/composite/validation-composite";
import EmailValidation from "../../../../presentation/helpers/validators/email/email-validation";
import RequiredFieldValidation from "../../../../presentation/helpers/validators/required-field/required-field-validation";
import Validation from "../../../../presentation/protocols/validation";
import EmailValidatorAdapter from "../../../adapters/validators/email/email-validator-adapter";

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
