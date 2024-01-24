import { RequestSignUpBody } from "../../presentation/controllers/signup/signup";
import CompareFieldsValidation from "../../presentation/helpers/validators/compare-fields-validation";
import RequiredFieldValidation from "../../presentation/helpers/validators/required-field-validation";
import Validation from "../../presentation/helpers/validators/validation";
import ValidationComposite from "../../presentation/helpers/validators/validation-composite";

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
    return new ValidationComposite(validations);
  }
}
