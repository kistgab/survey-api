import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SurveyModel } from "@src/data/models/survey-model";
import AddSurveyRepository from "@src/data/protocols/db/survey/add-survey-repository";
import { FindAllSurveysRepository } from "@src/data/protocols/db/survey/find-all-surveys-repository";
import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { SaveSurveyAnswerRepository } from "@src/data/protocols/db/survey/save-survey-answer-repository";
import {
  mockSurveyAnswerModel,
  mockSurveyModel,
  mockSurveyModelList,
} from "@src/domain/test/mock-survey";

export function mockSurveyRepository(): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
}

export function mockFindAllSurveysRepository(): FindAllSurveysRepository {
  class FindAllSurveysRepositoryStub implements FindAllSurveysRepository {
    async findAll(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModelList());
    }
  }
  return new FindAllSurveysRepositoryStub();
}

export function mockFindSurveyByIdRepository(): FindSurveyByIdRepository {
  class FindSurveyByIdRepositoryStub implements FindSurveyByIdRepository {
    async findById(): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new FindSurveyByIdRepositoryStub();
}

export function mockSaveSurveyAnswerRepository(): SaveSurveyAnswerRepository {
  class SaveSurveyRepositoryStub implements SaveSurveyAnswerRepository {
    async save(): Promise<SurveyAnswerModel> {
      return Promise.resolve(mockSurveyAnswerModel());
    }
  }
  return new SaveSurveyRepositoryStub();
}
