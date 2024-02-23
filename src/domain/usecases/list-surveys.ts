import { SurveyModel } from "@src/data/models/survey-model";

export interface ListSurveys {
  list(): Promise<SurveyModel[]>;
}
