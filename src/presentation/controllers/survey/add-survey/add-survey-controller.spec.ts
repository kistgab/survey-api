import { badRequest } from "../../../helpers/http/http-helper";
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

function createValidationStub(): Validation {
  class ValidationStub implements Validation {
    validate(): Error | undefined {
      return;
    }
  }
  return new ValidationStub();
}

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
};

function createSut(): SutTypes {
  const validationStub = createValidationStub();
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

  it("should return 400 if Validation fails", async () => {
    const { validationStub, sut } = createSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error("Validation error"));

    const response = await sut.handle(createFakeRequest());

    expect(response).toEqual(badRequest(new Error("Validation error")));
  });
});
