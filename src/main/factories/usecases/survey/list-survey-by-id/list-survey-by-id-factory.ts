import { DbListSurveyById } from "@src/data/usecases/survey/list-survey-by-id/db-list-survey-by-id";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";

export default abstract class DbListSurveyByIdFactory {
  static create(): ListSurveyById {
    const surveyRepository = new SurveyMongoRepository();
    return new DbListSurveyById(surveyRepository);
  }
}
