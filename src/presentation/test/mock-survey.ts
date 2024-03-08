import { SurveyModel } from "@src/data/models/survey-model";
import { OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import {
  mockOutputSurveyAnswerDto,
  mockSurveyModel,
  mockSurveyModelList,
} from "@src/domain/test/mock-survey";
import AnswerSurvey from "@src/domain/usecases/survey-answer/answer-survey";
import AddSurvey from "@src/domain/usecases/survey/add-survey";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
import { ListSurveys } from "@src/domain/usecases/survey/list-surveys";

export function mockAddSurvey(): AddSurvey {
  class AddSurveyStub implements AddSurvey {
    async add(): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyStub();
}

export function mockListSurveys(): ListSurveys {
  class ListSurveysStub implements ListSurveys {
    async list(): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveyModelList());
    }
  }
  return new ListSurveysStub();
}

export function mockListSurveyById(): ListSurveyById {
  class ListSurveyByIdStub implements ListSurveyById {
    async list(): Promise<SurveyModel | null> {
      return Promise.resolve(mockSurveyModel());
    }
  }
  return new ListSurveyByIdStub();
}

export function mockAnswerSurvey(): AnswerSurvey {
  class AnswerSurveyStub implements AnswerSurvey {
    async answer(): Promise<OutputAnswerSurveyDto> {
      return Promise.resolve(mockOutputSurveyAnswerDto());
    }
  }
  return new AnswerSurveyStub();
}
