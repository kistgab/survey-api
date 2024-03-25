import { DbLoadSurveyResult } from "@src/data/usecases/survey-answer/load-survey-result/db-load-survey-result";
import { SurveyAnswerMongoRepository } from "@src/infra/db/mongodb/survey-answer/survey-answer-mongo-repository";
import { SurveyMongoRepository } from "@src/infra/db/mongodb/survey/survey-mongo-repository";
import { LoadSurveyResultController } from "@src/presentation/controllers/survey-answer/load-survey-result/load-survey-result-controller";

export class LoadSurveyResultControllerFactory {
  static create(): LoadSurveyResultController {
    const surveyRepository = new SurveyMongoRepository();
    const surveyAnswersRepository = new SurveyAnswerMongoRepository();
    const loadSurveyResult = new DbLoadSurveyResult(surveyAnswersRepository, surveyRepository);
    return new LoadSurveyResultController(loadSurveyResult);
  }
}
