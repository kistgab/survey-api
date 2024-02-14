import DbAddSurvey from "../../../../data/usecases/survey/add-survey/db-add-survey";
import AddSurvey from "../../../../domain/usecases/add-survey";
import { SurveyMongoRepository } from "../../../../infra/db/mongodb/survey/survey-mongo-repository";

export default abstract class DbAddSurveyFactory {
  static create(): AddSurvey {
    const surveyMongoRepository = new SurveyMongoRepository();
    return new DbAddSurvey(surveyMongoRepository);
  }
}
