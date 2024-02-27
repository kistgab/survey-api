import { SurveyModel } from "@src/data/models/survey-model";
import { FindByIdSurveysRepository } from "@src/data/protocols/db/survey/find-by-id-surveys-repository";
import { ListSurveyById } from "@src/domain/usecases/list-survey-by-id";

export class DbListSurveyById implements ListSurveyById {
  constructor(private readonly findByIdSurveysRepository: FindByIdSurveysRepository) {}

  async list(id: string): Promise<SurveyModel> {
    await Promise.resolve(id);
    await this.findByIdSurveysRepository.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return null!;
  }
}
