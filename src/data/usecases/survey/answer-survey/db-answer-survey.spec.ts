import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { DbAnswerSurvey } from "@src/data/usecases/survey/answer-survey/db-answer-survey";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import * as Mockdate from "mockdate";

function createFakeSurveyAnswerRequest(): SurveyAnswerModel {
  return {
    id: "valid_id",
    accountId: "valid_account_id",
    surveyId: "valid_survey_id",
    answer: "valid_answer",
    date: new Date(),
  };
}

function createFakeInputDto(): InputAnswerSurveyDto {
  return {
    accountId: "valid_account_id",
    surveyId: "valid_survey_id",
    answer: "valid_answer",
    date: new Date(),
  };
}

function createSaveSurveyAnswerRepositoryStub(): SaveSurveyAnswerRepository {
  class SaveSurveyRepositoryStub implements SaveSurveyAnswerRepository {
    async save(): Promise<SurveyAnswerModel> {
      return Promise.resolve(createFakeSurveyAnswerRequest());
    }
  }
  return new SaveSurveyRepositoryStub();
}

type SutTypes = {
  sut: DbAnswerSurvey;
  saveSurveyAnswerRepositoryStub: SaveSurveyAnswerRepository;
};

function createSut(): SutTypes {
  const saveSurveyAnswerRepositoryStub = createSaveSurveyAnswerRepositoryStub();
  const sut = new DbAnswerSurvey(saveSurveyAnswerRepositoryStub);
  return {
    sut,
    saveSurveyAnswerRepositoryStub,
  };
}

describe("DbAnswerSurvey UseCase", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("should call AddSurveyRepository with correct values", async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = createSut();
    const addSpy = jest.spyOn(saveSurveyAnswerRepositoryStub, "save");
    const input = createFakeInputDto();

    await sut.answer(input);

    expect(addSpy).toHaveBeenCalledWith({ ...input, date: new Date() });
  });
});
