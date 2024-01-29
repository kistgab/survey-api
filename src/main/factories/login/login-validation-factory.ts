import { RequestLoginBody } from "../../../presentation/controllers/login/login-controller";
import ValidationComposite from "../../../presentation/helpers/validators/composite/validation-composite";
import EmailValidation from "../../../presentation/helpers/validators/email/email-validation";
import RequiredFieldValidation from "../../../presentation/helpers/validators/required-field/required-field-validation";
import Validation from "../../../presentation/protocols/validation";
import EmailValidatorAdapter from "../../adapters/validators/email/email-validator-adapter";

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
