import { SurveyModel } from "../../data/models/survey-model";

export interface ListSurveys {
  list(): Promise<SurveyModel[]>;
}
