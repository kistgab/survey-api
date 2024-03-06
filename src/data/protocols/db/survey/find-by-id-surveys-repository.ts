import { SurveyModel } from "@src/data/models/survey-model";

export interface FindSurveyByIdRepository {
  findById(id: string): Promise<SurveyModel | null>;
}
