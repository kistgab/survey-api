import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import { mockSaveSurveyAnswerRepository } from "@src/data/test/mock-db-survey";
import { DbAnswerSurvey } from "@src/data/usecases/survey-answer/answer-survey/db-answer-survey";
import { mockInputAnswerSurveyDto, mockSurveyResultModel } from "@src/domain/test/mock-survey";
import * as Mockdate from "mockdate";

type SutTypes = {
  sut: DbAnswerSurvey;
  saveSurveyAnswerRepositoryStub: SaveSurveyAnswerRepository;
};

function createSut(): SutTypes {
  const saveSurveyAnswerRepositoryStub = mockSaveSurveyAnswerRepository();
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
    const input = mockInputAnswerSurveyDto();

    await sut.answer(input);

    expect(addSpy).toHaveBeenCalledWith({ ...input, date: new Date() });
  });

  it("should throw when SaveSurveyAnswerRepository throws", async () => {
    const { sut, saveSurveyAnswerRepositoryStub } = createSut();
    jest
      .spyOn(saveSurveyAnswerRepositoryStub, "save")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.answer(mockInputAnswerSurveyDto())).rejects.toThrow(
      new Error("Repository error"),
    );
  });

  it("should return a survey answer on success", async () => {
    const { sut } = createSut();

    const result = await sut.answer(mockInputAnswerSurveyDto());

    expect(result).toEqual(mockSurveyResultModel());
  });
});
