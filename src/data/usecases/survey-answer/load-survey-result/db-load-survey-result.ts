import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { LoadSurveyResult } from "@src/domain/usecases/survey-answer/load-survey-result";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel | null> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    if (surveyResult) {
      return surveyResult;
    }
    const survey = await this.findSurveyByIdRepository.findById(surveyId);
    if (!survey) {
      return null;
    }
    surveyResult = {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0,
      })),
    };
    return surveyResult;
  }
}
