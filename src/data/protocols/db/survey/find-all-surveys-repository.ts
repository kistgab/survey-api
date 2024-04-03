import { SurveyModel } from "@src/data/models/survey-model";

export interface FindAllSurveysRepository {
  findAll(accountId: string): Promise<SurveyModel[]>;
}
