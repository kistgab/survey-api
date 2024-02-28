import { SurveyModel } from "@src/data/models/survey-model";
import { FindSurveyByIdRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";

export class DbListSurveyById implements ListSurveyById {
  constructor(private readonly findByIdSurveysRepository: FindSurveyByIdRepository) {}

  async list(id: string): Promise<SurveyModel | null> {
    const survey = await this.findByIdSurveysRepository.findById(id);
    return survey;
  }
}
