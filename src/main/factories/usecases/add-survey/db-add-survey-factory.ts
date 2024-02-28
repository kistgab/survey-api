import DbAddSurvey from "@src/data/usecases/survey/add-survey/db-add-survey";
import AddSurvey from "@src/domain/usecases/survey/add-survey";
import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";

export default abstract class DbAddSurveyFactory {
  static create(): AddSurvey {
    const surveyMongoRepository = new SurveyMongoRepository();
    return new DbAddSurvey(surveyMongoRepository);
  }
}
