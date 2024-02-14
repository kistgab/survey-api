import AddSurvey from "../../../../domain/usecases/add-survey";
import {
  internalServerError,
  noContent,
  unprocessableContent,
} from "../../../helpers/http/http-helper";
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

function createAddSurveyStub(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyStub();
}

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

function createSut(): SutTypes {
  const addSurveyStub = createAddSurveyStub();
  const validationStub = createValidationStub();
  const sut = new AddSurveyController(validationStub, addSurveyStub);
  return {
    sut,
    addSurveyStub,
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

  it("should return 422 if Validation fails", async () => {
    const { validationStub, sut } = createSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new Error("Validation error"));

    const response = await sut.handle(createFakeRequest());

    expect(response).toEqual(unprocessableContent(new Error("Validation error")));
  });

  it("should call AddSurvey with correct values", async () => {
    const { addSurveyStub, sut } = createSut();
    const addSpy = jest.spyOn(addSurveyStub, "add");
    const httpRequest = createFakeRequest();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 500 if AddSurvey throws", async () => {
    const { addSurveyStub, sut } = createSut();
    jest
      .spyOn(addSurveyStub, "add")
      .mockReturnValueOnce(Promise.reject(new Error("AddSurvey error")));

    const response = await sut.handle(createFakeRequest());

    expect(response).toEqual(internalServerError(new Error("AddSurvey error")));
  });

  it("should return 204 on success", async () => {
    const { sut } = createSut();
    const response = await sut.handle(createFakeRequest());

    expect(response).toEqual(noContent());
  });
});
