import { SurveyResultModel } from "@src/data/models/survey-result-model";

export interface LoadSurveyResult {
  load(surveyId: string): Promise<SurveyResultModel | null>;
}
