import { DbListSurveys } from "@src/data/usecases/survey/list-surveys/db-list-surveys";
import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";

export default abstract class DbListSurveysFactory {
  static create(): DbListSurveys {
    const surveyRepository = new SurveyMongoRepository();
    return new DbListSurveys(surveyRepository);
  }
}
