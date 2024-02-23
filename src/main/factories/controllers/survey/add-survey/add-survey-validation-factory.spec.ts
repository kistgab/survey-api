import AddSurveyValidationFactory from "@src/main/factories/controllers/survey/add-survey/add-survey-validation-factory";
import { RequestAddSurveyBody } from "@src/presentation/controllers/survey/add-survey/add-survey-controller";
import Validation from "@src/presentation/protocols/validation";
import ValidationComposite from "@src/validation/validators/composite/validation-composite";
import RequiredFieldValidation from "@src/validation/validators/required-field/required-field-validation";

type RequestAddSurveyBodyKeys = keyof RequestAddSurveyBody;
jest.mock("@src/validation/validators/composite/validation-composite");

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
