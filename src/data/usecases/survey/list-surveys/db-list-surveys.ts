import { SurveyModel } from "@src/data/models/survey-model";
import { FindAllSurveysRepository } from "@src/data/protocols/db/survey/find-all-surveys-repository";
import { ListSurveys } from "@src/domain/usecases/survey/list-surveys";

export class DbListSurveys implements ListSurveys {
  constructor(private readonly findAllSurveysRepository: FindAllSurveysRepository) {}

  async list(accountId: string): Promise<SurveyModel[]> {
    const surveys = this.findAllSurveysRepository.findAll(accountId);
    return surveys;
  }
}
