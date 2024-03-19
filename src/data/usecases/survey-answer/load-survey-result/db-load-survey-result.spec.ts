import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { mockLoadSurveyResultRepository } from "@src/data/test/mock-db-survey-result";
import { DbLoadSurveyResult } from "@src/data/usecases/survey-answer/load-survey-result/db-load-survey-result";
import { LoadSurveyResult } from "@src/domain/usecases/survey-answer/load-survey-result";

type SutTypes = {
  sut: LoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

function createSut(): SutTypes {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub,
  };
}

describe("DbLoadSurveyResult UseCase", () => {
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
});
