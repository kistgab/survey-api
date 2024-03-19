import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResultRepository } from "@src/data/protocols/db/survey-answer/load-survey-result-repository";
import { LoadSurveyResult } from "@src/domain/usecases/survey-answer/load-survey-result";

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return await Promise.resolve(null!);
  }
}
