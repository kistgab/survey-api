import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { DbAnswerSurvey } from "@src/data/usecases/survey/answer-survey/db-answer-survey";
import { InputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import * as Mockdate from "mockdate";

function createFakeSurveyAnswer(): SurveyAnswerModel {
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
      return Promise.resolve(createFakeSurveyAnswer());
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

  it("should throw when SaveSurveyAnswerRepository throws", async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = createSut();
    jest
      .spyOn(saveSurveyAnswerRepositoryStub, "save")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.answer(createFakeInputDto())).rejects.toThrow(new Error("Repository error"));
  });

  it("should return a survey answer on success", async () => {
    const { sut } = createSut();

    const result = await sut.answer(createFakeInputDto());

    expect(result).toEqual(createFakeSurveyAnswer());
  });
});
