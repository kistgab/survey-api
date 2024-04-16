import { SurveyResultModel } from "@src/data/models/survey-result-model";

export interface LoadSurveyResult {
  load(surveyId: string, accountId: string): Promise<SurveyResultModel | null>;
}
