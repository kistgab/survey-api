import { SurveyModel } from "@src/data/models/survey-model";

export interface FindByIdSurveysRepository {
  findById(id: string): Promise<SurveyModel>;
}
