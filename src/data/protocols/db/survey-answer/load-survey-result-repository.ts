import { SurveyResultModel } from "@src/data/models/survey-result-model";

export interface LoadSurveyResultRepository {
  loadBySurveyId(id: string, accountId: string): Promise<SurveyResultModel | null>;
}
