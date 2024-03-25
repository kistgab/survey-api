import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { mockFindSurveyByIdRepository } from "@src/data/test/mock-db-survey";
import { mockLoadSurveyResultRepository } from "@src/data/test/mock-db-survey-result";
import { DbLoadSurveyResult } from "@src/data/usecases/survey-answer/load-survey-result/db-load-survey-result";
import { mockSurveyResultModel } from "@src/domain/test/mock-survey";
import * as Mockdate from "mockdate";

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository;
};

function createSut(): SutTypes {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const findSurveyByIdRepositoryStub = mockFindSurveyByIdRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, findSurveyByIdRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub,
    findSurveyByIdRepositoryStub,
  };
}

describe("DbLoadSurveyResult UseCase", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  afterAll(() => {
    Mockdate.reset();
  });

  it("Should call LoadSurveyResultRepository", async () => {
    const { sut, loadSurveyResultRepositoryStub } = createSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId");

    await sut.load("any_survey_id");

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith("any_survey_id");
  });

  it("should throw when LoadSurveyResultRepository throws", async () => {
    const { sut, loadSurveyResultRepositoryStub } = createSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.reject(new Error("Repository error")));

    await expect(sut.load("any_id")).rejects.toThrow(new Error("Repository error"));
  });

  it("should return a SurveyResultModel on success", async () => {
    const { sut } = createSut();

    const result = await sut.load("any_id");

    expect(result).toEqual(mockSurveyResultModel());
  });

  it("should call FindSurveyByIdRepository if LoadSurveyResultRepository returns null", async () => {
    const { sut, loadSurveyResultRepositoryStub, findSurveyByIdRepositoryStub } = createSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.resolve(null));
    const findById = jest.spyOn(findSurveyByIdRepositoryStub, "findById");

    await sut.load("any_id");

    expect(findById).toHaveBeenCalledWith("any_id");
  });

  it("should return a SurveyResultModel that every answers have count and percent as 0", async () => {
    const { sut, loadSurveyResultRepositoryStub } = createSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.load("any_id");

    const expectedResult: SurveyResultModel = {
      ...mockSurveyResultModel(),
      answers: [{ ...mockSurveyResultModel().answers[0], count: 0, percent: 0 }],
    };
    expect(result).toEqual(expectedResult);
  });

  it("should return null if there is no survey with the specified id", async () => {
    const { sut, loadSurveyResultRepositoryStub, findSurveyByIdRepositoryStub } = createSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, "loadBySurveyId")
      .mockReturnValueOnce(Promise.resolve(null));
    jest.spyOn(findSurveyByIdRepositoryStub, "findById").mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.load("any_non_existing_id");

    expect(result).toBeNull();
  });
});
