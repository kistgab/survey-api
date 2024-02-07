import EmailValidatorAdapter from "../../../../infra/validators/email/email-validator-adapter";
import { RequestLoginBody } from "../../../../presentation/controllers/login/login-controller";
import Validation from "../../../../presentation/protocols/validation";
import ValidationComposite from "../../../../validation/validators/composite/validation-composite";
import EmailValidation from "../../../../validation/validators/email/email-validation";
import RequiredFieldValidation from "../../../../validation/validators/required-field/required-field-validation";

type RequestLoginBodyKeys = keyof RequestLoginBody;

export default abstract class LoginValidationFactory {
  static create(): Validation<unknown> {
    const validations: Validation<unknown>[] = [];
    const requiredFields: RequestLoginBodyKeys[] = ["password", "email"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestLoginBody>(field));
    }
    validations.push(new EmailValidation<RequestLoginBody>(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
  }
}
