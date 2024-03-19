import { DbAnswerSurvey } from "@src/data/usecases/survey-answer/answer-survey/db-answer-survey";
import AnswerSurvey from "@src/domain/usecases/survey-answer/answer-survey";
import { SurveyAnswerMongoRepository } from "@src/infra/db/mongodb/survey-answer/survey-answer-mongo-repository";

export default abstract class DbAnswerSurveyFactory {
  static create(): AnswerSurvey {
    const surveyAnswerMongoRepository = new SurveyAnswerMongoRepository();
    const dbAnswerSurvey = new DbAnswerSurvey(
      surveyAnswerMongoRepository,
      surveyAnswerMongoRepository,
    );
    return dbAnswerSurvey;
  }
}
