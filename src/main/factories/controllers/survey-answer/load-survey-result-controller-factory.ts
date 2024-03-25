import { DbListSurveyById } from "@src/data/usecases/survey/list-survey-by-id/db-list-survey-by-id";
import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";
import { LoadSurveyResultController } from "@src/presentation/controllers/survey-answer/load-survey-result/load-survey-result-controller";

export class LoadSurveyResultControllerFactory {
  static create(): LoadSurveyResultController {
    const findByIdRepository = new SurveyMongoRepository();
    const loadSurveyById = new DbListSurveyById(findByIdRepository);
    return new LoadSurveyResultController(loadSurveyById);
  }
}
