import { SurveyModel } from "@src/data/models/survey-model";

export interface ListSurveyById {
  list(id: string): Promise<SurveyModel>;
}
