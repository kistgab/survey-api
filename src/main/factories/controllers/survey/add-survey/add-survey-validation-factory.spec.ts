import { RequestAddSurveyBody } from "../../../../../presentation/controllers/survey/add-survey/add-survey-controller";
import Validation from "../../../../../presentation/protocols/validation";
import ValidationComposite from "../../../../../validation/validators/composite/validation-composite";
import RequiredFieldValidation from "../../../../../validation/validators/required-field/required-field-validation";
import AddSurveyValidationFactory from "./add-survey-validation-factory";

type RequestAddSurveyBodyKeys = keyof RequestAddSurveyBody;
jest.mock("../../../../../validation/validators/composite/validation-composite");

describe("AddSurvey Validation Factory", () => {
  it("should call ValidationComposite with all validations", () => {
    const validations: Validation[] = [];
    const requiredFields: RequestAddSurveyBodyKeys[] = ["answers", "question"];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation<RequestAddSurveyBody>(field));
    }

    AddSurveyValidationFactory.create();

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
