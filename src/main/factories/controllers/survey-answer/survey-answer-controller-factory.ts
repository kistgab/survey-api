import { OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import LogControllerDecoratorFactory from "@src/main/factories/decorators/log-controller-decorator-factory";
import DbAnswerSurveyFactory from "@src/main/factories/usecases/survey-answer/answer-survey/db-answer-survey-factory";
import DbListSurveyByIdFactory from "@src/main/factories/usecases/survey/list-survey-by-id/list-survey-by-id-factory";
import {
  AnswerSurveyController,
  RequestAnswerSurvey,
} from "@src/presentation/controllers/survey-answer/answer-survey-controller";
import Controller from "@src/presentation/protocols/controller";

export default abstract class SurveyAnswerControllerFactory {
  static create(): Controller<RequestAnswerSurvey, OutputAnswerSurveyDto> {
    const controller = new AnswerSurveyController(
      DbListSurveyByIdFactory.create(),
      DbAnswerSurveyFactory.create(),
    );
    return LogControllerDecoratorFactory.create(controller);
  }
}
