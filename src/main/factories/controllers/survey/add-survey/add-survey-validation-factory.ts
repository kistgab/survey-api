import { RequestAddSurveyBody } from "@src/presentation/controllers/survey/add-survey/add-survey-controller";
import Validation from "@src/presentation/protocols/validation";
import ValidationComposite from "@src/validation/validators/composite/validation-composite";
import RequiredFieldValidation from "@src/validation/validators/required-field/required-field-validation";

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
