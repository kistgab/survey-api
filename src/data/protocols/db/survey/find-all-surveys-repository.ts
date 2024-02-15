import { SurveyModel } from "../../../models/survey-model";

export interface FindAllSurveysRepository {
  findAll(): Promise<SurveyModel[]>;
}
