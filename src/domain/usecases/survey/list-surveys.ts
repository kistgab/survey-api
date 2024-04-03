import { SurveyModel } from "@src/data/models/survey-model";

export interface ListSurveys {
  list(accountId: string): Promise<SurveyModel[]>;
}
