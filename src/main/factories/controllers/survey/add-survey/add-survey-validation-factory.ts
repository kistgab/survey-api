import { RequestAddSurveyBody } from "../../../../../presentation/controllers/survey/add-survey/add-survey-controller";

import Validation from "../../../../../presentation/protocols/validation";
import ValidationComposite from "../../../../../validation/validators/composite/validation-composite";
import RequiredFieldValidation from "../../../../../validation/validators/required-field/required-field-validation";

type RequestAddSurveyBodyKeys = keyof RequestAddSurveyBody;

export default abstract class AddSurveyValidationFactory {
  static create(): ValidationComposite {
    const validations: Validation[] = [];
    const requiredFields: RequestAddSurveyBodyKeys[] = ["answers", "question"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestAddSurveyBody>(field));
    }
    return new ValidationComposite(validations);
  }
}
