import { DbListSurveys } from "../../../../data/usecases/survey/list-surveys/db-list-surveys";
import { SurveyMongoRepository } from "../../../../infra/db/mongodb/survey/survey-mongo-repository";

export default abstract class DbListSurveysFactory {
  static create(): DbListSurveys {
    const surveyRepository = new SurveyMongoRepository();
    return new DbListSurveys(surveyRepository);
  }
}
