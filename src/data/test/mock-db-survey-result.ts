import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { mockSurveyResultModel } from "@src/domain/test/mock-survey";

export function mockLoadSurveyResultRepository(): LoadSurveyResultRepository {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel());
    }
  }
  return new LoadSurveyResultRepositoryStub();
}
