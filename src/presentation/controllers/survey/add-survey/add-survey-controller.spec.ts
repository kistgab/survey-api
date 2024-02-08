import { HttpRequest } from "../../../protocols/http";
import Validation from "../../../protocols/validation";
import { AddSurveyController, RequestAddSurveyBody } from "./add-survey-controller";

function createFakeRequest(): HttpRequest<RequestAddSurveyBody> {
  return {
    body: {
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
    },
  };
}

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
};

function createSut(): SutTypes {
  class ValidationStub implements Validation {
    validate(): Error | undefined {
      return;
    }
  }
  const validationStub = new ValidationStub();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub,
  };
}

describe("Add Survey Controller", () => {
  it("should call Validation with correct values", async () => {
    const { validationStub, sut } = createSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = createFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
