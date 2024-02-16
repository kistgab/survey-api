import { ListSurveys } from "../../../../domain/usecases/list-surveys";
import { SurveyModel } from "../../../models/survey-model";
import { FindAllSurveysRepository } from "../../../protocols/db/survey/find-all-surveys-repository";

export class DbListSurveys implements ListSurveys {
  constructor(private readonly findAllSurveysRepository: FindAllSurveysRepository) {}

  async list(): Promise<SurveyModel[]> {
    const surveys = this.findAllSurveysRepository.findAll();
    return surveys;
  }
}
