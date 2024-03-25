import { SurveyResultModel } from "@src/data/models/survey-result-model";

export interface LoadSurveyResultRepository {
  loadBySurveyId(id: string): Promise<SurveyResultModel | null>;
}
