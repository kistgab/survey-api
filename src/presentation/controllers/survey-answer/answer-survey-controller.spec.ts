import { SurveyModel } from "@src/data/models/survey-model";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
import {
  AnswerSurveyController,
  AnswerSurveyParams,
} from "@src/presentation/controllers/survey-answer/answer-survey-controller";
import { HttpRequest } from "@src/presentation/protocols/http";
import * as Mockdate from "mockdate";

function createFakeSurvey(): SurveyModel {
  return {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
    id: "any_id",
  };
}

function createListSurveyByIdStub(): ListSurveyById {
  class ListSurveyByIdStub implements ListSurveyById {
    async list(): Promise<SurveyModel | null> {
      return Promise.resolve(createFakeSurvey());
    }
  }
  return new ListSurveyByIdStub();
}

function createFakeRequest(): HttpRequest<InputAnswerSurveyDto, AnswerSurveyParams> {
  return {
    params: {
      surveyId: "any_survey_id",
    },
  };
}

type SutTypes = {
  sut: AnswerSurveyController;
  listSurveyByIdStub: ListSurveyById;
};

function createSut(): SutTypes {
  const listSurveyByIdStub = createListSurveyByIdStub();
  const sut = new AnswerSurveyController(listSurveyByIdStub);
  return {
    sut,
    listSurveyByIdStub,
  };
}

describe("AnswerSurvey Controller", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should call FindSurveyById with correct values", async () => {
    const { sut, listSurveyByIdStub } = createSut();
    const listByIdSpy = jest.spyOn(listSurveyByIdStub, "list");

    await sut.handle(createFakeRequest());

    expect(listByIdSpy).toHaveBeenCalledWith("any_survey_id");
  });
});
