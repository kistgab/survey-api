import EmailValidatorAdapter from "@src/infra/validators/email/email-validator-adapter";
import { RequestLoginBody } from "@src/presentation/controllers/authentication/login/login-controller";
import Validation from "@src/presentation/protocols/validation";
import ValidationComposite from "@src/validation/validators/composite/validation-composite";
import EmailValidation from "@src/validation/validators/email/email-validation";
import RequiredFieldValidation from "@src/validation/validators/required-field/required-field-validation";

type RequestLoginBodyKeys = keyof RequestLoginBody;

export default abstract class LoginValidationFactory {
  static create(): Validation {
    const validations: Validation[] = [];
    const requiredFields: RequestLoginBodyKeys[] = ["password", "email"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestLoginBody>(field));
    }
    validations.push(new EmailValidation<RequestLoginBody>(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
  }
}
