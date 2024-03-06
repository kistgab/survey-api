import AddSurveyValidationFactory from "@src/main/factories/controllers/survey/add-survey/add-survey-validation-factory";
import LogControllerDecoratorFactory from "@src/main/factories/decorators/log-controller-decorator-factory";
import DbAddSurveyFactory from "@src/main/factories/usecases/survey/add-survey/db-add-survey-factory";
import {
  AddSurveyController,
  RequestAddSurveyBody,
} from "@src/presentation/controllers/survey/add-survey/add-survey-controller";
import Controller from "@src/presentation/protocols/controller";

export default abstract class AddSurveyControllerFactory {
  static create(): Controller<RequestAddSurveyBody, Error | null> {
    const controller = new AddSurveyController(
      AddSurveyValidationFactory.create(),
      DbAddSurveyFactory.create(),
    );
    return LogControllerDecoratorFactory.create(controller);
  }
}
